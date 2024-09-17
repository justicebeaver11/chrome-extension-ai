document.addEventListener("DOMContentLoaded", async () => {
  const closeButton = document.getElementById("closeButton");
  closeButton.addEventListener("click", () => {
    window.close();
  });

  chrome.storage.local.get("credits", function (result) {
    const creditBalanceElement = document.getElementById("creditbalance");
    if (result.credits) {
      creditBalanceElement.textContent = result.credits;
    } else {
      console.log("No credits found in storage");
    }
  });

  // Listen for any updates from the background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "creditsUpdated") {
      const creditBalanceElement = document.getElementById("creditbalance");
      creditBalanceElement.textContent = message.credits;
    }
  });

  document
    .getElementById("retrieveUrlButton")
    .addEventListener("click", async () => {
      try {
        const lastTabUrl = await getLastTabUrlFromStorage();
        urlInput.value = lastTabUrl; // Set the URL input to the retrieved tab URL
        fetchMarkdownFromUrl(lastTabUrl); // Fetch markdown for the last active tab URL
      } catch (error) {
        console.error("Error retrieving last active tab URL:", error);
      }
    });

  function getLastTabUrlAndSelectedTextFromStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["lastTabUrl", "selectedText"], (result) => {
        if (result.lastTabUrl) {
          console.log("Last Active Tab URL from Storage:", result.lastTabUrl);
        }
        if (result.selectedText) {
          console.log("Selected Text from Storage:", result.selectedText);
        }

        if (result.lastTabUrl || result.selectedText) {
          resolve({
            lastTabUrl: result.lastTabUrl || null,
            selectedText: result.selectedText || null,
          });
        } else {
          console.log("No data found in storage.");
          reject("No data found");
        }
      });
    });
  }

  // Call the function and update the popup UI
  getLastTabUrlAndSelectedTextFromStorage()
    .then((data) => {
      const chatInput = document.getElementById("chatbotInput"); // Chatbot's input area

      if (data.selectedText) {
        // Set the selected text into the chatbot input
        chatInput.value = data.selectedText;
      }

      // If needed, you can use the lastTabUrl as well (for example, display it in the UI)
      if (data.lastTabUrl) {
        console.log("Last Active Tab URL:", data.lastTabUrl);
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });

  // Listen for messages from the background script to update the chat input
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "update_chat_input" && request.text) {
      // Update the textarea with the selected text
      const chatInput = document.getElementById("chatbotInput");
      if (chatInput) {
        chatInput.value = request.text;
      }
    }
  });

  const modelCredits = {
    "OpenChat 3.5 8B": 1,
    "Mistral 7B Instruct": 1,
    "Mistral 7B Instruct v0.2": 1,
    "Mistral 7B Instruct v0.3": 1,
    "Phi-3 Mini Instruct": 1,
    "Qwen 1.5 4B Chat": 1,
    "Llama 3 Soliloquy 8B v2": 1,
    "Gemma 7B": 1,
    "Gemma 2 9B": 1,
    "Gemma 7B (Fast)": 1,
    "OpenChat 3.6 8B": 1,
    "Llama v3 8B": 1,
    "Llama v3 8B (Fast)": 1,
    "Llama v3.1 8B": 1,
    "Llama v3.1 8B (Fast)": 1,
    "Llama 3.1 Sonar 8B Online": 55,
    "Qwen 2 7B": 1,
    "Phi-3.5 Mini 128K Instruct": 1,
    "Hermes 2 Pro - Llama-3 8B": 2,
    "Mistral 7B Instruct v0.1": 2,
    "Hermes 2 - Mistral 7B DPO": 2,
    "Llama3 Sonar 8B Online": 55,
    "DeepSeek-V2 Chat": 2,
    "Deepseek Coder": 2,
    "OLMo 7B Instruct": 2,
    "Qwen 1.5 7B Chat": 2,
    "Llama 3 Lumimaid 8B": 2,
    "WizardLM-2 7B": 2,
    "Chronos Hermes 13B v2": 2,
    "MythoMax 13B": 2,
    "Capybara 7B": 2,
    "OpenHermes 2.5 Mistral 7B": 2,
    "Mistral OpenOrca 7B": 2,
    "Hermes 13B": 2,
    "Llama v2 13B": 2,
    "FireLLaVA 13B": 3,
    "Claude 3 Haiku": 3,
    "Yi Large Turbo": 2,
    "Hermes 2 Mixtral 8x7B DPO": 3,
    "Mixtral 8x7B Instruct": 3,
    "Mixtral 8x7B Instruct (Fast)": 3,
    "StripedHyena Nous 7B": 3,
    "Yi 6B": 3,
    "Gemma 2 27B": 3,
    "MythoMist 7B": 4,
    "Mistral Nemo": 4,
    "Codestral Mamba": 4,
    "Hermes 3 70B Instruct": 4,
    "Jamba 1.5 Mini": 4,
    "Command R": 5,
    "Dolphin 2.6 Mixtral 8x7B": 5,
    "Hermes 2 Mixtral 8x7B SFT": 6,
    "lzlv 70B": 6,
    "GPT 4o Mini": 6,
    "Mixtral 8x22B Instruct": 7,
    "WizardLM-2 8x22B": 7,
    "Llama v2 70B": 7,
    "Jamba Instruct": 7,
    "Claude Instant v1": 8,
    "Yi 34B": 8,
    "Dolphin Llama 3 70B": 8,
    "CodeLlama 34B": 8,
    "Phind CodeLlama 34B v2": 8,
    "Llama v3 70B": 8,
    "Llama v3 70B (Fast)": 8,
    "Llama v3.1 70B": 8,
    "Llama v3.1 70B (Fast)": 8,
    "Qwen 2 72B": 8,
    "Yi 1.5 34B": 8,
    "Phi-3 Medium Instruct": 10,
    "Llama3 Sonar 70B Online": 60,
    "Llama 3.1 Sonar 70B Online": 60,
    "Llama 3.1 Sonar 405B Online": 100,
    "LLaVA v1.6 34B": 10,
    "Qwen 1.5 72B": 10,
    "DBRX 132B Instruct": 10,
    Command: 10,
    "Capybara 34B": 10,
    "Gemini 1.5 Flash": 10,
    "Dolphin 2.9.2 Mixtral 8x22B": 10,
    "Hermes 2 Theta 8B": 12,
    "Noromaid 20B": 15,
    "ChatGPT (GPT 3.5)": 15,
    "Gemini 1.0 Pro": 15,
    "Qwen 1.5 110B Chat": 17,
    "Hermes 3 405B Instruct": 25,
    "Command R+": 30,
    "Claude 3 Sonnet": 30,
    "Llama v3.1 405B": 30,
    "Llama v3.1 405B (Fast)": 30,
    "Yi Large": 30,
    "Llama 3 Lumimaid 70B": 35,
    "NVIDIA Nemotron-4 340B Instruct": 45,
    "Magnum 72B": 45,
    "Dolphin 2.6 Mixtral 8x7B": 50,
    "Claude v2.0": 80,
    "Claude v2.1": 80,
    "CodeLlama 70B Instruct": 80,
    "Noromaid Mixtral 8x7B Instruct": 80,
    "Jamba 1.5 Large": 80,
    "Midnight Rose 70B": 90,
    "Gemini 1.5 Pro": 100,
    "Claude 3 Opus": 750,
    "Claude 3.5 Sonnet": 150,
    "GPT 4o": 150,
  };

  const langButton = document.getElementById("langButton");
  const langPopup = document.getElementById("langPopup");
  const closeLangPopupButton = document.getElementById("closeLangPopup");
  const langOptions = document.querySelectorAll(".lang-option");

  langButton.addEventListener("click", () => {
    langPopup.classList.toggle("hidden");
  });

  closeLangPopupButton.addEventListener("click", () => {
    langPopup.classList.add("hidden");
  });

  langOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedLang = option.dataset.lang || "english";
      const langText = langButton.querySelector("span.lang-text");
      langText.textContent = `Language: ${option.textContent}`;
      langPopup.classList.add("hidden");
      chrome.storage.local.set({ selectedLang }, () => {
        console.log(`Language updated: ${selectedLang}`);
      });
    });
  });

  const loadStoredLang = async () => {
    const storedLang = await new Promise((resolve) => {
      chrome.storage.local.get(["selectedLang"], (result) => {
        resolve(result.selectedLang || "english"); // Default to English if not set
      });
    });

    const langText = langButton.querySelector("span.lang-text");
    langText.textContent = `Language: ${storedLang}`;
    console.log("Loaded stored language:", storedLang);
  };

  // Call to load stored language on popup load
  loadStoredLang();

  const toneButton = document.getElementById("toneButton");
  const tonePopup = document.getElementById("tonePopup");
  const closeTonePopupButton = document.getElementById("closeTonePopup");
  const toneOptions = document.querySelectorAll(".tone-option");

  toneButton.addEventListener("click", () => {
    tonePopup.classList.toggle("hidden");
  });

  closeTonePopupButton.addEventListener("click", () => {
    tonePopup.classList.add("hidden");
  });

  toneOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedTone = option.dataset.tone;
      const toneText = toneButton.querySelector("span.tone-text");
      toneText.textContent = `Tone: ${option.textContent}`;
      tonePopup.classList.add("hidden");
      chrome.storage.local.set({ selectedTone }, () => {
        console.log(`Tone updated: ${selectedTone}`);
      });
    });
  });

  const wordCountButton = document.getElementById("wordCountButton");
  const wordCountPopup = document.getElementById("wordCountPopup");
  const closeWordCountPopup = document.getElementById("closeWordCountPopup");
  const wordCountSlider = document.getElementById("wordCountSlider");
  const wordCountText = document.querySelector(".word-count-text");
  const sliderTooltip = document.getElementById("sliderTooltip");

  const wordCountValues = [
    "Default",
    50,
    100,
    150,
    200,
    250,
    300,
    350,
    400,
    450,
    500,
  ];

  wordCountButton.addEventListener("click", () => {
    wordCountPopup.classList.toggle("hidden");
  });

  closeWordCountPopup.addEventListener("click", () => {
    wordCountPopup.classList.add("hidden");
  });

  wordCountSlider.addEventListener("input", () => {
    const value = wordCountSlider.value;
    const selectedValue = wordCountValues[value];

    sliderTooltip.textContent = selectedValue;

    wordCountPopup.classList.add("show-tooltip");

    const sliderWidth = wordCountSlider.offsetWidth;
    const thumbPosition = (value / (wordCountValues.length - 1)) * sliderWidth;
    sliderTooltip.style.left = `${thumbPosition}px`;
  });

  wordCountSlider.addEventListener("change", () => {
    const value = wordCountSlider.value;
    const selectedValue = wordCountValues[value];

    wordCountText.textContent = `Word Count: ${selectedValue}`;
    // chrome.storage.local.set({ selectedWordCount: selectedValue });
    chrome.storage.local.set({ selectedWordCount: selectedValue }, () => {
      console.log("Word count updated:", selectedValue);
    });

    wordCountPopup.classList.remove("show-tooltip");
    wordCountPopup.classList.add("hidden");
  });

  const loadStoredWordCount = async () => {
    const storedWordCount = await new Promise((resolve) => {
      chrome.storage.local.get(["selectedWordCount"], (result) => {
        resolve(result.selectedWordCount || "Default");
      });
    });

    const initialIndex = wordCountValues.indexOf(storedWordCount);
    wordCountSlider.value = initialIndex !== -1 ? initialIndex : 0;
    wordCountText.textContent = `Word Count: ${
      wordCountValues[initialIndex !== -1 ? initialIndex : 0]
    }`;
    sliderTooltip.textContent = wordCountText.textContent;
  };

  loadStoredWordCount();

  document.getElementById("closeChatButton").addEventListener("click", () => {
    window.close();
  });

  document.getElementById("caretIcon").addEventListener("click", function () {
    const caretDropdown = document.getElementById("caretDropdown");
    caretDropdown.style.display =
      caretDropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  window.addEventListener("click", function (event) {
    if (!event.target.matches("#caretIcon")) {
      document.getElementById("caretDropdown").style.display = "none";
    }
  });

  const chatbotMessages = document.getElementById("chatbotMessages");

  // Event listener for "openNewTabButton" to start a new chat

  // Options toggle logic
  const ellipsisButton = document.getElementById("ellipsisButton");
  const optionsBox = document.getElementById("optionsBox");
  const closeOptionsButton = document.getElementById("closeOptionsButton");

  ellipsisButton.addEventListener("click", function () {
    optionsBox.classList.toggle("hidden");
  });

  closeOptionsButton.addEventListener("click", function () {
    optionsBox.classList.add("hidden");
  });

  document.addEventListener("click", function (event) {
    if (
      !optionsBox.contains(event.target) &&
      !ellipsisButton.contains(event.target)
    ) {
      optionsBox.classList.add("hidden");
    }
  });

  // Dropdown model selection logic
  const caretIcon = document.querySelector("#caretIcon");
  const modelDropdown = document.querySelector("#modelDropdown");
  const modelButton = document.querySelector("#modelButton");
  const selectedModelSpan = document.getElementById("selectedModel");
  let currentModel = "GPT 4o Mini";

  modelDropdown.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      const modelName = event.target.getAttribute("data-model");
      const modelText = event.target.innerText;

      // Update the displayed selected model
      selectedModelSpan.innerText = modelText;

      // Update the current model based on the selection
      currentModel = modelName;
      chrome.storage.local.set({ selectedModel: currentModel });
      updateInitialCreditBalance(currentModel);
    }
  });

  chrome.storage.local.get(["selectedModel"], (result) => {
    if (result.selectedModel) {
      currentModel = result.selectedModel;
      selectedModelSpan.textContent = result.selectedModel;
      updateInitialCreditBalance(currentModel);
    } else {
      chrome.storage.local.set({ selectedModel: currentModel });
      selectedModelSpan.textContent = currentModel;
      updateInitialCreditBalance(currentModel);
    }
  });

  modelButton.addEventListener("click", function (event) {
    event.stopPropagation();
    const isVisible = modelDropdown.style.display === "block";
    modelDropdown.style.display = isVisible ? "none" : "block";
  });

  modelDropdown.addEventListener("click", function (event) {
    const selectedModel = event.target.dataset.model;
    if (selectedModel) {
      selectedModelSpan.textContent = event.target.textContent;
      chrome.storage.local.set({ selectedModel: event.target.textContent });
      modelDropdown.style.display = "none";
    }
  });

  document.addEventListener("click", function (event) {
    if (
      !modelButton.contains(event.target) &&
      !modelDropdown.contains(event.target)
    ) {
      modelDropdown.style.display = "none";
    }
  });

  // Adjust text area height dynamically when typing
  document
    .getElementById("chatbotInput")
    .addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });

  // Send message and reset input and height
  document.getElementById("sendButton").addEventListener("click", () => {
    const chatbotInput = document.getElementById("chatbotInput");
    const messageText = chatbotInput.value.trim();

    if (messageText) {
      // Display the message in the chat box
      displayMessage("user", messageText);


      // Clear the text input
      chatbotInput.value = "";

      // Reset the text area height to its default value
      chatbotInput.style.height = "30px"; // This should match the initial height of your text area
      document.querySelector("#sendButton i.fa-paper-plane").style.display = "none";
      document.querySelector("#sendButton i.fa-spinner").style.display = "inline-block";
  
      const timerElement = document.getElementById("timer");
      timerElement.style.display = "block";
      startTimer(timerElement); // Start a timer that counts up until the response is received
      sendButton.style.marginTop = "20px";
  
      // Send the message to the chatbot
      sendMessageToChatbot(messageText).then(() => {
        // Hide spinner and show the send button, stop the timer once the response is received
        document.querySelector("#sendButton i.fa-spinner").style.display = "none";
        document.querySelector("#sendButton i.fa-paper-plane").style.display = "inline-block";
        stopTimer(timerElement); // Stop the timer
      });
    }
  });

  let timerInterval;

  function startTimer(timerElement) {
    let startTime = Date.now(); // Record the start time
  
    timerInterval = setInterval(() => {
      let elapsedTime = Date.now() - startTime; // Calculate the elapsed time
      let seconds = Math.floor(elapsedTime / 1000); // Get seconds
      let milliseconds = Math.floor((elapsedTime % 1000) / 100); // Get milliseconds as 1/10th of a second
  
      timerElement.textContent = `${seconds}.${milliseconds}s`; // Format as 1.2s
    }, 100); // Update every 100 milliseconds
  }

