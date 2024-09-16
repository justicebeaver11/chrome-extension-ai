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


// Listen for tab changes (when the user switches tabs)

// chrome.tabs.onActivated.addListener((activeInfo) => {
//     chrome.tabs.get(activeInfo.tabId, (tab) => {
//         let currentTabUrl = tab.url;

//         // Store the current tab's URL in chrome.storage.local
//         chrome.storage.local.set({ lastTabUrl: currentTabUrl }, () => {
//             console.log("Stored last active tab URL in storage:", currentTabUrl);
//         });
//     });
// });


//better
// let previousTabUrl = null;

// chrome.tabs.onActivated.addListener((activeInfo) => {
//     chrome.tabs.get(activeInfo.tabId, (tab) => {
//         let currentTabUrl = tab.url;

//         // Ignore chrome extension URLs
//         if (!currentTabUrl.startsWith("chrome-extension://")) {
//             // Store the previous URL before updating to the new one
//             if (previousTabUrl) {
//                 chrome.storage.local.set({ lastTabUrl: previousTabUrl }, () => {
//                     console.log("Stored last active tab URL in storage:", previousTabUrl);
//                 });
//             }

//             // Update the previous URL to the current tab's URL
//             previousTabUrl = currentTabUrl;
//         }
//     });
// });


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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab is fully loaded (status is 'complete') and if it's a valid URL
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith("chrome-extension://") && tab.url !== "chrome://newtab/") {
        // Store the current URL as the previous URL for the next tab switch
        if (previousTabUrl) {
            chrome.storage.local.set({ lastTabUrl: previousTabUrl }, () => {
                console.log("Updated last active tab URL in storage:", previousTabUrl);
            });
        }
        previousTabUrl = tab.url;
    }
});





  






