document.addEventListener("DOMContentLoaded", async () => {
  const closeButton = document.getElementById("closeButton");
  closeButton.addEventListener("click", () => {
    window.close();
  });

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
      const selectedLang = option.dataset.tone;
      const langText = langButton.querySelector("span.lang-text");
      langText.textContent = `Language: ${option.textContent}`;
      langPopup.classList.add("hidden");
      chrome.storage.local.set({ selectedLang });
    });
  });

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
      chrome.storage.local.set({ selectedTone });
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
    const thumbPosition = (value / 10) * sliderWidth;
    sliderTooltip.style.left = `${thumbPosition}px`;
  });

  wordCountSlider.addEventListener("change", () => {
    const value = wordCountSlider.value;
    const selectedValue = wordCountValues[value];

    wordCountText.textContent = `Word Count: ${selectedValue}`;

    wordCountPopup.classList.remove("show-tooltip");
    wordCountPopup.classList.add("hidden");
  });

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

  chrome.storage.local.get(["selectedModel"], (result) => {
    if (result.selectedModel) {
      selectedModelSpan.textContent = result.selectedModel;
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

  // Auto-resize the input field based on text input
  document
    .getElementById("chatbotInput")
    .addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });

  async function getSessionTokenFromStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["sessionToken"], (result) => {
        resolve(result.sessionToken || null);
      });
    });
  }

  async function updateUI() {
    const sessionToken = await getSessionTokenFromStorage();
    const contentDiv = document.getElementById("content");
    const chatbotContainer = document.getElementById("chatbotContainer");

    if (sessionToken) {
      contentDiv.style.display = "none";
      chatbotContainer.style.display = "flex";
    } else {
      contentDiv.style.display = "flex";
      chatbotContainer.style.display = "none";
      handleSignIn();
    }
  }

  async function getLatestChatId() {
    try {
      const response = await fetch("https://app.ai4chat.co/chat", {
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

      const aiengine = "GPT 4o Mini";
      const conversation = [{ role: "user", content: messageText }];

      const timezoneOffset = new Date().getTimezoneOffset();
      const selectedLanguage = "English";
      const selectedTone = "Default";
      const wordCount = "Default";
      const googleSearchStatus = false;

      // Display Loading... message
      displayLoadingMessage();

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
          wordcount: wordCount,
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
      removeLoadingMessage();
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      removeLoadingMessage();
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
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loadingMessage";
    loadingDiv.className = "chat-message assistant";
    loadingDiv.innerHTML = "Loading...";
    const chatbotMessages = document.getElementById("chatbotMessages");
    chatbotMessages.appendChild(loadingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Remove "Loading..." message
  function removeLoadingMessage() {
    const loadingDiv = document.getElementById("loadingMessage");
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }

  document.getElementById("sendButton").addEventListener("click", () => {
    const chatbotInput = document.getElementById("chatbotInput");
    const messageText = chatbotInput.value.trim();
    if (messageText) {
      displayMessage("user", messageText);
      sendMessageToChatbot(messageText);
      chatbotInput.value = "";
    }
  });

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