// Function to stop the timer once the response is received
function stopTimer(timerElement) {
  clearInterval(timerInterval); // Stop the interval
  timerElement.style.display = "none"; // Hide the timer element once the response is received
}

  async function getSessionTokenFromStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["sessionToken"], (result) => {
        resolve(result.sessionToken || null);
      });
    });
  }

  //opensource
  const chatbotContainer = document.getElementById("chatbotContainer");
  const selectionContainer = document.getElementById("selectionContainer");
  const chatWithChatbotButton1 = document.getElementById("chatWithChatbot");
  const chatWithWebpageButton1 = document.getElementById("chatWithWebpage");
  const urlInput = document.getElementById("urlInput");
  const fetchContentButton = document.getElementById("fetchContentButton");
  const webpageOptions = document.getElementById("webpageOptions");
  const webpageOptionsPopup = document.getElementById("webpageOptionsPopup");
  const searchBox = document.getElementById("searchBox");

  // Function to send a message to the chatbot
  function sendMessageToChatbot(message, url, markdown) {
    // Implement your chatbot message handling logic here
    console.log("Sending message to chatbot:", message);
    console.log("URL:", url);
    console.log("Markdown content:", markdown);
  }

  // Function to fetch markdown from the URL to Markdown service
  function fetchMarkdownFromUrl(url) {
    const apiUrl = `https://urltomarkdown.herokuapp.com/?url=${encodeURIComponent(
      url
    )}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((markdown) => {
        console.log("Markdown content:", markdown);
        sendMessageToChatbot(
          "Here is the content and the URL of the webpage I'm on.",
          url,
          markdown
        );
      })
      .catch((error) => {
        console.error("Error fetching markdown:", error);
      });
  }

  // Event listener for the close button
  document
    .getElementById("closePopupButton")
    .addEventListener("click", function () {
      webpageOptionsPopup.style.display = "none"; // Close the popup using display none
    });

  // Show the popup with the searchBox click event
  searchBox.addEventListener("click", () => {
    webpageOptionsPopup.style.display = "flex"; // Open the popup using display flex
  });

  // Event listener for the 'Chat with Chatbot' button
  chatWithChatbotButton1.addEventListener("click", () => {
    chatbotContainer.style.display = "block";
    searchBox.style.display = "none";
  });

  // Event listener for the 'Chat with Webpage' button
  chatWithWebpageButton1.addEventListener("click", () => {
    chatbotContainer.style.display = "block";
    searchBox.style.display = "block"; // Show search box
  });

  // Event listener for the 'Fetch Content' button
  fetchContentButton.addEventListener("click", () => {
    const url = urlInput.value.trim();
    if (url) {
      console.log("Webpage URL:", url);

      // Fetch markdown from the URL
      fetchMarkdownFromUrl(url);

      // Hide URL input and fetch button, and show the chatbot interface
      webpageOptionsPopup.style.display = "none";
      chatbotContainer.style.display = "flex";
    }
  });

  // Check if user has a stored option, and update UI accordingly
  chrome.storage.local.get("selectedOption", (result) => {
    if (result.selectedOption) {
      selectionContainer.style.display = "none";
      chatbotContainer.style.display = "flex";

      if (result.selectedOption === "webpage") {
        webpageOptions.style.display = "flex";
      }
    }
  });

  // Chat with Chatbot logic
  chatWithChatbotButton1.addEventListener("click", () => {
    selectionContainer.style.display = "none";
    chatbotContainer.style.display = "flex";
    webpageOptionsPopup.style.display = "none";

    // Store the selected option
    chrome.storage.local.set({ selectedOption: "chatbot" }, () => {
      console.log("Chat with Chatbot selected and stored.");
    });
  });

  // Chat with Webpage logic
  chatWithWebpageButton1.addEventListener("click", () => {
    selectionContainer.style.display = "none";
    chatbotContainer.style.display = "flex";
    webpageOptionsPopup.style.display = "flex";

    // Store the selected option
    chrome.storage.local.set({ selectedOption: "webpage" }, () => {
      console.log("Chat with Webpage selected and stored.");
    });
  });

  // If there's an "Open New Tab" button logic, ensure it resets the state correctly
  const openNewTabButton = document.getElementById("openNewTabButton");
  if (openNewTabButton) {
    openNewTabButton.addEventListener("click", () => {
      // Reset to show the two options again
      selectionContainer.style.display = "block";
      chatbotContainer.style.display = "none";
      webpageOptionsPopup.style.display = "none";

      // Clear the stored option for a new selection
      chrome.storage.local.remove("selectedOption", () => {
        console.log("Previous selection cleared, ready for new chat.");
      });
    });
  }

  async function updateUI() {
    const sessionToken = await getSessionTokenFromStorage();
    const contentDiv = document.getElementById("content");
    const chatbotContainer = document.getElementById("chatbotContainer");

    // Check if user is signed in
    if (sessionToken) {
      // Check if a selection has been stored in Chrome storage
      chrome.storage.local.get("selectedOption", (result) => {
        if (result.selectedOption) {
          // Hide content div and show the previously selected option
          contentDiv.style.display = "none";
          document.getElementById("selectionContainer").style.display = "none";

          if (result.selectedOption === "chatbot") {
            chatbotContainer.style.display = "flex";
          } else if (result.selectedOption === "webpage") {
            document.getElementById("webpageContainer").style.display = "flex";
          }
        } else {
          // If no option selected yet, show selectionContainer
          contentDiv.style.display = "none";
          chatbotContainer.style.display = "none";
          document.getElementById("selectionContainer").style.display = "flex";
        }
      });
    } else {
      // If not signed in, show sign-in screen
      contentDiv.style.display = "flex";
      chatbotContainer.style.display = "none";
      document.getElementById("selectionContainer").style.display = "none";
      handleSignIn(); // Implement your sign-in logic here
    }
  }

  // Event listeners for buttons
  const chatWithChatbotButton = document.getElementById("chatWithChatbot");
  const chatWithWebpageButton = document.getElementById("chatWithWebpage");

  function handleSelection(selectedOption) {
    // Save the selected option to Chrome storage
    chrome.storage.local.set({ selectedOption }, () => {
      console.log(`Selected option saved: ${selectedOption}`);
    });

    // Hide the selection container and show the appropriate UI
    document.getElementById("selectionContainer").style.display = "none";

    if (selectedOption === "chatbot") {
      document.getElementById("chatbotContainer").style.display = "flex";
    } else if (selectedOption === "webpage") {
      document.getElementById("webpageContainer").style.display = "flex";
    }
  }

  chatWithChatbotButton.addEventListener("click", () => {
    handleSelection("chatbot");
  });

  chatWithWebpageButton.addEventListener("click", () => {
    handleSelection("webpage");
  });

  async function getLatestChatId() {
    try {
      const response = await fetch("https://app.ai4chat.co/new-chat", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to fetch chat page");
        return null;
      }

      const text = await response.text();
      const chatIdMatch = text.match(/\/chat\/([a-f0-9\-]+)/);
      if (chatIdMatch) {
        const chatId = chatIdMatch[1];
        console.log("Retrieved chat ID:", chatId);
        return chatId;
      } else {
        console.error("Chat ID not found");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving chat ID:", error);
      return null;
    }
  }

  let lastResponse = ""; // Track the last response

  function formatResponse(response) {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = response;

    let textContent = Array.from(tempDiv.querySelectorAll("p"))
      .map((p) => p.innerText)
      .join("\n");
    let preContent = Array.from(tempDiv.querySelectorAll("pre"))
      .map((pre) => {
        return `<b>${pre.innerText.replace(/\n/g, "<br>")}</b>`;
      })
      .join("\n");

    textContent = textContent.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    return textContent + (preContent ? `\n\n${preContent}` : "");
  }

  async function sendMessageToChatbot(messageText) {
    displayLoadingMessage();
    try {
      const sessionToken = await getSessionTokenFromStorage();
      if (!sessionToken) {
        console.log("No session token available.");
        return;
      }

      const chatid = await getLatestChatId();
      if (!chatid) {
        console.log("Failed to retrieve chat ID.");
        return;
      }

      const aiengine = currentModel;

      //const conversation = [{ role: "user", content: messageText }];
      let conversation;

      // Fetch selected option (chatbot or webpage)
      const selectedOption = await new Promise((resolve) => {
        chrome.storage.local.get("selectedOption", (result) => {
          resolve(result.selectedOption || "chatbot");
        });
      });

      // Handle "chat with webpage" logic
      if (selectedOption === "webpage") {
        // Fetch the markdown content using the provided web service URL
        const url = urlInput.value.trim();
        if (url) {
          const markdownResponse = await fetch(
            `https://urltomarkdown.herokuapp.com/?url=${encodeURIComponent(
              url
            )}`
          );
          const markdownContent = await markdownResponse.text();

          if (markdownContent) {
            // If markdown content is successfully fetched, use it in the conversation
            conversation = [
              {
                role: "system",
                content: `You are assisting with the following webpage content: ${markdownContent}`,
              },
              {
                role: "user",
                content:
                  "What are the examples mentioned on the page or give the page summary?",
              },
            ];
          } else {
            console.log("Failed to fetch markdown content.");
            conversation = [{ role: "user", content: messageText }];
          }
        } else {
          console.log("No URL provided for markdown conversion.");
          conversation = [{ role: "user", content: messageText }];
        }
      } else {
        // Default chatbot conversation
        conversation = [{ role: "user", content: messageText }];
      }

      const timezoneOffset = new Date().getTimezoneOffset();

      const selectedLanguage = await new Promise((resolve) => {
        chrome.storage.local.get(["selectedLang"], (result) => {
          resolve(result.selectedLang || "english");
        });
      });

      const selectedTone = await new Promise((resolve) => {
        chrome.storage.local.get(["selectedTone"], (result) => {
          resolve(result.selectedTone || "default");
        });
      });

      const selectedWordCount = await new Promise((resolve) => {
        chrome.storage.local.get(["selectedWordCount"], (result) => {
          resolve(result.selectedWordCount || "Default");
        });
      });

      const googleSearchStatus = false;

      const response = await fetch("https://app.ai4chat.co/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          chatid,
          aiengine,
          conversation,
          timezoneOffset,
          language: selectedLanguage,
          tone: selectedTone,
          wordcount: selectedWordCount,
          googleSearchStatus,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from server:", errorData.error);
        return;
      }

      const data = await response.text();
      const formattedResponse = formatResponse(data);

      if (formattedResponse === lastResponse) {
        console.log("Duplicate response detected, skipping display.");
        return;
      }

      lastResponse = formattedResponse;
      displayMessage("assistant", formattedResponse || "No content");

      // Remove Loading... message
      updateCreditBalance();
      removeLoadingMessage();
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      removeLoadingMessage();
    }
  }

  function updateInitialCreditBalance(modelName) {
    const creditValue = modelCredits[modelName];
    if (creditValue !== undefined) {
      document.getElementById("initialCreditBalance").textContent = creditValue;
    } else {
      console.error("Model not found");
    }
  }

  function updateCreditBalance() {
    const creditBalanceElement = document.getElementById("creditbalance");
    const generationCostElement = document.getElementById(
      "initialCreditBalance"
    );

    if (creditBalanceElement && generationCostElement) {
      let currentBalance = parseInt(creditBalanceElement.innerHTML, 10);
      let generationCost = parseInt(generationCostElement.innerHTML, 10);

      // Subtract the generation cost from the current balance
      if (currentBalance >= generationCost) {
        currentBalance -= generationCost;
        creditBalanceElement.innerHTML = currentBalance;

        if (currentBalance === 0) {
          showAlert2(); // Show alert when balance reaches 0
        }
      } else {
        console.log("Not enough credits!");
      }
    }
  }

  function displayMessage(role, content) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${role}`;
    messageDiv.innerHTML = content;

    if (role === "assistant") {
      messageDiv.style.textAlign = "left";
      messageDiv.style.marginRight = "auto";
    } else {
      messageDiv.style.textAlign = "right";
      messageDiv.style.marginLeft = "auto";
    }

    const chatbotMessages = document.getElementById("chatbotMessages");
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Display "Loading..." message

  function displayLoadingMessage() {
    // Check if the loading message is already present
    if (document.getElementById("loadingMessage")) return;

    // Create the loading message element
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loadingMessage";
    loadingDiv.className = "chat-message assistant";
    loadingDiv.innerHTML = "Loading...";

    const chatbotMessages = document.getElementById("chatbotMessages");

    // Use setTimeout to add a 1-second delay
    setTimeout(() => {
      // Append the loading message after the delay
      chatbotMessages.appendChild(loadingDiv);

      // Use requestAnimationFrame to ensure the browser processes the UI update before further logic
      requestAnimationFrame(() => {
        // Scroll to the bottom of the chat messages after the element is rendered
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      });
    }, 2000); // 1000 milliseconds = 1 second
  }

  // Remove "Loading..." message
  function removeLoadingMessage() {
    const loadingDiv = document.getElementById("loadingMessage");
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }

  function handleSignIn() {
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
      loginButton.addEventListener("click", () => {
        chrome.tabs.create({ url: "https://app.ai4chat.co/login" });
      });
    }
  }

  updateUI();
});
