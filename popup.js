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

// Close the options box when the close button is clicked
closeOptionsButton.addEventListener('click', function() {
    optionsBox.classList.add('hidden');
});

// Optional: Close the options box when clicking outside of it
document.addEventListener('click', function(event) {
    if (!optionsBox.contains(event.target) && !ellipsisButton.contains(event.target)) {
        optionsBox.classList.add('hidden');
    }
});


const caretIcon = document.querySelector('#caretIcon');
    const modelDropdown = document.querySelector('#modelDropdown');
    const modelButton = document.querySelector('#modelButton');

    modelButton.addEventListener('click', function(event) {
        event.stopPropagation(); 

        // Toggle the dropdown visibility
        const isVisible = modelDropdown.style.display === 'block';
        modelDropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Close the dropdown when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!modelButton.contains(event.target) && !modelDropdown.contains(event.target)) {
            modelDropdown.style.display = 'none';
        }
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







