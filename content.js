// Function to get and send the updated credits
function updateCredits() {
  const creditElement = document.querySelector("#creditbalance");
  if (creditElement) {
    const remainingCredits = creditElement.textContent.trim();

    console.log(remainingCredits);
    chrome.runtime.sendMessage({
      action: "updateCredits",
      credits: remainingCredits,
    });
  }
}

// Listen for changes in the credit balance using MutationObserver
const targetNode = document.querySelector("#creditbalance");
if (targetNode) {
  const observer = new MutationObserver(updateCredits);
  observer.observe(targetNode, {
    characterData: true,
    childList: true,
    subtree: true,
  });

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
      chrome.runtime.sendMessage({
        action: "open_popup_with_options",
        text: selectedText,
      });
    }
  }
});



// Gmail DOM is dynamic, so we need to carefully select the sender and recipient info
function extractEmailInfo() {
  let emailContainers = document.querySelectorAll("div[data-message-id]"); // Each email thread/message has a unique data-message-id
  let emailInfo = null;

  emailContainers.forEach((emailContainer) => {
    let senderElement = emailContainer.querySelector("span[email]");
    let recipientElements = emailContainer.querySelectorAll("span[email]");

    if (senderElement && recipientElements.length > 0) {
      // Extract sender and recipient info
      let senderEmail =
        senderElement.getAttribute("email") || "Unknown Sender Email";
      let senderName =
        senderElement.getAttribute("name") ||
        senderElement.textContent ||
        "Unknown Sender Name";
      let recipientEmail =
        recipientElements.length > 1
          ? recipientElements[1].getAttribute("email")
          : "Unknown Recipient Email";
      let recipientName =
        recipientElements.length > 1
          ? recipientElements[1].getAttribute("name") ||
            recipientElements[1].textContent
          : "Unknown Recipient Name";

      emailInfo = {
        sender: {
          name: senderName,
          email: senderEmail,
        },
        recipient: {
          name: recipientName,
          email: recipientEmail,
        },
      };

      // Log the extracted details
      console.log("Sender's Name: " + senderName);
      console.log("Sender's Email: " + senderEmail);
      console.log("Recipient's Name: " + recipientName);
      console.log("Recipient's Email: " + recipientEmail);
    }
  });

  if (!emailInfo) {
    console.log(
      "Failed to extract email information. The structure may have changed."
    );
  }

  return emailInfo;
}

// Function to extract text content from the currently opened Gmail email
function extractGmailEmailContent() {
  let emailBody = document.querySelector('div[role="main"]'); // Main content area of the opened email.

  if (!emailBody) {
    console.error(
      "Could not locate the email body. Make sure an email is open."
    );
    return "";
  }

  // Collect text content inside `span`, `p`, and other relevant tags inside the opened email.
  let textContent = Array.from(emailBody.querySelectorAll("span, p, div"))
    .map((element) => element.innerText.trim())
    .filter((text) => text.length > 0) // Filter out empty text.
    .join("\n"); // Join extracted texts with new lines.

  // Log the extracted text content to the console for verification.

  return textContent;
}

