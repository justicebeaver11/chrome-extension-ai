document.addEventListener("DOMContentLoaded", async () => {
  const closeButton = document.getElementById("closeButton");
  closeButton.addEventListener("click", () => {
    window.close();
  });

  const menuButton = document.getElementById("menuButton");
  const chatbotModel = document.getElementById("chatbotmodel");
  const chatbotMessages1 = document.getElementById("chatbotMessages");

  // Variable to track toggle state
  let isTextToImageMode = false;
  let isAdvancedSettingsVisible = false;

  // Store the original content of the chatbotModel
  const originalModelContent = chatbotModel.innerHTML;

  menuButton.addEventListener("click", () => {
    if (!isTextToImageMode) {
      chatbotModel.innerHTML = "";

      const titleContainer = document.createElement("div");
      titleContainer.style.textAlign = "center";

      const title = document.createElement("div");
      title.id = "textToImage";
      title.textContent = "Text to Image";
      title.style.color = "#3996fb";
      title.style.fontSize = "24px";
      title.style.fontWeight = "bold";
      title.style.marginBottom = "5px";

      const description = document.createElement("div");
      description.textContent =
        "Enter a description for your image, choose an AI model, and hit Generate below";
      description.style.color = "#ffffff";
      description.style.fontSize = "14px";
      description.style.marginBottom = "20px";

      titleContainer.appendChild(title);
      titleContainer.appendChild(description);

      chatbotModel.appendChild(titleContainer);

      chatbotMessages1.innerHTML = "";

      const introTitle = document.createElement("div");
      introTitle.textContent = "Enter the details below";
      introTitle.style.color = "#3996fb";
      introTitle.style.fontSize = "14px";
      introTitle.style.fontWeight = "bold";
      introTitle.style.marginBottom = "10px";

      chatbotMessages1.appendChild(introTitle);

      const smallTitle1 = document.createElement("div");
      smallTitle1.textContent = "What do you want to generate?";
      smallTitle1.style.color = "#ffffff";
      smallTitle1.style.fontSize = "12px";
      smallTitle1.style.marginBottom = "2px";
      smallTitle1.style.textAlign = "left";
      smallTitle1.id = "promptTitle";

      const inputField1 = document.createElement("input");
      inputField1.type = "text";
      inputField1.placeholder = "Enter prompt";
      inputField1.style.display = "block";
      inputField1.style.margin = "8px 0";
      inputField1.style.backgroundColor = "#17182b";
      inputField1.style.border = "1px solid #3996fb";
      inputField1.style.color = "#ffffff";
      inputField1.style.padding = "8px";
      inputField1.id = "promptInput";

      const smallTitle2 = document.createElement("div");
      smallTitle2.textContent = "Model Selection";
      smallTitle2.style.color = "#ffffff";
      smallTitle2.style.fontSize = "12px";
      smallTitle2.style.marginBottom = "2px";
      smallTitle2.style.textAlign = "left";
      smallTitle2.id = "modelSelectionTitle";

      const modelDropdown = document.createElement("select");
      modelDropdown.style.display = "block";
      modelDropdown.style.margin = "8px 0";
      modelDropdown.style.backgroundColor = "#17182b";
      modelDropdown.style.border = "1px solid #3996fb";
      modelDropdown.style.color = "#ffffff";
      modelDropdown.style.padding = "8px";
      modelDropdown.id = "modelDropdownSelect";

      const models = [
        { id: "l4ai", name: "Luminarium4AI (Proprietary)" },
        { id: "v4ai", name: "Visionary4AI (Proprietary)" },
        { id: "dc4ai", name: "DreamCanvas4AI (Proprietary)" },
        { id: "pp4ai", name: "PixelPioneer4AI (Proprietary)" },
        { id: "flux-schnell", name: "FLUX.1 [schnell]" },
        { id: "flux-dev", name: "FLUX.1 [dev]" },
        { id: "flux-pro", name: "FLUX.1 [pro]" },
        { id: "sd_v1.5", name: "Stable Diffusion v1.5" },
        { id: "sd_v2.1", name: "Stable Diffusion v2.1" },
        { id: "sd_v3", name: "Stable Diffusion v3" },
        { id: "sd_xl", name: "Stable Diffusion XL" },
        { id: "midjourney", name: "Midjourney" },
        { id: "dall-e-2", name: "DALLE-2" },
        { id: "dall-e-3", name: "DALLE-3" },
        { id: "leonardo", name: "Leonardo AI" },
        { id: "van-gogh-diffusion", name: "Van Gogh Diffusion" },
        { id: "neverending-dream", name: "NeverEnding Dream" },
        {
          id: "icbinp",
          name: "ICBINP - I Cannot Believe It Is Not Photography",
        },
        { id: "something-v2-2", name: "Something V2.2" },
        { id: "eimis-anime-diffusion-v1-0", name: "Anime Diffusion" },
        { id: "anashel-rpg", name: "RPG" },
        { id: "xsarchitectural-interior-design", name: "InteriorDesign" },
        { id: "dream-shaper-v8", name: "DreamShaper v8" },
        { id: "synthwave-punk-v2", name: "SynthwavePunk v2" },
      ];

      models.forEach((model) => {
        const option = document.createElement("option");
        option.value = model.id;
        option.textContent = model.name;
        modelDropdown.appendChild(option);
      });

      const smallTitle3 = document.createElement("div");
      smallTitle3.textContent = "Resolution";
      smallTitle3.style.color = "#ffffff";
      smallTitle3.style.fontSize = "12px";
      smallTitle3.style.marginBottom = "2px";
      smallTitle3.style.textAlign = "left";
      smallTitle3.id = "resolutionTitle";

      const modelDropdownResolution = document.createElement("select");
      modelDropdownResolution.style.display = "block";
      modelDropdownResolution.style.margin = "8px 0";
      modelDropdownResolution.style.backgroundColor = "#17182b";
      modelDropdownResolution.style.border = "1px solid #3996fb";
      modelDropdownResolution.style.color = "#ffffff";
      modelDropdownResolution.style.padding = "8px";
      modelDropdownResolution.id = "resolutionDropdown";

      function getResolutions(modelId) {
        let options = [];

        switch (modelId) {
          case "sd_xl":
            options = [
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
              { text: "768 x 1344: Vertical (9:16)", value: "768x1344" },
              { text: "915 x 1144: Portrait (4:5)", value: "915x1144" },
              { text: "1182 x 886: Photo (4:3)", value: "1182x886" },
              { text: "1254 x 836: Landscape (3:2)", value: "1254x836" },
              { text: "1365 x 768: Widescreen (16:9)", value: "1365x768" },
              { text: "1564 x 670: Cinematic (21:9)", value: "1564x670" },
            ];
            break;
          case "leonardo-old":
            options = [
              { text: "512 x 512: Square (1:1)", value: "512x512" },
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
              { text: "768 x 1344: Vertical (9:16)", value: "768x1344" },
              { text: "915 x 1144: Portrait (4:5)", value: "915x1144" },
              { text: "1182 x 886: Photo (4:3)", value: "1182x886" },
              { text: "1254 x 836: Landscape (3:2)", value: "1254x836" },
              { text: "1365 x 768: Widescreen (16:9)", value: "1365x768" },
              { text: "1564 x 670: Cinematic (21:9)", value: "1564x670" },
            ];
            break;
          case "leonardo":
            options = [
              { text: "512 x 512: Square (1:1)", value: "512x512" },
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
            ];
            break;
          case "midjourney":
            options = [
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
              { text: "1280 x 1024: Frame & Print (5:4)", value: "1280x1024" },
              { text: "1254 x 836: Landscape (3:2)", value: "1254x836" },
              { text: "1260 x 720: HD Screens (7:4)", value: "1260x720" },
            ];
            break;
          case "dall-e-2":
            options = [
              { text: "256 x 256: Square (1:1)", value: "256x256" },
              { text: "512 x 512: Square (1:1)", value: "512x512" },
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
            ];
            break;
          case "dall-e-3":
            options = [
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
              {
                text: "1792 x 1024: Landscape HD Screens (7:4)",
                value: "1792x1024",
              },
              {
                text: "1024 x 1792: Portrait HD Screens (7:4)",
                value: "1024x1792",
              },
            ];
            break;
          case "i4ai":
            options = [
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
            ];
          case "v4ai":
            options = [
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
            ];
          case "dc4ai":
            options = [
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
            ];
            break;
          case "pp4ai":
            options = [
              { text: "512 x 512: Square (1:1)", value: "512x512" },
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
            ];
            break;
          case "flux-schnell":
          case "flux-dev":
          case "flux-pro":
          case "sd3":
          case "l4ai":
            options = [
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
              { text: "768 x 1344: Portrait (9:16)", value: "768x1344" },
              { text: "1344 x 768: Landscape (16:9)", value: "1344x768" },
              { text: "1536 x 640: Ultra-Wide (21:9)", value: "1536x640" },
              { text: "640 x 1536: Ultra-Tall (9:21)", value: "640x1536" },
              { text: "1216 x 832: Landscape (3:2)", value: "1216x832" },
              { text: "832 x 1216: Portrait (2:3)", value: "832x1216" },
              { text: "1088 x 896: Square-ish (5:4)", value: "1088x896" },
              { text: "896 x 1088: Portrait-ish (4:5)", value: "896x1088" },
            ];
            break;

          default:
            options = [
              { text: "512 x 512: Square (1:1)", value: "512x512" },
              { text: "1024 x 1024: Square (1:1)", value: "1024x1024" },
            ];
        }

        modelDropdownResolution.innerHTML = "";

        options.forEach((option) => {
          const resolutionOption = document.createElement("option");
          resolutionOption.value = option.value;
          resolutionOption.textContent = option.text;
          modelDropdownResolution.appendChild(resolutionOption);
        });
      }

      getResolutions(models[0].id);

      let generationCost = 35;
      let remainingCredits = 7800;

      chrome.storage.local.get("credits", (result) => {
        if (result.credits !== undefined) {
          remainingCredits = result.credits;
          updateCreditsInfo();
        }
      });

      const creditsInfoText = document.createElement("div");
      creditsInfoText.style.color = "#ffffff";
      creditsInfoText.style.fontSize = "12px";
      creditsInfoText.style.marginTop = "10px";

      updateCreditsInfo();

      const creditCosts = {
        "dall-e-2": {
          "256x256": 160,
          "512x512": 180,
          "1024x1024": 200,
        },
        "dall-e-3": {
          "1024x1024": 400,
          "1792x1024": 800,
          "1024x1792": 800,
        },
        sd_xl: {
          "1024x1024": 20,
          "768x1344": 20,
          "915x1144": 20,
          "1182x886": 20,
          "1254x836": 20,
          "1365x768": 20,
          "1564x670": 20,
        },
        leonardo: {
          "512x512": 250,
          "1024x1024": 1000,
          "768x1344": 1000,
          "915x1144": 1000,
          "1182x886": 1000,
          "1254x836": 1000,
          "1365x768": 1000,
          "1564x670": 1000,
        },
        midjourney: {
          "1024x1024": 450,
          "1280x1024": 450,
          "1254x836": 450,
          "1260x720": 450,
        },
        i4ai: {
          "1024x1024": 35,
          "768x1344": 35,
          "915x1144": 35,
          "1182x886": 35,
          "1254x836": 35,
          "1365x768": 35,
          "1564x670": 35,
        },
        v4ai: {
          "1024x1024": 35,
          "768x1344": 35,
          "915x1144": 35,
          "1182x886": 35,
          "1254x836": 35,
          "1365x768": 35,
          "1564x670": 35,
        },
        dc4ai: {
          "1024x1024": 480,
          "1280x1024": 480,
          "1254x836": 480,
          "1260x720": 480,
        },
        pp4ai: {
          "512x512": 25,
          "1024x1024": 45,
        },
        "flux-schnell": {
          "1024x1024": 30,
          "768x1344": 30,
          "1344x768": 30,
          "1536x640": 30,
          "640x1536": 30,
          "1216x832": 30,
          "832x1216": 30,
          "1088x896": 30,
          "896x1088": 30,
        },
        "flux-dev": {
          "1024x1024": 300,
          "768x1344": 300,
          "1344x768": 300,
          "1536x640": 300,
          "640x1536": 300,
          "1216x832": 300,
          "832x1216": 300,
          "1088x896": 300,
          "896x1088": 300,
        },
        "flux-pro": {
          "1024x1024": 550,
          "768x1344": 550,
          "1344x768": 550,
          "1536x640": 550,
          "640x1536": 550,
          "1216x832": 550,
          "832x1216": 550,
          "1088x896": 550,
          "896x1088": 550,
        },
        sd3: {
          "1024x1024": 350,
          "768x1344": 350,
          "1344x768": 350,
          "1536x640": 350,
          "640x1536": 350,
          "1216x832": 350,
          "832x1216": 350,
          "1088x896": 350,
          "896x1088": 350,
        },
        l4ai: {
          "1024x1024": 35,
          "768x1344": 35,
          "1344x768": 35,
          "1536x640": 35,
          "640x1536": 35,
          "1216x832": 35,
          "832x1216": 35,
          "1088x896": 35,
          "896x1088": 35,
        },
        default: {
          "512x512": 10,
          "1024x1024": 30,
        },
      };

      function updateCreditsInfo() {
        creditsInfoText.textContent = `This generation will cost ${generationCost} credits. You have ${remainingCredits} credits remaining. The image generation may take up to 5 minutes for this AI model, please stay patient.`;
      }

      modelDropdown.addEventListener("change", (event) => {
        const selectedModelId = event.target.value;
        getResolutions(selectedModelId);
        updateCreditBalance(selectedModelId, modelDropdownResolution.value);
      });

      modelDropdownResolution.addEventListener("change", (event) => {
        const selectedModelId = modelDropdown.value;
        updateCreditBalance(selectedModelId, event.target.value);
      });

      function updateCreditBalance(model, resolution) {
        let credits = creditCosts[model]?.[resolution] || 35;
        generationCost = credits;

        updateCreditsInfo();
      }

      function updateRemainingCredits() {
        remainingCredits -= generationCost;
        chrome.storage.local.set({ credits: remainingCredits }, () => {
          updateCreditsInfo();
        });
      }

      const submitButton = document.createElement("button");
      submitButton.textContent = "Generate Image";
      submitButton.style.backgroundColor = "#3996fb";
      submitButton.style.color = "#ffffff";
      submitButton.style.border = "none";
      submitButton.style.padding = "10px";
      submitButton.style.cursor = "pointer";
      submitButton.style.width = "30%";
      submitButton.style.borderRadius = "5px";
      submitButton.style.marginTop = "10px";
      submitButton.id = "generateButton";

      submitButton.addEventListener("click", () => {
        console.log("generate");
      });

      const imagePreviewContainer = document.createElement("div");
      imagePreviewContainer.style.marginTop = "10px";
      imagePreviewContainer.style.textAlign = "center";

      const imageTitle = document.createElement("h3");
      imageTitle.textContent = "Generated Image";
      imageTitle.style.fontFamily = "Arial, sans-serif";
      imageTitle.style.fontSize = "18px";
      imageTitle.style.color = "#333";
      imagePreviewContainer.appendChild(imageTitle);

      const imagePreview = document.createElement("div");
      imagePreview.style.display = "none";
      imagePreview.style.marginTop = "10px";
      imagePreview.style.display = "flex";
      imagePreview.style.justifyContent = "space-between";
      imagePreview.textContent = "Generated Image";
      imagePreviewContainer.appendChild(imagePreview);

      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "center";
      buttonContainer.style.gap = "10px";
      buttonContainer.style.marginTop = "10px";
      imagePreviewContainer.appendChild(buttonContainer);

      const downloadButton = document.createElement("button");
      downloadButton.textContent = "Download";
      downloadButton.style.backgroundColor = "#4CAF50";
      downloadButton.style.color = "#fff";
      downloadButton.style.border = "none";
      downloadButton.style.padding = "10px 20px";
      downloadButton.style.cursor = "pointer";
      downloadButton.style.fontFamily = "Arial, sans-serif";
      downloadButton.style.borderRadius = "5px";

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.style.backgroundColor = "#007BFF";
      editButton.style.color = "#fff";
      editButton.style.border = "none";
      editButton.style.padding = "10px 20px";
      editButton.style.cursor = "pointer";
      editButton.style.fontFamily = "Arial, sans-serif";
      editButton.style.borderRadius = "5px";

      editButton.addEventListener("click", () => {
        window.location.href = "https://app.ai4chat.co/image-editor";
      });

      buttonContainer.appendChild(downloadButton);
      buttonContainer.appendChild(editButton);

      submitButton.addEventListener("click", () => {
        const promptValue = document.getElementById("promptInput").value || ""; // Default to '' if empty
        const modelValue =
          document.getElementById("modelDropdownSelect").value || "l4ai"; // Default to 'l4ai' if empty
        const resolutionValue =
          document.getElementById("resolutionDropdown").value; // Get selected resolution value

        // Parse resolution values from dropdown
        const [width, height] = resolutionValue.split("x").map(Number);

        // Get optional values (negative prompt and seed)
        const negativePromptValue =
          document.getElementById("negativePrompt").value || ""; // Default to empty string if not provided
        const seedValue = document.getElementById("seed").value || null; // Default to null if empty

        const payload = {
          prompt: promptValue,
          negative_prompt: negativePromptValue,
          model: modelValue,
          width: width || 1024, // Default to 1024 if resolution not properly parsed
          height: height || 1024, // Default to 1024 if resolution not properly parsed
          seed: seedValue,
          steps: 25, // Set steps to 25 as per the given requirement
        };

        console.log("Payload: ", payload);

        imageTitle.style.display = "none";
        imagePreview.style.display = "none";
        buttonContainer.style.display = "none";

        const loadingGif = document.createElement("img");
        loadingGif.src = "loading-load.gif";
        loadingGif.alt = "Loading...";
        loadingGif.style.width = "50px";
        loadingGif.style.marginTop = "10px";
        imagePreview.innerHTML = "";
        imagePreviewContainer.appendChild(loadingGif);

        const timerElement = document.createElement("div");
        timerElement.style.marginTop = "10px";
        timerElement.style.color = "#fff";
        timerElement.style.fontSize = "14px";
        imagePreviewContainer.appendChild(timerElement);

        let timerValue = 0.0;
        const timerInterval = setInterval(() => {
          timerValue += 0.1;
          timerElement.textContent = `Time elapsed: ${timerValue.toFixed(1)}s`;
        }, 1000);

        fetch("https://app.ai4chat.co/generateAndUploadImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((response) => response.json()) // Parse JSON response
          .then((data) => {
            clearInterval(timerInterval); // Stop the timer

            // Remove the loading gif and timer
            loadingGif.remove();
            timerElement.remove();

            // Show the title, image preview, and button container
            imageTitle.style.display = "block";
            imagePreview.style.display = "block";
            buttonContainer.style.display = "flex";

            console.log("Response: ", data); // Log the response for debugging
            const imageUrl = data?.imageUrl;
            if (imageUrl) {
              // Create an image element
              const imageElement = document.createElement("img");
              imageElement.src = imageUrl;
              imageElement.alt = "Generated Image";
              imageElement.style.maxWidth = "300px";
              imageElement.style.border = "2px solid #000";

              // Clear any previous image in the div and add the new image
              imagePreview.innerHTML = "Generated Image:";
              imagePreview.appendChild(imageElement);

              // Show the image preview div
              imagePreview.style.display = "block";
              updateRemainingCredits();
            } else {
              alert("No image URL found in the response."); // Handle if image URL is missing
            }
          })
          .catch((error) => {
            console.error("Error: ", error);
            clearInterval(timerInterval);
            loadingGif.remove();
            timerElement.remove();
            alert("An error occurred while generating the image.");
          });
      });

      const advancedSettingsText = document.createElement("div");
      advancedSettingsText.textContent = "Show Advanced Settings";
      advancedSettingsText.style.color = "#3996fb";
      advancedSettingsText.style.fontSize = "14px";
      advancedSettingsText.style.margin = "10px 0";
      advancedSettingsText.style.textAlign = "left";
      advancedSettingsText.style.cursor = "pointer";

      const advancedSettingsContainer = document.createElement("div");
      advancedSettingsContainer.style.display = "none";
      advancedSettingsContainer.style.marginTop = "10px";
      advancedSettingsContainer.style.display = "flex";
      advancedSettingsContainer.style.justifyContent = "space-between";

      const negativePromptField = document.createElement("input");
      negativePromptField.type = "text";
      negativePromptField.placeholder = "Negative Prompt";
      negativePromptField.style.width = "48%";
      negativePromptField.style.backgroundColor = "#17182b";
      negativePromptField.style.border = "1px solid #3996fb";
      negativePromptField.style.color = "#ffffff";
      negativePromptField.style.padding = "8px";
      negativePromptField.id = "negativePrompt";

      const seedField = document.createElement("input");
      seedField.type = "text";
      seedField.placeholder = "Seed";
      seedField.style.width = "48%";
      seedField.style.backgroundColor = "#17182b";
      seedField.style.border = "1px solid #3996fb";
      seedField.style.color = "#ffffff";
      seedField.style.padding = "8px";
      seedField.id = "seed";

      advancedSettingsContainer.appendChild(negativePromptField);
      advancedSettingsContainer.appendChild(seedField);

      chatbotMessages1.appendChild(smallTitle1);
      chatbotMessages1.appendChild(inputField1);
      chatbotMessages1.appendChild(smallTitle2);
      chatbotMessages1.appendChild(modelDropdown);
      chatbotMessages1.appendChild(smallTitle3);
      chatbotMessages1.appendChild(modelDropdownResolution);
      chatbotMessages1.appendChild(advancedSettingsText);
      chatbotMessages1.appendChild(advancedSettingsContainer);
      chatbotMessages1.appendChild(submitButton);

      chatbotMessages1.appendChild(creditsInfoText);
      chatbotMessages1.appendChild(imagePreviewContainer);

      // Event listener to toggle the visibility of advanced settings
      advancedSettingsText.addEventListener("click", () => {
        isAdvancedSettingsVisible = !isAdvancedSettingsVisible; // Toggle visibility state

        // Show or hide the advanced settings container and update text
        if (isAdvancedSettingsVisible) {
          advancedSettingsContainer.style.display = "flex"; // Show fields
          advancedSettingsText.textContent = "Hide Advanced Settings"; // Change text
        } else {
          advancedSettingsContainer.style.display = "none"; // Hide fields
          advancedSettingsText.textContent = "Show Advanced Settings"; // Revert text
        }
      });

      // Set the scrollable style to the chatbotMessages1 container
      chatbotMessages1.style.maxHeight = "300px";
      chatbotMessages1.style.overflowY = "auto";
    } else {
      chatbotModel.innerHTML = originalModelContent;
      chatbotMessages1.innerHTML = "";
    }

    isTextToImageMode = !isTextToImageMode;
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
        console.log("Last active tab URL:", lastTabUrl);
        urlInput.value = lastTabUrl; // Set the URL input to the retrieved tab URL
        await fetchMarkdownFromUrl(lastTabUrl); // Fetch markdown for the last active tab URL
      } catch (error) {
        console.error("Error retrieving last active tab URL:", error);
      }
    });

 
  // Your existing function to get the last active tab URL from storage
function getLastTabUrlFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("lastTabUrl", (result) => {
      if (result.lastTabUrl) {
        console.log("Last Active Tab URL from Storage:", result.lastTabUrl);
        resolve(result.lastTabUrl);
      } else {
        console.log("No URL found in storage.");
        reject("No URL found");
      }
    });
  });
}

