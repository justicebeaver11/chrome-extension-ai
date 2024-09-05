document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');

    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => {
        window.close();
    });

    document.getElementById('closeChatButton').addEventListener('click', () => {
        window.close(); 
    });

    const ellipsisButton = document.getElementById('ellipsisButton');
    const optionsBox = document.getElementById('optionsBox');
    const closeOptionsButton = document.getElementById('closeOptionsButton');

    ellipsisButton.addEventListener('click', function() {
        optionsBox.classList.toggle('hidden');
    });

    closeOptionsButton.addEventListener('click', function() {
        optionsBox.classList.add('hidden');
    });

    document.addEventListener('click', function(event) {
        if (!optionsBox.contains(event.target) && !ellipsisButton.contains(event.target)) {
            optionsBox.classList.add('hidden');
        }
    });

    const caretIcon = document.querySelector('#caretIcon');
    const modelDropdown = document.querySelector('#modelDropdown');
    const modelButton = document.querySelector('#modelButton');
    const selectedModelSpan = document.getElementById('selectedModel');

    chrome.storage.local.get(['selectedModel'], (result) => {
        if (result.selectedModel) {
            selectedModelSpan.textContent = result.selectedModel;
        }
    });

    modelButton.addEventListener('click', function(event) {
        event.stopPropagation(); 

        const isVisible = modelDropdown.style.display === 'block';
        modelDropdown.style.display = isVisible ? 'none' : 'block';
    });

    modelDropdown.addEventListener('click', function(event) {
        const selectedModel = event.target.dataset.model;
        if (selectedModel) {
            selectedModelSpan.textContent = event.target.textContent;

            chrome.storage.local.set({ selectedModel: event.target.textContent });

            modelDropdown.style.display = 'none';
        }
    });

    document.addEventListener('click', function(event) {
        if (!modelButton.contains(event.target) && !modelDropdown.contains(event.target)) {
            modelDropdown.style.display = 'none';
        }
    });

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
        console.log('Session Token:', sessionToken);

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

    let lastResponse = '';  // Track the last response

    async function sendMessageToChatbot(messageText) {
        try {
            const sessionToken = await getSessionTokenFromStorage();

            if (!sessionToken) {
                console.log('No session token available.');
                return;
            }

            const chatid = '05df2687-f0bf-4c17-bf8b-7a625ee315f3'; // Replace with actual chat ID
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
                return;  // Stop execution if the response is not ok
            }

            // Parse response safely
            const data = await response.text();

            // Create a temporary element to parse HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');

            // Extract all text content and replace newline characters with spaces
            let textContent = '';
            const allElements = doc.querySelectorAll('*'); // Select all elements
            allElements.forEach(el => {
                if (el.textContent.trim()) {
                    textContent += el.textContent.trim() + ' '; // Replace newlines with spaces
                }
            });

            // Clean up the text content
            textContent = textContent.replace(/\s{2,}/g, ' ').trim(); // Replace multiple spaces with a single space

            // Remove duplicated responses
            if (textContent === lastResponse) {
                console.log('Duplicate response detected, skipping display.');
                return;
            }

            lastResponse = textContent;  // Update the last response
            displayMessage('assistant', textContent || 'No content');

        } catch (error) {
            console.error('Error sending message to chatbot:', error);
        }
    }

    function displayMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        messageDiv.textContent = content;

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

    document.getElementById('sendButton').addEventListener('click', () => {
        const chatbotInput = document.getElementById('chatbotInput');
        const messageText = chatbotInput.value.trim();
        if (messageText) {
            displayMessage('user', messageText);
            sendMessageToChatbot(messageText);
            chatbotInput.value = '';
        }
    });

    function handleSignIn() {
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                chrome.tabs.create({ url: "https://app.ai4chat.co/login" });
            });
        }
    }

    updateUI();
});