// Modify the injectReplyAIButton function
function injectReplyAIButton(toolbar) {
  // Ensure no duplicate buttons
  if (!toolbar.querySelector(".ai-reply-button")) {
    const aiButton = document.createElement("button");
    aiButton.className = "T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button";
    aiButton.setAttribute("role", "button");
    aiButton.setAttribute("tabindex", "1");
    aiButton.setAttribute("data-tooltip", "AI");
    aiButton.setAttribute("aria-label", "AI");
    aiButton.style.userSelect = "none";
    aiButton.innerText = "AI Reply";

    // Custom styling
    aiButton.style.borderRadius = "8px";
    aiButton.style.padding = "10px 20px";
    aiButton.style.border = "1px solid #3996fb";
    aiButton.style.backgroundColor = "#fff";
    aiButton.style.color = "#3996fb";
    aiButton.style.cursor = "pointer";
    aiButton.style.marginLeft = "10px";

    // Simple hover effect
    aiButton.addEventListener("mouseover", () => {
      aiButton.style.backgroundColor = "#3996fb";
      aiButton.style.color = "#fff";
    });
    aiButton.addEventListener("mouseout", () => {
      aiButton.style.backgroundColor = "#fff";
      aiButton.style.color = "#3996fb";
    });

    toolbar.appendChild(aiButton);

    // On button click
    aiButton.addEventListener("click", () => {
      // Disable the button to prevent multiple clicks
      aiButton.disabled = true;

      // Extract and log the sender and recipient information
      const emailDetails = extractEmailInfo();
      if (emailDetails) {
        console.log(
          "Logging Extracted Details from Click Event: ",
          emailDetails
        );

        // Extract and log the email body content
        const emailText = extractGmailEmailContent();

        // Log combined information (email details + email text content)
        console.log("Full Email Information: ", {
          ...emailDetails,
          emailBody: emailText,
        });

        // Send message to background script if needed
        chrome.runtime.sendMessage({
          action: "reply_modal",
          gmail: true,
          recipient: emailDetails.sender,
          emailBody: emailText,
        });
      }

      // Re-enable the button after a delay
      setTimeout(() => {
        aiButton.disabled = false;
      }, 1000); // Adjust delay as necessary
    });
  }
}

function waitForReplyBox() {
  const targetNode = document.body;

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      const replyToolbar = document.querySelector("tr.btC .dC");
      if (replyToolbar) {
        injectReplyAIButton(replyToolbar);
      }
    });
  });

  const config = { childList: true, subtree: true };
  observer.observe(targetNode, config);
}

waitForReplyBox();

function injectComposeAIButton() {
  if (window.location.hostname === "mail.google.com") {
    const composeButton = document.querySelector('div[role="button"][gh="cm"]');

    if (composeButton) {
      if (!document.querySelector("#ai-compose-button")) {
        const aiButton = document.createElement("button");
        aiButton.id = "ai-compose-button";

        const icon = document.createElement("span");
        icon.innerHTML = ` 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star" style="width: 20px; height: 20px; margin-right: 10px;">
                        <path d="M12 17.27L18.18 21l-1.45-6.36L22 9.24l-6.36-.55L12 2 8.36 8.69 2 9.24l5.27 5.27L5.82 21z"/>
                    </svg>
                `;

        aiButton.appendChild(icon);
        aiButton.appendChild(document.createTextNode("AI"));

        // Custom styling for the compose button
        aiButton.style.marginLeft = "10px"; // Left margin
        aiButton.style.backgroundColor = "#3996fb"; // Blue background
        aiButton.style.color = "white"; // White text color
        aiButton.style.border = "none"; // No border
        aiButton.style.padding = "12px 20px"; // Padding
        aiButton.style.borderRadius = "8px"; // Rounded edges
        aiButton.style.cursor = "pointer"; // Pointer cursor
        aiButton.style.display = "flex"; // Flex display
        aiButton.style.alignItems = "center"; // Center items vertically
        aiButton.style.fontSize = "16px"; // Font size
        aiButton.style.fontWeight = "bold"; // Bold text

        composeButton.parentElement.appendChild(aiButton);

        aiButton.addEventListener("click", () => {
          composeButton.click();

          // Send message to background script to open popup
          chrome.runtime.sendMessage({ action: "trigger_modal", gmail: true });
        });
      }
    } else {
      setTimeout(injectComposeAIButton, 1000); // Retry if the compose button is not found
    }
  }
}

// Event listeners
window.addEventListener("load", () => {
  injectComposeAIButton(); // Call the compose button function
  waitForReplyBox(); // Call the reply box function
});


