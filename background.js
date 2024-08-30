chrome.runtime.onInstalled.addListener(() => {
  console.log("AI4Chat Extension Installed");
});

// Function to check the presence of the session token cookie
function checkCookies() {
  return new Promise((resolve, reject) => {
    chrome.cookies.get({ url: "https://app.ai4chat.co/dashboard", name: "session_token" }, (cookie) => {
      if (cookie) {
        resolve(cookie.value); 
      } else {
        resolve(null);
      }
    });
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  const sessionToken = await checkCookies();
  if (sessionToken) {
    console.log("Session Token:", sessionToken);
  } else {
    console.log("Session token not found.");
  }
  chrome.storage.local.set({ isLoggedIn: !!sessionToken });
});








  




