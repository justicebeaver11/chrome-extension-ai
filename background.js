chrome.runtime.onInstalled.addListener(() => { 
    console.log("AI4Chat Extension Installed");
});

async function checkCookies() {
    return new Promise((resolve) => {
        chrome.cookies.get({ url: "https://app.ai4chat.co", name: "session_token" }, (cookie) => {
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

chrome.webNavigation.onCompleted.addListener(() => {
    updateLoginStatus();
}, { url: [{ hostContains: 'app.ai4chat.co' }] });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateCredits') {
        const updatedCredits = message.credits;
        chrome.storage.local.set({ credits: updatedCredits }, () => {
            console.log('Credits updated in storage:', updatedCredits);
            chrome.runtime.sendMessage({ action: 'creditsUpdated', credits: updatedCredits });
        });
    }

    // Handle the message to get the current tab URL
    
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
      width: 550,
      height: 650,
      top: 100,
      left: 100
    }, (window) => {
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
        if (!currentTabUrl.startsWith("chrome-extension://") && currentTabUrl !== "chrome://newtab/") {
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
        chrome.runtime.sendMessage({ action: "show_options_modal", text: request.text });
    }
});



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'trigger_modal' && message.gmail) {
        // Set Gmail state
        chrome.storage.local.set({ showModal: true });
        
        // Open the extension popup
        chrome.windows.create({
            url: "popup.html",
            type: "popup",
            width: 500,
            height: 600,
            top: 100,
            left: 100
        });
    }
});

let popupOpen = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'reply_modal' && message.gmail) {
        if (!popupOpen) {
            popupOpen = true;
            chrome.storage.local.set({
                showReplyModal: true,
               
                recipientInfo: message.recipient // Store recipient info
            });

            chrome.windows.create({
                url: "popup.html",
                type: "popup",
                width: 500,
                height: 600,
                top: 100,
                left: 100
            });
        }
    }
});

chrome.windows.onRemoved.addListener((windowId) => {
    popupOpen = false;
});










  






