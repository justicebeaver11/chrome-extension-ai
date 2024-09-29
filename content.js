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








function extractEmailInfo() {
    // Gmail DOM is dynamic, so we need to carefully select the sender and recipient info
    let emailContainers = document.querySelectorAll('div[data-message-id]'); // Each email thread/message has a unique data-message-id

    // Traverse the email containers to extract information of the currently opened message
    let emailInfo = null;

    emailContainers.forEach((emailContainer) => {
        // Find the active/open email (may need to adjust based on your current scenario)
        let senderElement = emailContainer.querySelector('span[email]');
        let recipientElements = emailContainer.querySelectorAll('span[email]');

        if (senderElement && recipientElements.length > 0) {
            // Extract sender info
            let senderEmail = senderElement.getAttribute('email') || 'Unknown Sender Email';
            let senderName = senderElement.getAttribute('name') || senderElement.textContent || 'Unknown Sender Name';

            // Extract recipient info (Usually the second span, but may change based on structure)
            let recipientEmail = recipientElements.length > 1 ? recipientElements[1].getAttribute('email') : 'Unknown Recipient Email';
            let recipientName = recipientElements.length > 1 ? recipientElements[1].getAttribute('name') || recipientElements[1].textContent : 'Unknown Recipient Name';

            emailInfo = {
                sender: {
                    name: senderName,
                    email: senderEmail
                },
                recipient: {
                    name: recipientName,
                    email: recipientEmail
                }
            };

            // Log the extracted details
            console.log("Sender's Name: " + senderName);
            console.log("Sender's Email: " + senderEmail);
            console.log("Recipient's Name: " + recipientName);
            console.log("Recipient's Email: " + recipientEmail);
        }
    });

    if (!emailInfo) {
        console.log('Failed to extract email information. The structure may have changed.');
    }

    return emailInfo;
}

// Modify the injectReplyAIButton function
function injectReplyAIButton(toolbar) {
    // Ensure no duplicate buttons
    if (!toolbar.querySelector('.ai-reply-button')) {
        const aiButton = document.createElement('button');
        aiButton.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
        aiButton.setAttribute('role', 'button');
        aiButton.setAttribute('tabindex', '1');
        aiButton.setAttribute('data-tooltip', 'AI');
        aiButton.setAttribute('aria-label', 'AI');
        aiButton.style.userSelect = 'none';
        aiButton.innerText = 'AI Reply';

        // Custom styling
        aiButton.style.borderRadius = '8px';
        aiButton.style.padding = '10px 20px';
        aiButton.style.border = '1px solid #3996fb';
        aiButton.style.backgroundColor = '#fff';
        aiButton.style.color = '#3996fb';
        aiButton.style.cursor = 'pointer';
        aiButton.style.marginLeft = '10px';

        // Simple hover effect
        aiButton.addEventListener('mouseover', () => {
            aiButton.style.backgroundColor = '#3996fb';
            aiButton.style.color = '#fff';
        });
        aiButton.addEventListener('mouseout', () => {
            aiButton.style.backgroundColor = '#fff';
            aiButton.style.color = '#3996fb';
        });

        toolbar.appendChild(aiButton);

        aiButton.addEventListener('click', () => {
            // Disable the button to prevent multiple clicks
            aiButton.disabled = true;

            // Extract sender and recipient information
            const emailDetails = extractEmailInfo();
            if (emailDetails) {
                console.log("Logging Extracted Details from Click Event: ", emailDetails);

                // Send message to background script to open popup with the recipient information
                chrome.runtime.sendMessage({
                    action: 'reply_modal',
                    gmail: true,
                    recipient: emailDetails.sender // Send sender details as recipient
                });

                setTimeout(() => {
                    aiButton.disabled = false;
                }, 1000); // Adjust delay as necessary
            }
        });
    }
}


