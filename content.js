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


// Detect when the user presses Ctrl + M and get the selected text
// document.addEventListener("keydown", (event) => {
//     if (event.ctrlKey && event.key === "m") {
//         let selectedText = window.getSelection().toString().trim();
//         if (selectedText.length > 0) {
//             // Send the selected text to the background script
//             chrome.runtime.sendMessage({ action: "send_selected_text", text: selectedText });
//         }
//     }
// });

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "m") {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            // Send the selected text to the background script
            chrome.runtime.sendMessage({ action: "open_popup_with_options", text: selectedText });
        }
    }
});











function injectAIButton() {
    if (window.location.hostname === "mail.google.com") {
        const composeButton = document.querySelector('div[role="button"][gh="cm"]');

        if (composeButton) {
            if (!document.querySelector('#ai-button')) {
                const aiButton = document.createElement('button');
                aiButton.id = 'ai-button';

                const icon = document.createElement('span');
                icon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star" style="width: 20px; height: 20px; margin-right: 10px;">
                        <path d="M12 17.27L18.18 21l-1.45-6.36L22 9.24l-6.36-.55L12 2 8.36 8.69 2 9.24l5.27 5.27L5.82 21z"/>
                    </svg>
                `;
                
                aiButton.appendChild(icon);
                aiButton.appendChild(document.createTextNode('AI'));

                aiButton.style.marginLeft = '10px';
                aiButton.style.backgroundColor = '#3996fb';
                aiButton.style.color = 'white';
                aiButton.style.border = 'none';
                aiButton.style.padding = '12px 20px';
                aiButton.style.borderRadius = '8px';
                aiButton.style.cursor = 'pointer';
                aiButton.style.display = 'flex';
                aiButton.style.alignItems = 'center';
                aiButton.style.fontSize = '16px';
                aiButton.style.fontWeight = 'bold';

                composeButton.parentElement.appendChild(aiButton);

                aiButton.addEventListener('click', () => {
                    composeButton.click();

                    // Send message to background script to open popup
                    chrome.runtime.sendMessage({ action: 'trigger_modal', gmail: true });
                });
            }
        } else {
            setTimeout(injectAIButton, 1000);
        }
    }
}

window.addEventListener('load', injectAIButton);


