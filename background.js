chrome.runtime.onInstalled.addListener(() => {
  console.log("AI4Chat Extension Installed");
});

async function checkCookies() {
  return new Promise((resolve) => {
    chrome.cookies.get(
      { url: "https://app.ai4chat.co", name: "session_token" },
      (cookie) => {
        resolve(cookie ? cookie.value : null);
      }
    );
  });
}

async function updateLoginStatus() {
  const sessionToken = await checkCookies();
  if (sessionToken) {
    console.log("Session Token:", sessionToken);
    chrome.storage.local.set({ sessionToken: sessionToken });
  } else {
    console.log("Session token not found.");
    chrome.storage.local.remove("sessionToken");
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    updateLoginStatus();
  }
});

chrome.webNavigation.onCompleted.addListener(
  () => {
    updateLoginStatus();
  },
  { url: [{ hostContains: "app.ai4chat.co" }] }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateCredits") {
    const updatedCredits = message.credits;
    chrome.storage.local.set({ credits: updatedCredits }, () => {
      console.log("Credits updated in storage:", updatedCredits);
      chrome.runtime.sendMessage({
        action: "creditsUpdated",
        credits: updatedCredits,
      });
    });
  }

  // Handle the message to get the current tab URL
});

setInterval(() => {
  chrome.storage.local.get("credits", (result) => {
    if (result.credits) {
      console.log("Credits currently in storage:", result.credits);
    }
  });
}, 60000);

// Function to create a movable popup window
function openMovablePopup() {
  chrome.windows.create(
    {
      url: "popup.html",
      type: "popup",
      width: 550,
      height: 650,
      top: 100,
      left: 100,
    },
    (window) => {
      chrome.windows.onBoundsChanged.addListener(() => {
        chrome.windows.get(window.id, (updatedWindow) => {
          localStorage.setItem("windowTop", updatedWindow.top);
          localStorage.setItem("windowLeft", updatedWindow.left);
        });
      });
    }
  );
}

// Handle the click event on the extension icon
chrome.action.onClicked.addListener(() => {
  openMovablePopup();
});

//Handle keyboard shortcut (Ctrl + Space)
chrome.commands.onCommand.addListener((command) => {
  if (command === "open_movable_popup") {
    openMovablePopup();
  }
});

let previousTabUrl = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    let currentTabUrl = tab.url;

    // Ignore chrome extension URLs and empty URLs (like chrome://newtab)
    if (
      !currentTabUrl.startsWith("chrome-extension://") &&
      currentTabUrl !== "chrome://newtab/"
    ) {
      if (previousTabUrl) {
        chrome.storage.local.set({ lastTabUrl: previousTabUrl }, () => {
          console.log("Stored last active tab URL in storage:", previousTabUrl);
        });
      }
      // Update previous URL
      previousTabUrl = currentTabUrl;
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "open_popup_with_options") {
    chrome.storage.local.set({ selectedText: request.text }, () => {
      console.log("Stored selected text in storage:", request.text);
    });

    // Send a message to the popup to open the options modal
    chrome.runtime.sendMessage({
      action: "show_options_modal",
      text: request.text,
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "trigger_modal" && message.gmail) {
    // Set Gmail state
    chrome.storage.local.set({ showModal: true });

    // Open the extension popup
    chrome.windows.create({
      url: "popup.html",
      type: "popup",
      width: 500,
      height: 600,
      top: 100,
      left: 100,
    });
  }
});

let popupOpen = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reply_modal" && message.gmail) {
    if (!popupOpen) {
      popupOpen = true;
      chrome.storage.local.set({
        showReplyModal: true,
        emailBody: message.emailBody,

        recipientInfo: message.recipient, // Store recipient info
      });

      chrome.windows.create({
        url: "popup.html",
        type: "popup",
        width: 500,
        height: 600,
        top: 100,
        left: 100,
      });
    }
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  popupOpen = false;
});


chrome.commands.onCommand.addListener((command) => {
  if (command === "inject_popup") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      // Check if the active tab URL is Google Search
      if (activeTab.url.includes("https://www.google.com/search")) {
        // Inject the popup content into the active tab
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: injectLiveSearchPopup
        });
      }
    });
  }
});