// Function to update the last active tab URL in storage
function updateLastTabUrlInStorage(newUrl) {
  chrome.storage.local.set({ lastTabUrl: newUrl }, () => {
    console.log("Last Active Tab URL updated in Storage:", newUrl);
  });
}

// Listen for URL changes in any tab and update the storage
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && !tab.url.includes("chrome-extension://")) {
    updateLastTabUrlInStorage(changeInfo.url);
  }
});

// Listen for when the active tab changes and update the storage
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && !tab.url.includes("chrome-extension://")) {
      updateLastTabUrlInStorage(tab.url);
    }
  });
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

  let replyModalOpen = false;

  // Fetch the recipient info and display the reply modal if needed
  chrome.storage.local.get(
    ["showReplyModal", "recipientInfo", "emailBody"],
    (data) => {
      if (data.showReplyModal && !replyModalOpen) {
        replyModalOpen = true;
        createReplyModal(data.recipientInfo, data.emailBody); // Pass recipient info to the modal
        chrome.storage.local.remove([
          "showReplyModal",
          "recipientInfo",
          "emailBody",
        ]);
      }
    }
  );

  // Function to create the reply modal
  function createReplyModal(recipient, emailBody) {
    const modal = document.createElement("div");
    modal.id = "replyModal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "400px";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#17182b";
    modal.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
    modal.style.zIndex = "1000";
    modal.style.borderRadius = "10px";
    modal.style.fontFamily = "Arial, sans-serif";
    modal.style.color = "#fff";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.backgroundColor = "#ff4d4d";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.padding = "5px 10px";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener("click", () => {
      modal.remove();
      replyModalOpen = false; // Reset the flag when modal is closed
    });

    // Display the recipient's information in the title
    const titleBox = document.createElement("div");
    titleBox.textContent = `Replying to: ${recipient.name} <${recipient.email}>`;
    titleBox.style.marginBottom = "15px";
    titleBox.style.fontWeight = "bold";
    titleBox.style.fontSize = "16px";

    // Input box for user prompt
    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.style.marginTop = "20px";
    inputBox.placeholder =
      "We will draft a nice reply for you. Write something and press ENTER.";
    inputBox.style.width = "95%";
    inputBox.style.padding = "10px";
    inputBox.style.marginBottom = "20px";
    inputBox.style.border = "2px solid #3996fb";
    inputBox.style.borderRadius = "5px";
    inputBox.style.fontSize = "16px";
    inputBox.style.backgroundColor = "#17182b";
    inputBox.style.color = "#fff";

    // Chatbot response area (initially hidden or empty)
    const chatbotResponse = document.createElement("div");
    chatbotResponse.id = "chatbotResponse";
    chatbotResponse.style.display = "none";
    chatbotResponse.style.marginBottom = "20px";
    chatbotResponse.style.backgroundColor = "#17182b";
    chatbotResponse.style.borderRadius = "5px";
    chatbotResponse.style.padding = "10px";
    chatbotResponse.style.fontSize = "14px";
    chatbotResponse.style.maxHeight = "150px";
    chatbotResponse.style.overflowY = "auto";

    // Predefined buttons and Send button container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "space-between";

    const leftButtons = document.createElement("div");
    leftButtons.style.display = "flex";
    leftButtons.style.gap = "10px";

    const coldEmailButton = document.createElement("button");
    coldEmailButton.textContent = "Generate a reply";
    coldEmailButton.style.padding = "10px 15px";
    coldEmailButton.style.backgroundColor = "#3996fb";
    coldEmailButton.style.color = "white";
    coldEmailButton.style.border = "none";
    coldEmailButton.style.borderRadius = "5px";
    coldEmailButton.style.cursor = "pointer";

    const introduceButton = document.createElement("button");
    introduceButton.textContent = "Ask for more details";
    introduceButton.style.padding = "10px 15px";
    introduceButton.style.backgroundColor = "#3996fb";
    introduceButton.style.color = "white";
    introduceButton.style.border = "none";
    introduceButton.style.borderRadius = "5px";
    introduceButton.style.cursor = "pointer";

    leftButtons.appendChild(coldEmailButton);
    leftButtons.appendChild(introduceButton);

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.style.padding = "10px 20px";
    sendButton.style.backgroundColor = "#3996fb";
    sendButton.style.color = "white";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "5px";
    sendButton.style.cursor = "pointer";

    buttonContainer.appendChild(leftButtons);
    buttonContainer.appendChild(sendButton);

    // Close button
    const emailBodyBox = document.createElement("div");
    emailBodyBox.textContent = `Email Content: ${emailBody}`;
    emailBodyBox.style.marginBottom = "20px";
    emailBodyBox.style.padding = "10px";
    emailBodyBox.style.border = "2px solid #3996fb";
    emailBodyBox.style.borderRadius = "5px";
    emailBodyBox.style.maxHeight = "150px";
    emailBodyBox.style.overflowY = "auto";

    emailBodyBox.classList.add("custom-scrollbar");

    modal.appendChild(closeButton);
    modal.appendChild(titleBox); // Append recipient title first
    modal.appendChild(emailBodyBox);
    modal.appendChild(inputBox);
    modal.appendChild(chatbotResponse);
    modal.appendChild(buttonContainer);

    document.body.appendChild(modal);

    // Handle Send button click and input box "Enter" key event
    sendButton.addEventListener("click", () => {
      const userPrompt = inputBox.value;
      if (userPrompt) {
        sendMessageToChatbot(userPrompt, recipient);
        modal.remove();
      }
    });

    coldEmailButton.addEventListener("click", () => {
      const userPrompt = inputBox.value || ""; // Get the user prompt from the input box
      const fullPrompt = `Generate a reply for the following email: ${emailBody}\nUser input: ${userPrompt}`;
      sendMessageToChatbot(fullPrompt); // Send both the email body and user input
      modal.remove();
    });

    // Handle "Ask for more details" button click
    introduceButton.addEventListener("click", () => {
      const userPrompt = inputBox.value || ""; // Get the user prompt from the input box
      const fullPrompt = `Ask for more details about the following email: ${emailBody}\nUser input: ${userPrompt}`;
      sendMessageToChatbot(fullPrompt); // Send both the email body and user input
      modal.remove();
    });

    inputBox.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const userPrompt = inputBox.value;
        if (userPrompt) {
          sendMessageToChatbot(userPrompt, recipient);
          modal.remove();
        }
      }
    });
  }

  let replyModalOpenOutlook = false;

  chrome.storage.local.get(["showReplyModalOutlook"], (data) => {
    if (data.showReplyModalOutlook && !replyModalOpenOutlook) {
      replyModalOpenOutlook = true;
      createReplyModalOutlook(); // Pass recipient info to the modal
      chrome.storage.local.remove(["showReplyModalOutlook"]);
    }
  });

  // Function to create the reply modal
  function createReplyModalOutlook() {
    // Retrieve the sender info from storage
    chrome.storage.local.get(["senderInfo", "emailBodyText"], (result) => {
      const { name, email } = result.senderInfo || {};
      const emailBodyText =
        result.emailBodyText || "No email content available";

      const modal = document.createElement("div");
      modal.id = "replyModal";
      modal.style.position = "fixed";
      modal.style.top = "50%";
      modal.style.left = "50%";
      modal.style.transform = "translate(-50%, -50%)";
      modal.style.width = "400px";
      modal.style.padding = "20px";
      modal.style.backgroundColor = "#17182b";
      modal.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
      modal.style.zIndex = "1000";
      modal.style.borderRadius = "10px";
      modal.style.fontFamily = "Arial, sans-serif";
      modal.style.color = "#fff";

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.style.position = "absolute";
      closeButton.style.top = "10px";
      closeButton.style.right = "10px";
      closeButton.style.backgroundColor = "#ff4d4d";
      closeButton.style.color = "white";
      closeButton.style.border = "none";
      closeButton.style.padding = "5px 10px";
      closeButton.style.borderRadius = "5px";
      closeButton.style.cursor = "pointer";

      closeButton.addEventListener("click", () => {
        modal.remove();
        replyModalOpen = false;
      });

      // Display the recipient's information in the title
      const titleBox = document.createElement("div");
      titleBox.textContent =
        name && email
          ? `Replying to: ${name} <${email}>`
          : "Replying to: Unknown";
      titleBox.style.marginBottom = "15px";
      titleBox.style.fontWeight = "bold";
      titleBox.style.fontSize = "16px";

      const emailBodyDiv = document.createElement("div");
      emailBodyDiv.textContent = `Email Body: ${emailBodyText}`;
      emailBodyDiv.style.marginTop = "20px";
      emailBodyDiv.style.padding = "10px";
      emailBodyDiv.style.border = "1px solid #3996fb";
      emailBodyDiv.style.borderRadius = "5px";
      emailBodyDiv.style.backgroundColor = "#282c34";
      emailBodyDiv.style.fontSize = "14px";
      emailBodyDiv.style.maxHeight = "150px";
      emailBodyDiv.style.overflowY = "auto";

      // Input box for user prompt
      const inputBox = document.createElement("input");
      inputBox.type = "text";
      inputBox.style.marginTop = "20px";
      inputBox.placeholder =
        "We will draft a nice reply for you. Write something and press ENTER.";
      inputBox.style.width = "95%";
      inputBox.style.padding = "10px";
      inputBox.style.marginBottom = "20px";
      inputBox.style.border = "2px solid #3996fb";
      inputBox.style.borderRadius = "5px";
      inputBox.style.fontSize = "16px";
      inputBox.style.backgroundColor = "#17182b";
      inputBox.style.color = "#fff";

      // Chatbot response area (initially hidden or empty)
      const chatbotResponse = document.createElement("div");
      chatbotResponse.id = "chatbotResponse";
      chatbotResponse.style.display = "none";
      chatbotResponse.style.marginBottom = "20px";
      chatbotResponse.style.backgroundColor = "#17182b";
      chatbotResponse.style.borderRadius = "5px";
      chatbotResponse.style.padding = "10px";
      chatbotResponse.style.fontSize = "14px";
      chatbotResponse.style.maxHeight = "150px";
      chatbotResponse.style.overflowY = "auto";

      // Predefined buttons and Send button container
      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "space-between";

      const leftButtons = document.createElement("div");
      leftButtons.style.display = "flex";
      leftButtons.style.gap = "10px";

      const coldEmailButton = document.createElement("button");
      coldEmailButton.textContent = "Generate a reply";
      coldEmailButton.style.padding = "10px 15px";
      coldEmailButton.style.backgroundColor = "#3996fb";
      coldEmailButton.style.color = "white";
      coldEmailButton.style.border = "none";
      coldEmailButton.style.borderRadius = "5px";
      coldEmailButton.style.cursor = "pointer";

      const introduceButton = document.createElement("button");
      introduceButton.textContent = "Ask for more details";
      introduceButton.style.padding = "10px 15px";
      introduceButton.style.backgroundColor = "#3996fb";
      introduceButton.style.color = "white";
      introduceButton.style.border = "none";
      introduceButton.style.borderRadius = "5px";
      introduceButton.style.cursor = "pointer";

      leftButtons.appendChild(coldEmailButton);
      leftButtons.appendChild(introduceButton);

      const sendButton = document.createElement("button");
      sendButton.textContent = "Send";
      sendButton.style.padding = "10px 15px";
      sendButton.style.backgroundColor = "#3996fb";
      sendButton.style.color = "white";
      sendButton.style.border = "none";
      sendButton.style.borderRadius = "5px";
      sendButton.style.cursor = "pointer";

      buttonContainer.appendChild(leftButtons);
      buttonContainer.appendChild(sendButton);
      modal.appendChild(closeButton);
      modal.appendChild(titleBox);
      modal.appendChild(emailBodyDiv);
      modal.appendChild(inputBox);
      modal.appendChild(chatbotResponse);
      modal.appendChild(buttonContainer);

      document.body.appendChild(modal);

      // Event listeners for left-side buttons
      coldEmailButton.addEventListener("click", () => {
        const userPrompt = inputBox.value || "";
        const fullPrompt = `Generate a reply for the following email: ${emailBodyText}\n User input: ${userPrompt}`;
        sendMessageToChatbot(fullPrompt);
        modal.remove();
      });

      inputBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const userPrompt = inputBox.value;
          if (userPrompt) {
            sendMessageToChatbot(userPrompt);
            modal.remove();
          }
        }
      });

      introduceButton.addEventListener("click", () => {
        const userPrompt = inputBox.value || "";
        const fullPrompt = `Ask for more details about the following email : ${emailBodyText} \n User input: ${userPrompt}`;
        sendMessageToChatbot(fullPrompt);
        modal.remove();
      });

      function sendMessageWithContext(userPrompt) {
        const fullPrompt = `${userPrompt}\nContext: ${emailBodyText}`;
        sendMessageToChatbot(fullPrompt);
      }

      sendButton.addEventListener("click", () => {
        const userPrompt = inputBox.value;
        if (userPrompt) {
          sendMessageWithContext(userPrompt);
          modal.remove();
        }
      });
    });
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "reply_modal_outlook" && message.outlook) {
      createReplyModalOutlook();
    }
  });

  chrome.storage.local.get("showModal", (data) => {
    if (data.showModal) {
      createDynamicModal();
      chrome.storage.local.remove("showModal");
    }
  });

  function createDynamicModal() {
    const modal = document.createElement("div");
    modal.id = "dynamicModal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "400px";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#17182b";
    modal.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
    modal.style.zIndex = "1000";
    modal.style.borderRadius = "10px";
    modal.style.fontFamily = "Arial, sans-serif";
    modal.style.color = "#fff";

    // Input box for user prompt
    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.style.marginTop = "20px";
    inputBox.placeholder =
      "We will draft a nice mail for you, write something and press ENTER.";
    inputBox.style.width = "95%";
    inputBox.style.padding = "10px";
    inputBox.style.marginBottom = "20px";
    inputBox.style.border = "2px solid #3996fb";
    inputBox.style.borderRadius = "5px";
    inputBox.style.fontSize = "16px";
    inputBox.style.backgroundColor = "#17182b";
    inputBox.style.color = "#fff";

    // Chatbot response area (initially hidden or empty)
    const chatbotResponse = document.createElement("div");
    chatbotResponse.id = "chatbotResponse";
    chatbotResponse.style.display = "none";
    chatbotResponse.style.marginBottom = "20px";
    chatbotResponse.style.backgroundColor = "#17182b";
    chatbotResponse.style.borderRadius = "5px";
    chatbotResponse.style.padding = "10px";
    chatbotResponse.style.fontSize = "14px";
    chatbotResponse.style.maxHeight = "150px";
    chatbotResponse.style.overflowY = "auto";

    // Predefined buttons and Send button container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "space-between";

    const leftButtons = document.createElement("div");
    leftButtons.style.display = "flex";
    leftButtons.style.gap = "10px";

    const coldEmailButton = document.createElement("button");
    coldEmailButton.textContent = "Cold email";
    coldEmailButton.style.padding = "10px 15px";
    coldEmailButton.style.backgroundColor = "#3996fb";
    coldEmailButton.style.color = "white";
    coldEmailButton.style.border = "none";
    coldEmailButton.style.borderRadius = "5px";
    coldEmailButton.style.cursor = "pointer";

    const introduceButton = document.createElement("button");
    introduceButton.textContent = "Introduce yourself";
    introduceButton.style.padding = "10px 15px";
    introduceButton.style.backgroundColor = "#3996fb";
    introduceButton.style.color = "white";
    introduceButton.style.border = "none";
    introduceButton.style.borderRadius = "5px";
    introduceButton.style.cursor = "pointer";

    leftButtons.appendChild(coldEmailButton);
    leftButtons.appendChild(introduceButton);

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.style.padding = "10px 20px";
    sendButton.style.backgroundColor = "#3996fb";
    sendButton.style.color = "white";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "5px";
    sendButton.style.cursor = "pointer";

    buttonContainer.appendChild(leftButtons);
    buttonContainer.appendChild(sendButton);

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.backgroundColor = "#ff4d4d";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.padding = "5px 10px";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener("click", () => {
      modal.remove();
    });

    // Append elements to modal
    modal.appendChild(closeButton);
    modal.appendChild(inputBox);
    modal.appendChild(chatbotResponse);
    modal.appendChild(buttonContainer);

    document.body.appendChild(modal);

    // Event listeners for sending prompt
    sendButton.addEventListener("click", () => {
      const userPrompt = inputBox.value;
      if (userPrompt) {
        sendMessageToChatbot(userPrompt);
        modal.remove();
      }
    });

    inputBox.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const userPrompt = inputBox.value;
        if (userPrompt) {
          sendMessageToChatbot(userPrompt);
          modal.remove();
        }
      }
    });
  }

  chrome.storage.local.get("showOutlookModal", (data) => {
    if (data.showOutlookModal) {
      createDynamicModalOutlook();
      chrome.storage.local.remove("showOutlookModal");
    }
  });

  function createDynamicModalOutlook() {
    const modal = document.createElement("div");
    modal.id = "dynamicModal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "400px";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#17182b";
    modal.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
    modal.style.zIndex = "1000";
    modal.style.borderRadius = "10px";
    modal.style.fontFamily = "Arial, sans-serif";
    modal.style.color = "#fff";

    // Input box for user prompt
    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.style.marginTop = "20px";
    inputBox.placeholder =
      "We will draft a nice mail for you, write something and press ENTER.";
    inputBox.style.width = "95%";
    inputBox.style.padding = "10px";
    inputBox.style.marginBottom = "20px";
    inputBox.style.border = "2px solid #3996fb";
    inputBox.style.borderRadius = "5px";
    inputBox.style.fontSize = "16px";
    inputBox.style.backgroundColor = "#17182b";
    inputBox.style.color = "#fff";

    // Chatbot response area (initially hidden or empty)
    const chatbotResponse = document.createElement("div");
    chatbotResponse.id = "chatbotResponse";
    chatbotResponse.style.display = "none";
    chatbotResponse.style.marginBottom = "20px";
    chatbotResponse.style.backgroundColor = "#17182b";
    chatbotResponse.style.borderRadius = "5px";
    chatbotResponse.style.padding = "10px";
    chatbotResponse.style.fontSize = "14px";
    chatbotResponse.style.maxHeight = "150px";
    chatbotResponse.style.overflowY = "auto";

    // Predefined buttons and Send button container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "space-between";

    const leftButtons = document.createElement("div");
    leftButtons.style.display = "flex";
    leftButtons.style.gap = "10px";

    const coldEmailButton = document.createElement("button");
    coldEmailButton.textContent = "Cold email";
    coldEmailButton.style.padding = "10px 15px";
    coldEmailButton.style.backgroundColor = "#3996fb";
    coldEmailButton.style.color = "white";
    coldEmailButton.style.border = "none";
    coldEmailButton.style.borderRadius = "5px";
    coldEmailButton.style.cursor = "pointer";

    const introduceButton = document.createElement("button");
    introduceButton.textContent = "Introduce yourself";
    introduceButton.style.padding = "10px 15px";
    introduceButton.style.backgroundColor = "#3996fb";
    introduceButton.style.color = "white";
    introduceButton.style.border = "none";
    introduceButton.style.borderRadius = "5px";
    introduceButton.style.cursor = "pointer";

    leftButtons.appendChild(coldEmailButton);
    leftButtons.appendChild(introduceButton);

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.style.padding = "10px 20px";
    sendButton.style.backgroundColor = "#3996fb";
    sendButton.style.color = "white";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "5px";
    sendButton.style.cursor = "pointer";

    buttonContainer.appendChild(leftButtons);
    buttonContainer.appendChild(sendButton);

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.backgroundColor = "#ff4d4d";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.padding = "5px 10px";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener("click", () => {
      modal.remove();
    });

    modal.appendChild(closeButton);
    modal.appendChild(inputBox);
    modal.appendChild(chatbotResponse);
    modal.appendChild(buttonContainer);

    document.body.appendChild(modal);

    // Event listeners for sending prompt
    sendButton.addEventListener("click", () => {
      const userPrompt = inputBox.value;
      if (userPrompt) {
        sendMessageToChatbot(userPrompt);
        modal.remove();
      }
    });

    inputBox.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const userPrompt = inputBox.value;
        if (userPrompt) {
          sendMessageToChatbot(userPrompt);
          modal.remove();
        }
      }
    });
  }

  // async function sendMessageToChatbot(messageText) {
  //   displayLoadingMessage();
  //   try {
  //     const sessionToken = await getSessionTokenFromStorage();
  //     if (!sessionToken) {
  //       console.log("No session token available.");
  //       return;
  //     }

  //     const chatid = await getLatestChatId();
  //     if (!chatid) {
  //       console.log("Failed to retrieve chat ID.");
  //       return;
  //     }

  //     const response = await fetch("https://app.ai4chat.co/chatgpt", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${sessionToken}`,
  //       },
  //       body: JSON.stringify({
  //         chatid,
  //         conversation: [{ role: "user", content: messageText }],
  //         timezoneOffset: new Date().getTimezoneOffset(),
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error("Error from server:", errorData.error);
  //       return;
  //     }

  //     const data = await response.text();
  //     displayChatbotResponse(data);
  //     removeLoadingMessage();
  //   } catch (error) {
  //     console.error("Error sending message to chatbot:", error);
  //     removeLoadingMessage();
  //   }
  // }

  // // Function to display the chatbot response in the modal
  // function displayChatbotResponse(responseText) {
  //   const chatbotResponse = document.getElementById("chatbotResponse");
  //   chatbotResponse.style.display = "block"; // Show the response div
  //   chatbotResponse.innerText = responseText; // Insert the response
  // }

  // // Function to show a "loading" message (optional)
  // function displayLoadingMessage() {
  //   const chatbotResponse = document.getElementById("chatbotResponse");
  //   chatbotResponse.style.display = "block"; // Make sure it's visible
  //   chatbotResponse.innerText = "Loading...";
  // }

  // // Function to remove the "loading" message
  // function removeLoadingMessage() {
  //   const chatbotResponse = document.getElementById("chatbotResponse");
  //   chatbotResponse.innerText = ""; // Clear the content
  // }

  // Function to show the options modal
  function showOptionsModal(selectedText) {
    // Create the modal HTML dynamically
    const modal = document.createElement("div");
    modal.innerHTML = `
      <div id="optionsModal">
      <button id="closeModalButton">Close the popup</button>
          <h3>What would you like to do with this text?</h3>
          <p>"${selectedText}"</p>
          <button id="shortenText">Make Shorter</button>
          <button id="makeLonger">Make Longer</button>
          <button id="improveText">Improve Writing</button>
          <button id="checkGrammar">Check grammar and Spelling</button>
          <button id="simplifyLanguage">Simplify Language</button>
      </div>
      <div id="modalBackdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); z-index: 999;"></div>
  `;
    document.body.appendChild(modal);

    // Attach event listeners to buttons
    document
      .getElementById("shortenText")
      .addEventListener("click", () =>
        handleOptionSelection("shorten", selectedText)
      );
    document
      .getElementById("makeLonger")
      .addEventListener("click", () =>
        handleOptionSelection("lengthen", selectedText)
      );
    document
      .getElementById("improveText")
      .addEventListener("click", () =>
        handleOptionSelection("improve", selectedText)
      );
    document
      .getElementById("checkGrammar")
      .addEventListener("click", () =>
        handleOptionSelection("check grammar", selectedText)
      );
    document
      .getElementById("simplifyLanguage")
      .addEventListener("click", () =>
        handleOptionSelection("simplify", selectedText)
      );
    document
      .getElementById("closeModalButton")
      .addEventListener("click", () => {
        chrome.storage.local.remove("selectedText", () => {
          console.log("Selected text removed from local storage");
        });

        // Close the modal and remove the backdrop
        document.getElementById("optionsModal").remove();
        document.getElementById("modalBackdrop").remove();
      });
  }

  // Function to handle option selection
  function handleOptionSelection(option, selectedText) {
    // Form the message based on the option
    let prompt = "";
    switch (option) {
      case "shorten":
        prompt = `Please shorten the following text: "${selectedText}"`;
        break;
      case "lengthen":
        prompt = `Please expand on the following text: "${selectedText}"`;
        break;
      case "improve":
        prompt = `Please improve the following text: "${selectedText}"`;
        break;
      case "check grammar":
        prompt = `Please check the grammar of the following text: "${selectedText}"`;
        break;
      case "simplify":
        prompt = `Please simplify he language of the following text: "${selectedText}"`;
    }

    // Send the prompt to the chatbot
    sendMessageToChatbot(prompt);

    chrome.storage.local.remove("selectedText", () => {
      console.log("Selected text removed from local storage");
    });

    // Close the modal
    document.getElementById("optionsModal").remove();
    document.getElementById("modalBackdrop").remove();
  }

  // Listen for messages from the background script to show the options modal
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "show_options_modal" && request.text) {
      showOptionsModal(request.text);
    }
  });

  // Call the function and update the popup UI
  getLastTabUrlAndSelectedTextFromStorage()
    .then((data) => {
      const chatInput = document.getElementById("chatbotInput"); // Chatbot's input area

      if (data.selectedText) {
        // Set the selected text into the chatbot input
        chatInput.value = data.selectedText;
      }

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

  const youtubeChatBtn = document.getElementById('youtubeChat');

// Event listener for youtubeChat button click
youtubeChatBtn.addEventListener('click', () => {
    
    const modal = document.createElement('div');
    modal.id = 'dynamicModal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.width = '300px';
    modal.style.backgroundColor = '#fff';
    modal.style.border = '2px solid #000319';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modal.style.zIndex = '1000';

    // Create the input field for the video ID
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Enter YouTube Video ID';
    inputField.id = 'videoIdInput';
    inputField.style.width = '100%';
    inputField.style.marginBottom = '10px';
    inputField.style.padding = '8px';

    // Create the continue button
    const continueBtn = document.createElement('button');
    continueBtn.innerText = 'Continue';
    continueBtn.style.backgroundColor = '#000319';
    continueBtn.style.color = '#fff';
    continueBtn.style.padding = '10px';
    continueBtn.style.border = 'none';
    continueBtn.style.cursor = 'pointer';
    continueBtn.style.width = '100%';

    const retrieveUrlBtn = document.createElement('button');
    retrieveUrlBtn.innerText = 'Retrieve Tab URL';
    retrieveUrlBtn.style.backgroundColor = '#007BFF';
    retrieveUrlBtn.style.color = '#fff';
    retrieveUrlBtn.style.padding = '10px';
    retrieveUrlBtn.style.border = 'none';
    retrieveUrlBtn.style.cursor = 'pointer';
    retrieveUrlBtn.style.width = '100%';
    retrieveUrlBtn.style.marginBottom = '10px';

    // Create a close button to hide the modal
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.style.color = '#000';

    // Append the input, button, and close button to the modal
    modal.appendChild(closeButton);
    modal.appendChild(inputField);
    modal.appendChild(retrieveUrlBtn);
    modal.appendChild(continueBtn);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Close button functionality
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    retrieveUrlBtn.addEventListener('click', () => {
      getLastTabUrlFromStorage()
          .then((url) => {
              // Set the retrieved URL into the input field
              document.getElementById('videoIdInput').value = url;
          })
          .catch((error) => {
              alert(error);
          });
  });

    // Continue button functionality
    continueBtn.addEventListener('click', () => {
        // const videoId = document.getElementById('videoIdInput').value.trim();

        // if (videoId === '') {
        //     alert('Please enter a valid YouTube Video ID.');
        //     return;
        // }
        const inputValue = document.getElementById('videoIdInput').value.trim();

        // Extract video ID from the input (URL or direct ID)
        const videoId = extractVideoId(inputValue);

        if (!videoId) {
            alert('Please enter a valid YouTube Video URL or ID.');
            return;
        }


        // Fetch the transcript using the provided video ID
        fetch(`http://localhost:3000/transcript/${videoId}`)
            .then(response => response.json())
            .then(data => {
                
                if (Array.isArray(data) && data.length > 0) {
                    
                    const transcriptDetails = data.map(entry => {
                        const text = entry.text || 'N/A';
                        const duration = entry.duration || '00:00';
                        return `At ${duration}, the text was: "${text}"`;
                    }).join('\n');

                    
                    console.log('Transcript Details:', transcriptDetails);

                    // Define the prompt using the transcript details
                  
                    const transcriptContext = `Here is the transcript of the video along with timestamps: \n${transcriptDetails}. Please use this context for further conversation so that the user can ask questions related to specific timestamps or the entire transcript and adhere strictly to this context.`;
                    chrome.storage.local.set({ transcriptContext }, () => {
                      console.log('Transcript context stored:', transcriptContext);
                  });
                  
                   // localStorage.setItem('transcriptContent', transcriptContext);
                    // Send the constructed prompt message to the chatbot
                    sendMessageToChatbot(transcriptContext);

                    // Alert to inform that the transcript has been sent to the chatbot
                   // alert('Transcript sent to the chatbot successfully!');
                } else {
                    alert('No transcript found for this video. Please check the video ID.');
                }
            })
            .catch(error => {
                console.error('Error fetching transcript:', error);
                alert('Failed to fetch the transcript. Please check the video ID and try again.');
            });

        // Close the modal after fetching
        document.body.removeChild(modal);
    });
});

function extractVideoId(urlOrId) {
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = urlOrId.match(urlPattern);
  return match ? match[1] : (urlOrId.length === 11 ? urlOrId : null);
}
  
  
  
    // Get the reference to the button that will trigger the modal
    // const youtubeChatBtn = document.getElementById('youtubeChat');

    // // Event listener for youtubeChat button click
    // youtubeChatBtn.addEventListener('click', () => {
    //     // Create the modal container
    //     const modal = document.createElement('div');
    //     modal.id = 'dynamicModal';
    //     modal.style.position = 'fixed';
    //     modal.style.top = '50%';
    //     modal.style.left = '50%';
    //     modal.style.transform = 'translate(-50%, -50%)';
    //     modal.style.width = '300px';
    //     modal.style.backgroundColor = '#fff';
    //     modal.style.border = '2px solid #000319';
    //     modal.style.padding = '20px';
    //     modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    //     modal.style.zIndex = '1000';

    //     // Create the input field for the video ID
    //     const inputField = document.createElement('input');
    //     inputField.type = 'text';
    //     inputField.placeholder = 'Enter YouTube Video ID';
    //     inputField.id = 'videoIdInput';
    //     inputField.style.width = '100%';
    //     inputField.style.marginBottom = '10px';
    //     inputField.style.padding = '8px';

    //     // Create the continue button
    //     const continueBtn = document.createElement('button');
    //     continueBtn.innerText = 'Continue';
    //     continueBtn.style.backgroundColor = '#000319';
    //     continueBtn.style.color = '#fff';
    //     continueBtn.style.padding = '10px';
    //     continueBtn.style.border = 'none';
    //     continueBtn.style.cursor = 'pointer';
    //     continueBtn.style.width = '100%';

    //     // Create a close button to hide the modal
    //     const closeButton = document.createElement('span');
    //     closeButton.innerHTML = '&times;';
    //     closeButton.style.position = 'absolute';
    //     closeButton.style.top = '10px';
    //     closeButton.style.right = '10px';
    //     closeButton.style.cursor = 'pointer';
    //     closeButton.style.fontSize = '20px';
    //     closeButton.style.color = '#000';

    //     // Append the input, button, and close button to the modal
    //     modal.appendChild(closeButton);
    //     modal.appendChild(inputField);
    //     modal.appendChild(continueBtn);

    //     // Append the modal to the body
    //     document.body.appendChild(modal);

    //     // Close button functionality
    //     closeButton.addEventListener('click', () => {
    //         document.body.removeChild(modal);
    //     });

    //     // Continue button functionality
    //     continueBtn.addEventListener('click', () => {
    //         const videoId = document.getElementById('videoIdInput').value.trim();

    //         if (videoId === '') {
    //             alert('Please enter a valid YouTube Video ID.');
    //             return;
    //         }

    //         // Fetch the transcript using the provided video ID
    //         fetch(`http://localhost:3000/transcript/${videoId}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 // Check if transcript data is returned
    //                 if (Array.isArray(data) && data.length > 0) {
    //                     // Extract only the `text` property from each object in the transcript array
    //                     const transcriptText = data.map(entry => entry.text).join(' ');
                        

    //                     // Log the concatenated transcript text (optional for debugging)
    //                     console.log('Transcript Text:', transcriptText);
                      

    //                     // Define the prompt using the transcript text
    //                     const promptMessage = `Elaborate more on the ${transcriptText} and keep this as the context for further conversation so that user can aks questions related to this`;

    //                     // Send the constructed prompt message to the chatbot
    //                     sendMessageToChatbot(promptMessage);

    //                     // Alert to inform that the transcript has been sent to the chatbot
    //                     //alert('Transcript sent to the chatbot successfully!');
    //                 } else {
    //                     alert('No transcript found for this video. Please check the video ID.');
    //                 }
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching transcript:', error);
    //                 alert('Failed to fetch the transcript. Please check the video ID and try again.');
    //             });

    //         // Close the modal after fetching
    //         document.body.removeChild(modal);
    //     });
    // });










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
    "Command": 10,
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

      chatbotInput.value = "";

      // Reset the text area height to its default value
      chatbotInput.style.height = "30px";
      document.querySelector("#sendButton i.fa-paper-plane").style.display =
        "none";
      document.querySelector("#sendButton i.fa-spinner").style.display =
        "inline-block";

      const timerElement = document.getElementById("timer");
      timerElement.style.display = "block";
      startTimer(timerElement);
      sendButton.style.marginTop = "20px";

      // Send the message to the chatbot
      sendMessageToChatbot(messageText).then(() => {
        document.querySelector("#sendButton i.fa-spinner").style.display =
          "none";
        document.querySelector("#sendButton i.fa-paper-plane").style.display =
          "inline-block";
        stopTimer(timerElement);
      });
    }
  });

  let timerInterval;

  function startTimer(timerElement) {
    let startTime = Date.now();

    timerInterval = setInterval(() => {
      let elapsedTime = Date.now() - startTime;
      let seconds = Math.floor(elapsedTime / 1000);
      let milliseconds = Math.floor((elapsedTime % 1000) / 100);

      timerElement.textContent = `${seconds}.${milliseconds}s`;
    }, 100);
  }

  // Function to stop the timer once the response is received
  function stopTimer(timerElement) {
    clearInterval(timerInterval);
    timerElement.style.display = "none";
  }

  async function getSessionTokenFromStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["sessionToken"], (result) => {
        resolve(result.sessionToken || null);
      });
    });
  }

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
      webpageOptionsPopup.style.display = "none";
    });

  // Show the popup with the searchBox click event
  searchBox.addEventListener("click", () => {
    webpageOptionsPopup.style.display = "flex";
  });

  // Event listener for the 'Chat with Chatbot' button
  chatWithChatbotButton1.addEventListener("click", () => {
    chatbotContainer.style.display = "block";
    searchBox.style.display = "none";
  });

  // Event listener for the 'Chat with Webpage' button
  chatWithWebpageButton1.addEventListener("click", () => {
    chatbotContainer.style.display = "block";
    searchBox.style.display = "block";
  });

  // Event listener for the 'Fetch Content' button
  fetchContentButton.addEventListener("click", () => {
    const url = urlInput.value.trim();
    if (url) {
      console.log("Webpage URL:", url);

      // Fetch markdown from the URL
      fetchMarkdownFromUrl(url);

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
      handleSignIn();
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

  let lastResponse = "";

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

  let conversationHistory = [];

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
      const transcriptContext = await getTranscriptContext();
      const aiengine = currentModel;

      let conversation = [];


      
  
    

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
            conversationHistory.push(
              { role: "system", content: `You are assisting with the following webpage content: ${markdownContent}` },
              { role: "user", content: "What are the examples mentioned on the page or give the page summary?" }
            );
          } else {
            console.log("Failed to fetch markdown content.");
            conversation = [{ role: "user", content: messageText }];
          }
        } else {
          console.log("No URL provided for markdown conversion.");
          conversation = [{ role: "user", content: messageText }];
        }
      } else {
        if (transcriptContext) {
          conversation = [{ role: "system", content: transcriptContext }].concat(
            conversationHistory,
            { role: "user", content: messageText }
          );
  
          // Push system message to history only if context exists
          conversationHistory.push({ role: "system", content: transcriptContext });
      } else {
        // Default chatbot conversation
        conversation = conversationHistory.concat({ role: "user", content: messageText });
      }
    }

      conversationHistory.push({ role: "user", content: messageText });

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
      conversationHistory.push({ role: "assistant", content: formattedResponse });
      displayMessage("assistant", formattedResponse || "No content");

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

  

  async function getTranscriptContext() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("transcriptContext", (result) => {
        if (result.transcriptContext) {
          console.log("Transcript Context Retrieved:", result.transcriptContext);
          resolve(result.transcriptContext); // Return the stored transcript context
        } else {
          console.log("No Transcript Context Found.");
          resolve(""); // Return empty if not found
        }
      });
    });
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

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "sendSearchValue") {
      const searchValue = request.searchValue;
      console.log("Received Search Value from Background:", searchValue);

      // Call the sendMessageToChatbot function with the search value
      if (searchValue) {
        sendMessageToChatbot(searchValue);
      }
    }
  });

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

    setTimeout(() => {
      chatbotMessages.appendChild(loadingDiv);

      requestAnimationFrame(() => {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      });
    }, 2000);
  }

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
