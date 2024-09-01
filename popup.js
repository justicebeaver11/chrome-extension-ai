document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');

  // Close button functionality
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

  function checkLoginStatus() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['sessionToken'], (result) => {
        resolve(result.sessionToken || null);
      });
    });
  }

  async function getCookies() {
    return new Promise((resolve) => {
      chrome.cookies.getAll({ url: 'https://app.ai4chat.co' }, (cookies) => {
        resolve(cookies);
      });
    });
  }

  function handleSignIn() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        chrome.tabs.create({ url: "https://app.ai4chat.co/login" });
      });
    }
  }

  async function updateUI() {
    const sessionToken = await checkLoginStatus();

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

  updateUI();

  async function sendMessage(messageText) {
    const sessionToken = await checkLoginStatus();
    const cookies = await getCookies();

    if (!sessionToken) {
      alert('You need to be logged in to send a message.');
      return;
    }
    
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    try {
      console.log('Sending message:', messageText);
      const response = await fetch('https://app.ai4chat.co/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
          'Cookie': cookieString
        },
        body: JSON.stringify({
          chatid: "e83e2938-3483-4f0c-a4f8-45370aa40e40",
          aiengine: "GPT 4o Mini",
          message: messageText
        })
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Response from ChatGPT model:', data);
        return data.reply || 'No response from server';
      } else {
        console.error('Failed to send message:', response.statusText);
        return `Error: ${response.statusText}`;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Error sending message';
    }
  }

  const sendButton = document.getElementById('sendButton');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotInput = document.getElementById('chatbotInput');

  sendButton.addEventListener('click', async () => {
    const messageText = chatbotInput.value.trim();
    if (messageText) {
      const userMessageDiv = document.createElement('div');
      userMessageDiv.className = 'chat-message';
      userMessageDiv.textContent = `You: ${messageText}`;
      chatbotMessages.appendChild(userMessageDiv);

      // Show loading text
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'chat-message response';
      loadingDiv.textContent = 'Bot: Loading...';
      chatbotMessages.appendChild(loadingDiv);

      const responseText = await sendMessage(messageText);

      // Replace loading text with the actual response
      loadingDiv.textContent = `Bot: ${responseText}`;

      chatbotInput.value = '';
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
  });
});









