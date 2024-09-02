// chrome.runtime.onInstalled.addListener(() => {
//   console.log("AI4Chat Extension Installed");
// });

// // Function to check for session token cookie
// async function checkCookies() {
//   return new Promise((resolve) => {
//     chrome.cookies.get({ url: "https://app.ai4chat.co/dashboard", name: "session_token" }, (cookie) => {
//       resolve(cookie ? cookie.value : null);
//     });
//   });
// }

// // Function to update the login status in Chrome storage
// async function updateLoginStatus() {
//   const sessionToken = await checkCookies();
//   if (sessionToken) {
//     console.log("Session Token:", sessionToken);
//     chrome.storage.local.set({ sessionToken: sessionToken });
//   } else {
//     console.log("Session token not found.");
//     chrome.storage.local.remove('sessionToken');
//   }
// }

// // Update login status when the tab is updated
// chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
//   if (changeInfo.status === 'complete') {
//     updateLoginStatus();
//   }
// });

// // Update login status when navigation is completed
// chrome.webNavigation.onCompleted.addListener(
//   () => {
//     updateLoginStatus();
//   },
//   { url: [{ hostContains: 'app.ai4chat.co' }] }
// );

// // Handle messages from popup.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'sendMessage') {
//     sendMessageToChatbot(request.message).then(response => {
//       sendResponse(response);
//     });
//     return true;  // Keeps the message channel open for async response
//   }
// });

// // Send message to the chatbot backend
// async function sendMessageToChatbot(message) {
//   const sessionToken = await getSessionToken();
//   if (!sessionToken) {
//     return "Error: User not logged in.";
//   }

//   try {
//     const response = await fetch("https://app.ai4chat.co/chatgpt", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${sessionToken}`
//       },
//       body: JSON.stringify({ message: message })
//     });

//     if (!response.ok) {
//       throw new Error("Failed to send message");
//     }

//     const data = await response.json();
//     return data.response || "No response from chatbot.";
//   } catch (error) {
//     console.error("Error sending message:", error);
//     return "Error: Could not send message.";
//   }
// }

// // Function to get the session token from Chrome storage
// async function getSessionToken() {
//   return new Promise((resolve) => {
//     chrome.storage.local.get(['sessionToken'], (result) => {
//       resolve(result.sessionToken || null);
//     });
//   });
// }


chrome.runtime.onInstalled.addListener(() => {
  console.log("AI4Chat Extension Installed");
});

// Function to check for session token cookie
async function checkCookies() {
  return new Promise((resolve) => {
      chrome.cookies.get({ url: "https://app.ai4chat.co/dashboard", name: "session_token" }, (cookie) => {
          resolve(cookie ? cookie.value : null);
      });
  });
}

// Function to update the login status in Chrome storage
async function updateLoginStatus() {
  const sessionToken = await checkCookies();
  if (sessionToken) {
      console.log("Session Token:", sessionToken);
      chrome.storage.local.set({ sessionToken: sessionToken });
  } else {
      console.log("Session token not found.");
      chrome.storage.local.remove('sessionToken');
  }
}

// Update login status when the tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
      updateLoginStatus();
  }
});

// Update login status when navigation is completed
chrome.webNavigation.onCompleted.addListener(
  () => {
      updateLoginStatus();
  },
  { url: [{ hostContains: 'app.ai4chat.co' }] }
);

// Handle messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendMessage') {
      sendMessageToChatbot(request.message).then(response => {
          sendResponse(response);
      }).catch(error => {
          console.error('Error:', error);
          sendResponse('Error: Could not send message.');
      });
      return true; // Keeps the message channel open for async sendResponse
  }
});

// Send message to the chatbot via the Node.js backend
async function sendMessageToChatbot(message) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
      return "Error: User not logged in.";
  }

  try {
      const response = await fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionToken}`
          },
          body: JSON.stringify({ message })
      });

      if (!response.ok) {
          throw new Error("Failed to send message");
      }

      const data = await response.json();
      return data.response || "No response from chatbot.";
  } catch (error) {
      console.error("Error sending message:", error);
      return "Error: Could not send message.";
  }
}

// Retrieve session token from Chrome storage
async function getSessionToken() {
  return new Promise((resolve) => {
      chrome.storage.local.get(['sessionToken'], (result) => {
          resolve(result.sessionToken || null);
      });
  });
}











  




