document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');

  const closeButton = document.getElementById('closeButton');
  closeButton.addEventListener('click', () => {
    window.close();
  });

  document.getElementById('chatbotInput').addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });

  // Function to check if the user is logged in based on storage
  function checkLoginStatus() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['sessionToken'], (result) => {
        resolve(result.sessionToken || null);
      });
    });
  }

  // Function to handle the sign-in button click
  function handleSignIn() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        chrome.tabs.create({ url: "https://app.ai4chat.co/login" });
      });
    }
  }

  // Update the UI based on login status
  async function updateUI() {
    const sessionToken = await checkLoginStatus();

    console.log('Session Token:', sessionToken);

    const contentDiv = document.getElementById('content');
    const chatbotContainer = document.getElementById('chatbotContainer');

    if (sessionToken) {
      // User is logged in
      contentDiv.style.display = 'none';
      chatbotContainer.style.display = 'flex';
    } else {
      // User is not logged in
      contentDiv.style.display = 'flex';
      chatbotContainer.style.display = 'none';
      handleSignIn();
    }
  }

  updateUI();
});




