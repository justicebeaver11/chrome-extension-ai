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









// function injectAIButton() {
//     // Check if we are on Gmail
//     if (window.location.hostname === "mail.google.com") {
//         // Wait for the compose button to load
//         const composeButton = document.querySelector('div[role="button"][gh="cm"]');

//         if (composeButton) {
//             // Check if the AI button already exists to avoid duplication
//             if (!document.querySelector('#ai-button')) {
//                 // Create the new AI button
//                 const aiButton = document.createElement('button');
//                 aiButton.id = 'ai-button';

//                 // Create the SVG icon
//                 const icon = document.createElement('span');
//                 icon.innerHTML = `
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star" style="width: 20px; height: 20px; margin-right: 10px;">
//                         <path d="M12 17.27L18.18 21l-1.45-6.36L22 9.24l-6.36-.55L12 2 8.36 8.69 2 9.24l5.27 5.27L5.82 21z"/>
//                     </svg>
//                 `;

//                 // Add the icon and text to the button
//                 aiButton.appendChild(icon);
//                 aiButton.appendChild(document.createTextNode('AI'));

//                 // Style the button
//                 aiButton.style.marginLeft = '10px'; // Spacing between buttons
//                 aiButton.style.backgroundColor = '#3996fb'; // Styling the button
//                 aiButton.style.color = 'white';
//                 aiButton.style.border = 'none';
//                 aiButton.style.padding = '12px 20px'; // Larger padding for height and width
//                 aiButton.style.borderRadius = '8px'; // Slightly more rounded corners
//                 aiButton.style.cursor = 'pointer';
//                 aiButton.style.display = 'flex';
//                 aiButton.style.alignItems = 'center'; // Center the icon and text vertically
//                 aiButton.style.fontSize = '16px'; // Adjust text size if needed
//                 aiButton.style.fontWeight = 'bold'; // Make text bold if needed

//                 // Append the AI button next to the compose button
//                 composeButton.parentElement.appendChild(aiButton);

//                 // Handle click event to trigger compose and open popup
//                 aiButton.addEventListener('click', () => {
//                     // Trigger the Gmail compose button click
//                     composeButton.click();

//                     // Open the extension's popup after the compose button is clicked
//                     chrome.runtime.sendMessage({ action: 'open_popup' });
//                 });
//             }
//         } else {
//             // Retry after a short delay if the button hasn't loaded yet
//             setTimeout(injectAIButton, 1000);
//         }
//     }
// }

// // Wait for the Gmail page to fully load
// window.addEventListener('load', injectAIButton);



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
                    chrome.runtime.sendMessage({ action: 'trigger_modal' });
                });
            }
        } else {
            setTimeout(injectAIButton, 1000);
        }
    }
}

window.addEventListener('load', injectAIButton);

