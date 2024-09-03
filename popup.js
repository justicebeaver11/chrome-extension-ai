document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');

    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => {
        window.close();
    });

    document.getElementById('closeChatButton').addEventListener('click', () => {
        window.close(); 
    });

    // Toggle the options box visibility
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

    async function sendMessageToChatbot(messageText) {
        try {
            const sessionToken = await getSessionTokenFromStorage();

            if (!sessionToken) {
                console.log('No session token available.');
                return;
            }

            const chatid = '3fc1394a-50a5-477c-9608-616daa80b728'; // Replace with actual chat ID
            const aiengine = 'GPT 4o Mini';
            const conversation = [{ role: 'user', content: messageText }];

            const response = await fetch('https://app.ai4chat.co/chatgpt', { // Ensure this is the correct endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}` // Include session token in the headers
                },
                body: JSON.stringify({ chatid, aiengine, conversation }),
                credentials: 'include' // Ensure cookies are sent with the request
            });

            const data = await response.json();
            if (response.ok) {
                displayMessage('assistant', data.response);
            } else {
                console.error('Error from server:', data.error);
            }
        } catch (error) {
            console.error('Error sending message to chatbot:', error);
        }
    }

    function displayMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        messageDiv.textContent = content;

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