function waitForReplyBox() {
    const targetNode = document.body;

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            const replyToolbar = document.querySelector('tr.btC .dC');
            if (replyToolbar) {
                injectReplyAIButton(replyToolbar);
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
}

waitForReplyBox();


// function injectReplyAIButton(toolbar) {
//     // Ensure no duplicate buttons
//     if (!toolbar.querySelector('.ai-reply-button')) {
//         const aiButton = document.createElement('button');
//         aiButton.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';  // Reuse Gmail's button styling
//         aiButton.setAttribute('role', 'button');
//         aiButton.setAttribute('tabindex', '1');
//         aiButton.setAttribute('data-tooltip', 'AI');
//         aiButton.setAttribute('aria-label', 'AI');
//         aiButton.style.userSelect = 'none';
//         aiButton.innerText = 'AI Reply';

//         // Custom styling for rounded edges and simple look
//         aiButton.style.borderRadius = '8px';  // Rounded edges
//         aiButton.style.padding = '10px 20px';  // Padding
//         aiButton.style.border = '1px solid #3996fb';  // Light blue border
//         aiButton.style.backgroundColor = '#fff';  // White background
//         aiButton.style.color = '#3996fb';  // Light blue text color
//         aiButton.style.cursor = 'pointer';  // Pointer cursor
//         aiButton.style.marginLeft = '10px';  // Left margin for spacing

//         // Simple hover effect
//         aiButton.addEventListener('mouseover', () => {
//             aiButton.style.backgroundColor = '#3996fb';
//             aiButton.style.color = '#fff';
//         });
//         aiButton.addEventListener('mouseout', () => {
//             aiButton.style.backgroundColor = '#fff';
//             aiButton.style.color = '#3996fb';
//         });

//         toolbar.appendChild(aiButton);

//         aiButton.addEventListener('click', () => {
//             // Disable the button to prevent multiple clicks
//             aiButton.disabled = true;
        
//             // Send message to background script to open popup
//             chrome.runtime.sendMessage({ action: 'reply_modal', gmail: true });
        
//             // Optionally, re-enable the button after a brief delay
//             setTimeout(() => {
//                 aiButton.disabled = false;
//             }, 1000); // Adjust delay as necessary
//         });


//     }
// }

// function waitForReplyBox() {
//     const targetNode = document.body;

//     // Set up a mutation observer to watch for changes in the Gmail DOM
//     const observer = new MutationObserver((mutationsList) => {
//         mutationsList.forEach(mutation => {
//             const replyToolbar = document.querySelector('tr.btC .dC'); // The class where the toolbar is located
//             if (replyToolbar) {
//                 injectReplyAIButton(replyToolbar);  // Inject the button once the toolbar is found
//             }
//         });
//     });

//     // Configuration for the observer
//     const config = { childList: true, subtree: true };

//     // Start observing the DOM
//     observer.observe(targetNode, config);
// }

function injectComposeAIButton() {
    if (window.location.hostname === "mail.google.com") {
        const composeButton = document.querySelector('div[role="button"][gh="cm"]');

        if (composeButton) {
            if (!document.querySelector('#ai-compose-button')) {
                const aiButton = document.createElement('button');
                aiButton.id = 'ai-compose-button';

                const icon = document.createElement('span');
                icon.innerHTML = ` 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star" style="width: 20px; height: 20px; margin-right: 10px;">
                        <path d="M12 17.27L18.18 21l-1.45-6.36L22 9.24l-6.36-.55L12 2 8.36 8.69 2 9.24l5.27 5.27L5.82 21z"/>
                    </svg>
                `;

                aiButton.appendChild(icon);
                aiButton.appendChild(document.createTextNode('AI'));

                // Custom styling for the compose button
                aiButton.style.marginLeft = '10px';  // Left margin
                aiButton.style.backgroundColor = '#3996fb';  // Blue background
                aiButton.style.color = 'white';  // White text color
                aiButton.style.border = 'none';  // No border
                aiButton.style.padding = '12px 20px';  // Padding
                aiButton.style.borderRadius = '8px';  // Rounded edges
                aiButton.style.cursor = 'pointer';  // Pointer cursor
                aiButton.style.display = 'flex';  // Flex display
                aiButton.style.alignItems = 'center';  // Center items vertically
                aiButton.style.fontSize = '16px';  // Font size
                aiButton.style.fontWeight = 'bold';  // Bold text

                composeButton.parentElement.appendChild(aiButton);

                aiButton.addEventListener('click', () => {
                    composeButton.click();

                    // Send message to background script to open popup
                    chrome.runtime.sendMessage({ action: 'trigger_modal', gmail: true });
                });
            }
        } else {
            setTimeout(injectComposeAIButton, 1000);  // Retry if the compose button is not found
        }
    }
}

// Event listeners
window.addEventListener('load', () => {
    injectComposeAIButton();  // Call the compose button function
    waitForReplyBox();  // Call the reply box function
});