function injectComposeAIButtonOutlook() {
  if (window.location.hostname.includes("outlook")) {
    const newMailButton = document.querySelector('button[aria-label="New mail"]');

    if (newMailButton) {
      if (!document.querySelector("#ai-compose-button-outlook")) {
        const aiButton = document.createElement("button");
        aiButton.id = "ai-compose-button-outlook";

        const icon = document.createElement("span");
        icon.innerHTML = ` 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star" style="width: 20px; height: 20px; margin-right: 10px;">
                        <path d="M12 17.27L18.18 21l-1.45-6.36L22 9.24l-6.36-.55L12 2 8.36 8.69 2 9.24l5.27 5.27L5.82 21z"/>
                    </svg>
                `;

        aiButton.appendChild(icon);
        aiButton.appendChild(document.createTextNode("AI"));

        // Custom styling for the compose button
        aiButton.style.marginLeft = "8px";
        aiButton.style.marginTop = "4px";
        aiButton.style.backgroundColor = "#3996fb";
        aiButton.style.color = "white";
        aiButton.style.border = "none";
        aiButton.style.padding = "4px 10px";
        aiButton.style.borderRadius = "8px";
        aiButton.style.cursor = "pointer";
        aiButton.style.display = "flex";
        aiButton.style.alignItems = "center";
        aiButton.style.fontSize = "16px";
        aiButton.style.fontWeight = "bold";

        newMailButton.parentElement.appendChild(aiButton);

        // aiButton.addEventListener("click", () => {
        //   newMailButton.click();
        //   chrome.runtime.sendMessage({ action: "trigger_modal", outlook: true });
        // });
      }
    } else {
      setTimeout(injectComposeAIButtonOutlook, 1000);
    }
  }
}

// Event listeners
window.addEventListener("load", () => {
  //injectComposeAIButtonGmail(); // Gmail button
  injectComposeAIButton();
  injectComposeAIButtonOutlook(); // Outlook button
  waitForReplyBox(); // Call the reply box function
});





window.addEventListener('load', function () {
  // Function to inject the AI-Reply button
  function injectAIReplyButton() {
      // Find the toolbar containing Reply and Forward buttons
      const toolbar = document.querySelector('div[role="toolbar"][aria-label="Quick actions"]');

      if (toolbar) {
          // Create the AI-Reply button
          const aiReplyButton = document.createElement('button');
          aiReplyButton.type = 'button';
          aiReplyButton.innerText = 'AI-Reply'; // Set the text to AI-Reply
          aiReplyButton.role = 'menuitem';
          aiReplyButton.className = 'fui-Button ai-reply-btn';

          // Add styles to the AI-Reply button
          aiReplyButton.style.backgroundColor = '#ffffff'; // White background
          aiReplyButton.style.color = '#3996fb'; // Text color blue
          aiReplyButton.style.border = '1px solid #3996fb'; // Blue border
          aiReplyButton.style.padding = '6px 12px'; // Padding adjusted for button
          aiReplyButton.style.marginRight = '4px'; // Space between buttons
          aiReplyButton.style.cursor = 'pointer'; // Pointer cursor on hover
          aiReplyButton.style.fontSize = '14px'; // Font size to match other buttons
          aiReplyButton.style.fontFamily = 'Arial, sans-serif'; // Simple font family
          aiReplyButton.style.lineHeight = '1.5'; // Line height to ensure text fits properly
          aiReplyButton.style.height = '29px'; // Set height to ensure uniformity
          aiReplyButton.style.display = 'inline-flex'; // Inline-flex to match toolbar buttons
          aiReplyButton.style.alignItems = 'center'; // Vertically align text inside button
          aiReplyButton.style.justifyContent = 'center'; // Center text inside the button
          aiReplyButton.style.width = 'auto'; // Let the width adjust based on content
          aiReplyButton.style.marginLeft = '6px';
          aiReplyButton.style.marginTop = '6px';

          // Insert the AI-Reply button between Reply and Forward buttons
          const forwardButton = toolbar.querySelector('button[aria-label="Forward"]');
          if (forwardButton) {
              toolbar.insertBefore(aiReplyButton, forwardButton);
          }

          

          // Add click event listener for AI-Reply button functionality
          aiReplyButton.addEventListener('click', () => {
              alert('AI-Reply functionality coming soon!');
          });

         
      } else {
          // Retry injecting the button after some time if the toolbar is not yet available
          setTimeout(injectAIReplyButton, 1000);
      }
  }

  // Run the function to inject the button after page load
  injectAIReplyButton();
});











