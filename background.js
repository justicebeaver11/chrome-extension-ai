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

