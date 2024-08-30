document.addEventListener('DOMContentLoaded', async () => {
  // Log to confirm script execution
  console.log('DOM fully loaded and parsed');

  const closeButton = document.getElementById('closeButton');
  closeButton.addEventListener('click', () => {
      window.close();
  });

  // Function to check if the user is logged in based on the cookie
  function checkLoginStatus() {
    return new Promise((resolve, reject) => {
      chrome.cookies.get({ url: "https://app.ai4chat.co/dashboard", name: "session_token" }, (cookie) => {
        if (cookie) {
          resolve(cookie.value); // Resolve with the session token value
        } else {
          resolve(null); // Resolve with null if the cookie is not found
        }
      });
    });
  }

  // Function to check the current tab's URL
  function getCurrentTabUrl() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          resolve(tabs[0].url);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Update the UI based on login status and URL
  async function updateUI() {
    const sessionToken = await checkLoginStatus();
    const currentUrl = await getCurrentTabUrl();
    const statusDiv = document.getElementById('instruction');
    const loginButton = document.getElementById('loginButton');

    // Log session token and current URL to console
    console.log('Session Token:', sessionToken);
    console.log('Current URL:', currentUrl);

    if (statusDiv && loginButton) {
      if (sessionToken) {
        if (currentUrl === "https://app.ai4chat.co/dashboard") {
          // User is logged in and on the dashboard
          statusDiv.textContent = "Welcome to your dashboard!";
          loginButton.style.display = 'none';
        } else {
          // User is logged in but not on the dashboard
          statusDiv.textContent = "You are logged in. Go to your dashboard.";
          loginButton.textContent = "Go to Dashboard";
          loginButton.style.display = 'block';

          loginButton.addEventListener('click', () => {
            chrome.tabs.create({ url: "https://app.ai4chat.co/dashboard" });
          });
        }
      } else {
        // User is not logged in
        statusDiv.textContent = "Sign in to continue.";
        loginButton.textContent = "Sign In";
        loginButton.style.display = 'block';

        loginButton.addEventListener('click', () => {
          chrome.tabs.create({ url: "https://app.ai4chat.co/login" });
        });
      }
    } else {
      console.error('Required elements are not found in the DOM.');
    }
  }

  
  updateUI();
});