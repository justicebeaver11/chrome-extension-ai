chrome.runtime.onInstalled.addListener(() => {
    console.log("AI4Chat Extension Installed");
});

async function checkCookies() {
    return new Promise((resolve) => {
        chrome.cookies.get({ url: "https://app.ai4chat.co", name: "session_token" }, (cookie) => { // Ensure correct URL and cookie name
            resolve(cookie ? cookie.value : null);
        });
    });
}

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') {
        updateLoginStatus();
    }
});

chrome.webNavigation.onCompleted.addListener(
    () => {
        updateLoginStatus();
    },
    { url: [{ hostContains: 'app.ai4chat.co' }] }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateCredits') {
        const updatedCredits = message.credits;

        // Store the updated credits in chrome storage
        chrome.storage.local.set({ credits: updatedCredits }, () => {
            console.log('Credits updated in storage:', updatedCredits);

        
            chrome.runtime.sendMessage({ action: 'creditsUpdated', credits: updatedCredits });
        });
    }
});


setInterval(() => {
    chrome.storage.local.get('credits', (result) => {
        if (result.credits) {
            console.log('Credits currently in storage:', result.credits);
        }
    });
}, 60000); 

  
// Function to create a movable popup window
function openMovablePopup() {
    chrome.windows.create({
      url: "popup.html",
      type: "popup",
      width: 500,
      height: 600,
      top: 100,
      left: 100
    }, (window) => {
      // Store window position in localStorage to restore it later if needed
      chrome.windows.onBoundsChanged.addListener(() => {
        chrome.windows.get(window.id, (updatedWindow) => {
          localStorage.setItem('windowTop', updatedWindow.top);
          localStorage.setItem('windowLeft', updatedWindow.left);
        });
      });
    });
  }
  
  // Handle the click event on the extension icon
  chrome.action.onClicked.addListener(() => {
    openMovablePopup();
  });
  
  // Handle keyboard shortcut (Ctrl + Space)
  chrome.commands.onCommand.addListener((command) => {
    if (command === "open_movable_popup") {
      openMovablePopup();
    }
  });
  








