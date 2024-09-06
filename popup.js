document.addEventListener('DOMContentLoaded', async () => {
    // Closing the popup
    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => {
        window.close();
    });

    document.getElementById('closeChatButton').addEventListener('click', () => {
        window.close();
    });

    // Options toggle logic
    const ellipsisButton = document.getElementById('ellipsisButton');
    const optionsBox = document.getElementById('optionsBox');
    const closeOptionsButton = document.getElementById('closeOptionsButton');

    ellipsisButton.addEventListener('click', function () {
        optionsBox.classList.toggle('hidden');
    });

    closeOptionsButton.addEventListener('click', function () {
        optionsBox.classList.add('hidden');
    });

    document.addEventListener('click', function (event) {
        if (!optionsBox.contains(event.target) && !ellipsisButton.contains(event.target)) {
            optionsBox.classList.add('hidden');
        }
    });

    // Dropdown model selection logic
    const caretIcon = document.querySelector('#caretIcon');
    const modelDropdown = document.querySelector('#modelDropdown');
    const modelButton = document.querySelector('#modelButton');
    const selectedModelSpan = document.getElementById('selectedModel');

    chrome.storage.local.get(['selectedModel'], (result) => {
        if (result.selectedModel) {
            selectedModelSpan.textContent = result.selectedModel;
        }
    });

    modelButton.addEventListener('click', function (event) {
        event.stopPropagation();
        const isVisible = modelDropdown.style.display === 'block';
        modelDropdown.style.display = isVisible ? 'none' : 'block';
    });

    modelDropdown.addEventListener('click', function (event) {
        const selectedModel = event.target.dataset.model;
        if (selectedModel) {
            selectedModelSpan.textContent = event.target.textContent;
            chrome.storage.local.set({ selectedModel: event.target.textContent });
            modelDropdown.style.display = 'none';
        }
    });

    document.addEventListener('click', function (event) {
        if (!modelButton.contains(event.target) && !modelDropdown.contains(event.target)) {
            modelDropdown.style.display = 'none';
        }
    });

    // Auto-resize the input field based on text input
    document.getElementById('chatbotInput').addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    async function getSessionTokenFromStorage() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['sessionToken'], (result) => {
                resolve(result.sessionToken || null);
            });
        });
    }

    async function updateUI() {
        const sessionToken = await getSessionTokenFromStorage();
        const contentDiv = document.getElementById('content');
        const chatbotContainer = document.getElementById('chatbotContainer');

        if (sessionToken) {
            contentDiv.style.display = 'none';
            chatbotContainer.style.display = 'flex';
        } else {
            contentDiv.style.display = 'flex';
            chatbotContainer.style.display = 'none';
            handleSignIn();
        }
    }

    async function getLatestChatId() {
        try {
            // Fetch the chat page and extract chat ID
            const response = await fetch('https://app.ai4chat.co/chat', {
                method: 'GET',
                credentials: 'include' // Ensure cookies are included
            });

            if (!response.ok) {
                console.error('Failed to fetch chat page');
                return null;
            }

            const text = await response.text();
            const chatIdMatch = text.match(/\/chat\/([a-f0-9\-]+)/); // Adjust regex based on actual chat ID pattern
            if (chatIdMatch) {
                const chatId = chatIdMatch[1];
                console.log('Retrieved chat ID:', chatId);
                return chatId;
            } else {
                console.error('Chat ID not found');
                return null;
            }
        } catch (error) {
            console.error('Error retrieving chat ID:', error);
            return null;
        }
    }

    let lastResponse = '';  // Track the last response

    // Helper function to clean and format the chatbot response
    function formatResponse(response) {
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = response;

        // Extract all the <p> tags content
        let textContent = Array.from(tempDiv.querySelectorAll('p')).map(p => p.innerText).join('\n');

        // Handle <pre> tags separately for code blocks
        let preContent = Array.from(tempDiv.querySelectorAll('pre')).map(pre => {
            // Replace newlines (\n) with <br> tags for line breaks in code formatting
            return `<b>${pre.innerText.replace(/\n/g, '<br>')}</b>`;
        }).join('\n');

        // Clean up unnecessary line breaks and whitespaces
        textContent = textContent.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

        // Append pre tag content after the text content
        return textContent + (preContent ? `\n\n${preContent}` : '');
    }

    // Send a message to the chatbot and display the response
    async function sendMessageToChatbot(messageText) {
        try {
            const sessionToken = await getSessionTokenFromStorage();
            if (!sessionToken) {
                console.log('No session token available.');
                return;
            }

            const chatid = await getLatestChatId();
            if (!chatid) {
                console.log('Failed to retrieve chat ID.');
                return;
            }

            const aiengine = 'GPT 4o Mini';
            const conversation = [{ role: 'user', content: messageText }];

            const timezoneOffset = new Date().getTimezoneOffset();
            const selectedLanguage = 'English';
            const selectedTone = 'Default';
            const wordCount = 'Default';
            const googleSearchStatus = false;

            const response = await fetch('https://app.ai4chat.co/chatgpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify({
                    chatid,
                    aiengine,
                    conversation,
                    timezoneOffset,
                    language: selectedLanguage,
                    tone: selectedTone,
                    wordcount: wordCount,
                    googleSearchStatus
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error from server:', errorData.error);
                return;
            }

            const data = await response.text();
            const formattedResponse = formatResponse(data);

            // Prevent duplicated responses
            if (formattedResponse === lastResponse) {
                console.log('Duplicate response detected, skipping display.');
                return;
            }

            lastResponse = formattedResponse;  // Update last response
            displayMessage('assistant', formattedResponse || 'No content');

        } catch (error) {
            console.error('Error sending message to chatbot:', error);
        }
    }

    // Function to display a message in the chat
    function displayMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        messageDiv.innerHTML = content;  // Use innerHTML to support bold tags and code formatting

        if (role === 'assistant') {
            messageDiv.style.textAlign = 'left';
            messageDiv.style.marginRight = 'auto';
        } else {
            messageDiv.style.textAlign = 'right';
            messageDiv.style.marginLeft = 'auto';
        }

        const chatbotMessages = document.getElementById('chatbotMessages');
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Send message when the user clicks send
    document.getElementById('sendButton').addEventListener('click', () => {
        const chatbotInput = document.getElementById('chatbotInput');
        const messageText = chatbotInput.value.trim();
        if (messageText) {
            displayMessage('user', messageText);
            sendMessageToChatbot(messageText);
            chatbotInput.value = '';
        }
    });

    // Function to handle sign-in
    function handleSignIn() {
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                chrome.tabs.create({ url: "https://app.ai4chat.co/login" });
            });
        }
    }

    // Initialize UI update
    updateUI();
});









