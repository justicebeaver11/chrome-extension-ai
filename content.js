// Function to get and send the updated credits
function updateCredits() {
    const creditElement = document.querySelector('#creditbalance');
    if (creditElement) {
        const remainingCredits = creditElement.textContent.trim();
        
        console.log(remainingCredits);
        chrome.runtime.sendMessage({ action: 'updateCredits', credits: remainingCredits });
    }
}

// Listen for changes in the credit balance using MutationObserver
const targetNode = document.querySelector('#creditbalance');
if (targetNode) {
    const observer = new MutationObserver(updateCredits);
    observer.observe(targetNode, { characterData: true, childList: true, subtree: true });

    updateCredits();
}


// content.js
// content.js
// content.js

// Function to get the entire HTML of the page's body
// function getWebpageHTML() {
//     return document.body.outerHTML;
// }

// // Listen for messages from popup.js or background.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'getPageHTML') {
//         // Send the webpage's HTML content back to the popup.js or background.js
//         const htmlContent = getWebpageHTML();
//         sendResponse({ success: true, html: htmlContent });
//     }
// });

  

  