// Function to inject the Live Search Popup into the site
function injectLiveSearchPopup() {
  if (document.getElementById("liveSearchPopup")) return; // Avoid duplicates

  // Create a div for the popup
  const popup = document.createElement("div");
  popup.id = "liveSearchPopup";
  popup.style.position = "fixed";
  popup.style.right = "20px";
  popup.style.top = "100px";
  popup.style.width = "350px"; 
  popup.style.background = "#17182b";
  popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  popup.style.zIndex = "9999";
  popup.style.padding = "10px";
  popup.style.borderRadius = "8px";
  popup.style.display = "flex";
  popup.style.flexDirection = "column";

  // Create a top div for the button and search input
  const topDiv = document.createElement("div");
  topDiv.style.display = "flex"; 
  topDiv.style.justifyContent = "space-between"; 
  topDiv.style.alignItems = "center"; 
  topDiv.style.width = "100%";

  // "Live Search" button
  const button = document.createElement("button");
  button.innerText = "Live Search";
  button.style.width = "30%";
  button.style.padding = "10px";
  button.style.background = "#3996fb";
  button.style.color = "white";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.borderRadius = "5px";

  // Search input
  const searchDiv = document.createElement("div");
  searchDiv.style.width = "65%";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search";
  searchInput.style.width = "90%";
  searchInput.style.padding = "10px";
  searchInput.style.border = "1px solid #3996fb";
  searchInput.style.borderRadius = "5px";
  searchInput.style.background = "#17182b";
  searchInput.style.color = "white";

  // Append elements to topDiv
  searchDiv.appendChild(searchInput);
  topDiv.appendChild(button);
  topDiv.appendChild(searchDiv);

  // Empty div to display search box value
  const emptyDiv = document.createElement("div");
  emptyDiv.style.height = "20px";
  emptyDiv.style.marginTop = "10px";
  emptyDiv.style.color = "white";
  emptyDiv.innerText = "";
  popup.appendChild(topDiv);
  popup.appendChild(emptyDiv);

  // Bottom div for buttons
  const bottomDiv = document.createElement("div");
  bottomDiv.style.display = "flex";
  bottomDiv.style.justifyContent = "space-between"; 
  bottomDiv.style.marginTop = "10px";

  // "Ask a Follow-Up" button
  const askFollowUpButton = document.createElement("button");
  askFollowUpButton.innerText = "Ask a Follow-Up";
  askFollowUpButton.style.padding = "10px";
  askFollowUpButton.style.background = "#3996fb";
  askFollowUpButton.style.color = "white";
  askFollowUpButton.style.border = "none";
  askFollowUpButton.style.cursor = "pointer";
  askFollowUpButton.style.borderRadius = "5px";
  askFollowUpButton.style.flex = "1";

  // "Start a New Chat" button
  const newChatButton = document.createElement("button");
  newChatButton.innerText = "Start a New Chat";
  newChatButton.style.padding = "10px";
  newChatButton.style.background = "#3996fb";
  newChatButton.style.color = "white";
  newChatButton.style.border = "none";
  newChatButton.style.cursor = "pointer";
  newChatButton.style.borderRadius = "5px";
  newChatButton.style.flex = "1";
  newChatButton.style.marginLeft = "10px";

  // Append buttons to bottomDiv
  bottomDiv.appendChild(askFollowUpButton);
  bottomDiv.appendChild(newChatButton);

  // Append bottom div to popup
  popup.appendChild(bottomDiv);

  // Add popup to body
  document.body.appendChild(popup);

  // Event listener for Ctrl+I to remove the popup
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === 'I') {
      const existingPopup = document.getElementById("liveSearchPopup");
      if (existingPopup) existingPopup.remove();
    }
  });

  // Event listener for "Live Search" button
  button.addEventListener("click", () => {
    const searchBox = document.querySelector('textarea[name="q"], input[name="q"]');
    if (searchBox) {
      const searchValue = searchBox.value.trim();
      console.log("Search Box Value:", searchValue);
      emptyDiv.innerText = `Search Value: ${searchValue}`;
      chrome.runtime.sendMessage({ type: "sendSearchValue", searchValue });
      searchBox.addEventListener('input', (event) => {
        emptyDiv.innerText = `Search Value: ${event.target.value}`;
      });
    }
  });
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "chatbotResponse") {
    // Send the response to the injected site popup
    injectLiveSearchPopup();
    const sitePopup = document.getElementById("liveSearchPopup");
    if (sitePopup) {
      const responseDiv = document.createElement("div");
      responseDiv.style.marginTop = "10px";
      responseDiv.style.color = "white";
      responseDiv.innerText = `Response: ${message.response}`;
      sitePopup.appendChild(responseDiv);
    }
  }
  sendResponse({ status: "Message Received in Background.js" });
});






