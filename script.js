import { handleAudioUpload } from "./modules/audioUpload.js";
import { handleItemContextMenu } from "./modules/contextMenu.js";
import { handleEditModeButtonClick, handleSettingsButtonClick, handleSettingsCloseButtonClick, handleAddItemsButtonClick, handleAddItemsCloseButtonClick, handleSaveButtonClick, handleSaveCloseButtonClick, addTagOrSetting } from "./modules/editMode.js";
import { handleSingleImageUpload, handleChangeImageUpload, handleImageUpload } from "./modules/imageUpload.js";
import { handleButtonClick, handleDescriptionInput, handleDescriptionKeyDown, handleTitleInput, handleTitleKeyDown, btnOffHandler, btnOnHandler, btnBlackHandler, btnWhiteHandler } from "./modules/tooltip.js";
import { playSound, pauseSound, hideScreen, handleDownScaling, handleUpScaling, handleElementClick, addItemOnScreen, disallowDelete } from "./modules/utils.js";

// ------------------ //
//  HELPER FUNCTIONS  //
// ------------------ //
// const handleClickWithThrottle = (card, i) => {
//   const now = Date.now();
//   const timeSinceLastClick = now - lastClickTime;

//   // Only trigger the event if enough time has passed since the last click
//   if (timeSinceLastClick > 1500) {
//     // Adjust the delay (300ms) as needed
//     handleClick(card, i);
//     lastClickTime = now;
//   }
// };
// Global variables
let cardsState = [];

// const handleClick = (card, j) => {
//   // Same card || already matched card || game finished
//   if (flippedCard1 === j || cardsDistribution[j] === null || !allowClick) return;

//   pauseSound(correctSound);
//   pauseSound(flipSound);
//   pauseSound(wrongFlipSound);

//   // Flip card
//   card.style.cursor = "not-allowed";

//   // Animate the decrease in opacity of the card back
//   for (let i = 0; i < 25; i++) {
//     setTimeout(() => {
//       card.style.opacity = 1 - i / 25;
//     }, i * 10);
//   }

//   // No card has been flipped yet
//   if (flippedCard1 === null) flippedCard1 = j;
//   // A card has been flipped
//   else if (flippedCard2 === null) flippedCard2 = j;

//   // Play the flip sound for only the flip of the first card in a pair
//   if (flippedCard1 !== null && flippedCard2 === null) flipSound.play();

//   // Check if both are the same
//   if (flippedCard1 !== null && flippedCard2 !== null) {
//     // Play flip sound if the cards are not the same before the delay
//     if (cardsDistribution[flippedCard1] !== cardsDistribution[flippedCard2]) flipSound.play();

//     // Correct
//     if (cardsDistribution[flippedCard1] === cardsDistribution[flippedCard2]) {
//       matches += 1;
//       (cardsDistribution[flippedCard1] = null), (cardsDistribution[flippedCard2] = null);

//       if (matches !== 4) correctSound.play();
//       else {
//         winSound.play();
//         allowClick = false;
//         btn.style.display = "none";

//         for (let i = 0; i < cards.length; i++) {
//           cards[i].style.cursor = cardFronts[i].style.cursor = "default";
//         }

//         return;
//       }

//       (flippedCard1 = null), (flippedCard2 = null);
//     }

//     // Incorrect: Re-flip the cards
//     else {
//       setTimeout(() => {
//         if (flippedCard1 === null || flippedCard2 === null) return;

//         // Animate the increase in opacity of the card back
//         for (let i = 0; i < 25; i++) {
//           setTimeout(() => {
//             cards[flippedCard1].style.opacity = cards[flippedCard2].style.opacity = i / 25;

//             if (i === 24) {
//               (flippedCard1 = null), (flippedCard2 = null);
//             }
//           }, i * 10);
//         }

//         wrongFlipSound.play();
//       }, [1000]);

//       for (let i = 0; i < cards.length; i++) {
//         cards[i].style.cursor = "pointer";
//       }
//     }
//   }
// };

// const handlebtnClick = () => {
//   if (!allowClick || btnClicked) return;

//   pauseSound(clickSound);
//   clickSound.play();

//   isPlaying = !isPlaying;

//   if (!isPlaying) {
//     btn.src = "assets/close.webp";
//     infoScreen.style.display = "block";
//     infoScreen.style.zIndex = 20;

//     btnClicked = true;
//     btn.style.opacity = 0.5;
//     btn.style.cursor = "not-allowed";
//     btn.style.transform = "scale(1)";
//     btn.style.left = btn.style.top = "95px";

//     title.style.display = "block";
//     description.style.display = "block";

//     setTimeout(() => {
//       btnClicked = false;
//       btn.style.opacity = 1;
//       btn.style.cursor = "pointer";
//     }, 1000);
//   } else {
//     btn.src = `assets/${instructionsIcon}`;
//     btn.style.left = btn.style.top = "50px";

//     infoScreen.style.display = "none";
//     infoScreen.style.zIndex = 0;

//     title.style.display = "none";
//     description.style.display = "none";
//   }
// };
// ----------- //
//  SAVE GAME  //
// ----------- //
const toggleSaveChangesBtn = (isDisabled = false, cursorType = "pointer", opacity = 1) => {
  saveChangesBtn.disabled = isDisabled;
  saveChangesBtn.style.cursor = cursorType;
  saveChangesBtn.style.opacity = opacity;
};

const saveGame = (e, type) => {
  if (e) e.preventDefault();

  // Disable the save changes button
  if (type === "game data") toggleSaveChangesBtn(true, "not-allowed", 0.7);

  // Generic Elements
  gameData = {
    tooltip: {
      title: title.innerText,
      description: description.innerText,
      btnX: btnLastX.value,
      btnY: btnLastY.value,
      showTooltip: showTooltip.value,
      btnScale: lastScales[0],
    },

    elements: [],

    // Unique Elements
    uncommon: {
      remainingItems,
      delItemCount,
    },

    base64Strings: [bgImg.src, btn.src, collectSound.src, winSound.src, wrongSound.src, clickSound.src, deleteSound.src],
  };

  // Item Divs
  for (let i = 1; i < items.length; i++) {
    gameData.elements.push({
      x: itemDivs[i].style.left,
      y: itemDivs[i].style.top,
      scale: lastScales[i],
      width: items[i].offsetWidth,
      height: items[i].offsetHeight,
    });

    gameData.base64Strings.push(items[i].src);
  }

  window.parent.postMessage({ type, gameData, gameId: urlParams.get("gameid"), url: window.location.origin }, parentUrl);
  if (type === "game data") areChangesSaved.value = true;
};

const initializeGame = (recievedData) => {
  // Check if the game has been saved before
  if (!recievedData) return;

  // Background
  if (recievedData.assetUrls && recievedData.assetUrls.length > 0) {
    background.src = bgImg.src = recievedData.assetUrls[0];
    btn.src = btnSrc.value = recievedData.assetUrls[1];

    collectSound.src = recievedData.assetUrls[2];
    winSound.src = recievedData.assetUrls[3];
    wrongSound.src = recievedData.assetUrls[4];
    clickSound.src = recievedData.assetUrls[5];
    deleteSound.src = recievedData.assetUrls[6];
  }

  // Game Tooltip
  if (recievedData.tootlip) {
    title.innerText = recievedData.tooltip.title;
    description.innerText = recievedData.tooltip.description;

    btnLastX.value = recievedData.tooltip.btnX;
    btnLastY.value = recievedData.tooltip.btnY;

    btnDiv.style.left = `${btnLastX.value}px`;
    btnDiv.style.top = `${btnLastY.value}px`;

    lastScales[0] = recievedData.tooltip.btnScale;
    btnDiv.style.transform = `scale(${lastScales[0]})`;

    showTooltip.value = recievedData.tooltip.showTooltip;
    if (!showTooltip.value) btnOffHandler({ showTooltip, btnOff, btnOn, btnDiv, resizeBoxes });
  }

  // Elements
  if (recievedData.elements.length > 0) {
    for (let i = 1; i < items.length; i++) {
      // URL
      items[i].src = recievedData.assetUrls[i + 6];

      // Position
      itemDivs[i].style.left = recievedData.elements[i - 1].x;
      itemDivs[i].style.top = recievedData.elements[i - 1].y;

      // Dimensions
      items[i].width = recievedData.elements[i - 1].width;
      items[i].height = recievedData.elements[i - 1].height;

      // Scale
      lastScales[i] = recievedData.elements[i - 1].scale;
      itemDivs[i].style.transform = `scale(${lastScales[i]})`;
    }

    // Now, we have to create all the elements that were added to the game through game UI
    for (let i = items.length; i <= recievedData.elements.length; i++) {
      const theImg = new Image();

      // Give the image an src, width & height when it is loaded
      theImg.onload = () => {
        theImg.style.width = recievedData.elements[i - 1].width;
        theImg.style.height = recievedData.elements[i - 1].height;

        theImg.style.left = recievedData.elements[i - 1].x;
        theImg.style.top = recievedData.elements[i - 1].y;

        handleAddItems(theImg, recievedData.elements[i - 1].scale);

        // Hide the new resize boxes
        for (let j = resizeBoxes.length - 4; j < resizeBoxes.length; j++) {
          resizeBoxes[j].style.visibility = "hidden";
          resizeBoxes[j].style.visibility = "hidden";
          resizeBoxes[j].style.visibility = "hidden";
          resizeBoxes[j].style.visibility = "hidden";
        }

        // Hide the new border
        items[items.length - 1].style.border = "1px solid transparent";
        items[items.length - 1].style.cursor = "default";
      };

      theImg.src = recievedData.assetUrls[i + 6];
    }
  }

  // Set the unique elements
  if (recievedData.uncommon) {
    remainingItems = recievedData.uncommon.remainingItems;
    delItemCount = recievedData.uncommon.delItemCount;
  }

  itemsLeftNumber.innerHTML = remainingItems;
};

// Audios
const correctSound = document.getElementById("correctSound");
const flipSound = document.getElementById("flipSound");
const wrongFlipSound = document.getElementById("wrongFlipSound");

// Information Screen
const infoScreen = document.getElementById("infoScreen");

// General
let matches = 0;
let lastClickTime = 0;
let flippedCard1 = null;
let flippedCard2 = null;
let isPlaying = true;
let allowClick = true;
let btnClicked = false;

const cardBackUrl = "./assets/cardBack.webp";
const allTypes = ["spade", "diamond", "clover", "heart", "star"]; // Add more if needed

const urlParams = new URLSearchParams(window.location.search);
const snapshot = urlParams.get("snapshot");
let cardBackImgUrl = "./assets/cardBack.webp"; // Fallback image path

const cardFront1Url = urlParams.get("cardfront1");
const cardFront2Url = urlParams.get("cardfront2");
const cardFront3Url = urlParams.get("cardfront3");
const cardFront4Url = urlParams.get("cardfront4");

const cardImageMap = {
  spade: cardFront1Url,
  clover: cardFront2Url,
  heart: cardFront3Url,
  diamond: cardFront4Url,
};
let cardFaceMap = {};

const options = document.querySelectorAll(".pair-option");

options.forEach((option) => {
  option.addEventListener("click", async () => {
    // UI feedback
    options.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");

    const selectedValue = option.getAttribute("data-value");
    const numPairs = parseInt(selectedValue);
    const totalCards = numPairs * 2;
    let allPositions;

    try {
      const res = await fetch("position.json");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      allPositions = await res.json();
      console.log("JSON Loaded:", allPositions);
    } catch (err) {
      console.error("Fetch error:", err);
      return;
    }

    const positions = allPositions[numPairs];
    const selectedTypes = allTypes.slice(0, numPairs);
    let cardsDistribution = [...selectedTypes, ...selectedTypes];
    shuffle(cardsDistribution);

    const gameBoard = document.getElementById("gameBoard");
    gameBoard.innerHTML = ""; // Clear previous

    let cards = [];
    let cardFronts = [];

    for (let i = 0; i < totalCards; i++) {
      const cardContainer = document.createElement("img");

      // ✅ Ensure cardBackImgUrl is defined globally or before this block
      cardContainer.src = cardBackImgUrl;
      cardContainer.dataset.backImage = cardBackImgUrl;

      // Type/index for matching logic
      cardContainer.dataset.type = cardsDistribution[i];
      cardContainer.dataset.index = i;

      // Position cards based on JSON layout
      cardContainer.style.position = "absolute";
      cardContainer.style.top = positions[i].top;
      cardContainer.style.left = positions[i].left;

      // Set size based on pair count
      if (numPairs === 2) {
        cardContainer.style.width = "140px";
        cardContainer.style.height = "250px";
      } else if (numPairs === 3) {
        cardContainer.style.width = "120px";
        cardContainer.style.height = "200px";
      } else {
        cardContainer.style.width = "100px";
        cardContainer.style.height = "180px";
      }

      cardContainer.style.cursor = "pointer";

      // Click logic
      cardContainer.addEventListener("click", () => {
        const index = parseInt(cardContainer.dataset.index);
        if (flippedCard1 === null && flippedCard2 === null) {
          handleClick(cardContainer, index);
        } else {
          handleClickWithThrottle(cardContainer, index);
        }
      });

      cards.push(cardContainer);
      cardFronts.push(getCardFront(cardsDistribution[i]));

      gameBoard.appendChild(cardContainer);
    }

    // ✅ Store state for flip logic
    cardsState = new Array(totalCards).fill(false);
    cardFaceMap = {};
    selectedTypes.forEach((type) => {
      cardFaceMap[type] = getCardFront(type);
    });

    window.firstPairType = selectedTypes[0];

    // Optional: Render face card options in UI
    renderFaceCardSelector(Object.keys(cardFaceMap));
  });
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getCardFront(type) {
  if (cardImageMap[type]) return `assets/${cardImageMap[type]}`;
  return `assets/${type}.webp`;
}

// Example handleClick and handleClickWithThrottle
function handleClick(card, index) {
  if (!allowClick || cardsState[index]) return;

  card.src = card.dataset.faceImage || getCardFront(card.dataset.type);
  cardsState[index] = true;

  if (!flippedCard1) {
    flippedCard1 = { card, index };
  } else {
    flippedCard2 = { card, index };
    checkMatch();
  }
}

function handleClickWithThrottle(card, index) {
  const now = Date.now();
  if (now - lastClickTime < 800) return;
  lastClickTime = now;
  handleClick(card, index);
}

function checkMatch() {
  if (!flippedCard1 || !flippedCard2) return;

  const isMatch = flippedCard1.card.dataset.type === flippedCard2.card.dataset.type;

  if (isMatch) {
    matches++;
    resetFlippedCards();
  } else {
    setTimeout(() => {
      flippedCard1.card.src = flippedCard1.card.dataset.backImage;
      flippedCard2.card.src = flippedCard2.card.dataset.backImage;
      cardsState[flippedCard1.index] = false;
      cardsState[flippedCard2.index] = false;
      resetFlippedCards();
    }, 800);
  }
}

function resetFlippedCards() {
  flippedCard1 = null;
  flippedCard2 = null;
}

const cardBackImgElement = document.getElementById("cardBackImage");
const cardBackImgInput = document.getElementById("cardBackImgInput");

cardBackImgInput.addEventListener("change", (e) => {
  if (areChangesSaved.value) {
    window.parent.postMessage(
      {
        type: "unsaved changes",
        gameId: urlParams.get("gameid"),
        url: window.location.origin,
      },
      parentUrl
    );

    areChangesSaved.value = false;
    toggleSaveChangesBtn();
  }

  // Upload preview and store to <img id="cardBackImage">
  handleSingleImageUpload(e, {
    targetImg: cardBackImgElement,
    newImg: cardBackImgElement,
  });

  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const newBackSrc = reader.result;

    // Update the card back preview
    cardBackImgElement.src = newBackSrc;

    // Update the image URL for use when generating cards
    cardBackImgUrl = newBackSrc;
    document.getElementById("cardBackPreview").src = newBackSrc;

    // Update all unflipped cards on the board
    document.querySelectorAll("img[data-flipped='false']").forEach((card) => {
      card.dataset.backImage = newBackSrc;
      card.src = newBackSrc;
    });
  };
  reader.readAsDataURL(file);
  document.querySelector(".pair-option.selected")?.click();
});

async function loadInitialGridCards() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  const numPairs = 2;
  const totalCards = numPairs * 2;

  let allPositions;
  try {
    const res = await fetch("position.json");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    allPositions = await res.json();
  } catch (err) {
    console.error("Failed to load positions:", err);
    return;
  }

  const positions = allPositions[numPairs];
  const selectedTypes = allTypes.slice(0, numPairs);
  let cardsDistribution = [...selectedTypes, ...selectedTypes];
  shuffle(cardsDistribution);

  let cards = [];
  let cardFrontUrls = [];

  for (let i = 0; i < totalCards; i++) {
    const type = cardsDistribution[i];
    const card = document.createElement("img");

    // Assign dataset values
    card.dataset.type = type;
    card.dataset.index = i;
    card.dataset.faceImage = getCardFront(type);
    card.dataset.backImage = cardBackUrl; // Make sure cardBackUrl is correctly assigned earlier
    card.dataset.flipped = "false";

    // Set the initial image source to the card back
    card.src = card.dataset.backImage;

    // Set card position and size
    card.style.position = "absolute";
    card.style.top = positions[i].top;
    card.style.left = positions[i].left;
    card.style.width = "140px";
    card.style.height = "250px";
    card.style.cursor = "pointer";

    // Add click event
    card.addEventListener("click", () => {
      const index = parseInt(card.dataset.index);
      if (flippedCard1 === null && flippedCard2 === null) {
        handleClick(card, index);
      } else {
        handleClickWithThrottle(card, index);
      }
    });

    // Add card to board and tracking arrays
    gameBoard.appendChild(card);
    cards.push(card);
    cardFrontUrls.push(getCardFront(type)); // This is used if you want to access front images later
  }

  // Save custom faces for editing
  cardFaceMap = {};
  selectedTypes.forEach((type, i) => {
    cardFaceMap[type] = getCardFront(type);
  });
  window.firstPairType = selectedTypes[0];
  cardsState = new Array(totalCards).fill(false);
  renderFaceCardSelector(Object.keys(cardFaceMap));
}

window.addEventListener("DOMContentLoaded", () => {
  loadInitialGridCards();
});

function renderFaceCardSelector(types) {
  const container = document.getElementById("faceCardSelector");
  container.innerHTML = "";

  types.forEach((type) => {
    const card = document.createElement("div");
    card.classList.add("face-card-thumbnail");
    card.dataset.cardType = type;
    card.style.cursor = "pointer";
    card.style.border = "2px solid transparent";
    card.style.padding = "5px";
    card.style.transition = "all 0.3s";

    const img = document.createElement("img");
    img.src = cardFaceMap[type] || getCardFront(type);
    img.style.width = "80px";
    img.style.height = "120px";
    img.style.borderRadius = "8px";
    img.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";

    card.appendChild(img);
    container.appendChild(card);

    card.addEventListener("click", () => {
      // Highlight the selected
      container.querySelectorAll(".face-card-thumbnail").forEach((c) => (c.style.border = "2px solid transparent"));
      card.style.border = "2px solid #007BFF";

      selectedCardType = type;
      document.getElementById("selectedFaceImagePreview").src = img.src;
    });
  });

  // Default select the first
  if (types.length > 0) {
    container.querySelector(".face-card-thumbnail").click();
  }
}

let selectedCardType = null;

document.getElementById("cardFaceImgInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file || !selectedCardType) return;

  const reader = new FileReader();
  reader.onload = () => {
    const newSrc = reader.result;
    document.getElementById("selectedFaceImagePreview").src = newSrc;

    // Update all cards of selected type
    document.querySelectorAll(`img[data-type='${selectedCardType}']`).forEach((card) => {
      card.dataset.faceImage = newSrc;

      if (cardsState?.[parseInt(card.dataset.index)]) {
        card.src = newSrc;
      }
    });

    cardFaceMap[selectedCardType] = newSrc;

    // Update the selector thumbnail as well
    renderFaceCardSelector(Object.keys(cardFaceMap));
  };
  reader.readAsDataURL(file);
});

// --------- //
//  GENERAL  //
// --------- //
let currSelectedElement = { value: null };
let gameWon = false;

// Elements
let items = [document.getElementById("btn")];
let itemDivs = [document.getElementById("btnDiv")];
let resizeBoxes = [];
let isItemCollected = [];

let remainingItems = 4;
let delItemCount = 0;

let lastScales = [1.0, 1.0, 1.0, 1.0, 1.0];
// --------- //
//  TOOLTIP  //
// --------- //
let isTooltipOpen = { value: false };
let btnLastX = { value: 50 };
let btnLastY = { value: 50 };
let showTooltip = { value: true };
let btnSrc = { value: "assets/infoDark.webp" };

const gameTooltip = document.getElementById("gameTooltip");

const btnDiv = document.getElementById("btnDiv");
const btn = document.getElementById("btn");

const btnOn = document.getElementById("btnOn");
const btnOff = document.getElementById("btnOff");

const btnWhite = document.getElementById("btnWhite");
const btnBlack = document.getElementById("btnBlack");

// ----------- //
//  EDIT MODE  //
// ----------- //
let isEditing = { value: false };
let btnClicks = { value: 1 };
let editModeBtns = [];

const editModeBtn = document.getElementById("editModeBtn");

const refreshBtn = document.getElementById("refreshBtn");

const binTooltip = document.getElementById("binTooltip");
const binTooltipRectangle = document.getElementById("binTooltipRectangle");

// --------------- //
//  GAME SETTINGS  //
// --------------- //
const settingsBtn = document.getElementById("settingsBtn");
const settingsCloseBtn = document.getElementById("settingsCloseBtn");
const settingsScreen = document.getElementById("settingsScreen");

const bgImg = document.getElementById("bgImage");
const bgImgInput = document.getElementById("bgImgInput");

const cardBackImg = document.getElementById("cardBackImage");

const cardFaceImgInput = document.getElementById("cardFaceImgInput");
const cardFaceImg = document.getElementById("cardFaceImage");

// ---------------- //
//  ITEMS ADDITION  //
// ---------------- //
let isAddingItems = { value: false };
const addItemBtn = document.getElementById("addItemBtn");

const itemsAdditionCloseBtn = document.getElementById("itemsAdditionCloseBtn");
const itemsAdditionScreen = document.getElementById("itemsAddition");

const addableImg = document.getElementById("addableImg");
const addableImgInput = document.getElementById("addableImgInput");

// -------------- //
//  CONTEXT MENU  //
// -------------- //
let currentItemCM = null;

const contextMenu = document.getElementById("contextMenu");
const changeImageBtn = document.getElementById("changeImage");
const changeImageInput = document.getElementById("changeImageInput");

// -------- //
//  AUDIOS  //
// -------- //
let audioInputs = [];
let audioElements = [];
let playableAudios = [];

const collectSound = document.getElementById("collectSound");
const winSound = document.getElementById("winSound");
const wrongSound = document.getElementById("wrongSound");
const clickSound = document.getElementById("clickSound");
const deleteSound = document.getElementById("deleteSound");

// ----------- //
//  SAVE GAME  //
// ----------- //
let areChangesSaved = { value: true };

let gameData = {};

let tags = [];
let configurableSettings = [];

const saveBtn = document.getElementById("saveBtn");
const saveChangesBtn = document.getElementById("saveChangesBtn");
const saveGameBtn = document.getElementById("saveGameBtn");
const saveScreen = document.getElementById("saveScreen");
const saveCloseBtn = document.getElementById("saveCloseBtn");

const addTagBtn = document.getElementById("addTagBtn");
const tagInput = document.getElementById("tagsInput");
const tagsDiv = document.getElementById("tags");

const addSettingBtn = document.getElementById("addSettingBtn");
const settingInput = document.getElementById("settingsInput");
const settingsDiv = document.getElementById("configSettings");

if (snapshot !== "true" && snapshot !== true) {
  // ------------------- //
  //  DOCUMENT ELEMENTS  //
  // ------------------- //

  // Audios
  playableAudios.push(clickSound);
  playableAudios.push(collectSound);
  playableAudios.push(winSound);
  playableAudios.push(deleteSound);

  for (let i = 1; i <= 5; i++) {
    audioInputs.push(document.getElementById(`audioInput${i}`));
    audioElements.push(document.getElementById(`audioElement${i}`));
  }

  // Edit Mode
  let cursorType = { value: "default" };

  editModeBtns.push(settingsBtn);
  editModeBtns.push(saveBtn);

  // editModeBtn.addEventListener("click", () => handleEditModeButtonClick({ clickSound, isEditing, items, resizeBoxes, showTooltip, isTooltipOpen, btnDiv, editModeBtns, currSelectedElement, settingsScreen, btnClicks, binTooltip, binTooltipRectangle }));

  editModeBtn.addEventListener("click", () => {
    binTooltip.style.display = "none";
    handleEditModeButtonClick({ game: "wrh", cursorType, clickSound, isEditing, items, resizeBoxes, isItemCollected, remainingItems, showTooltip, isTooltipOpen, btnDiv, editModeBtns, currSelectedElement, settingsScreen, btnClicks, binTooltip, binTooltipRectangle, refreshBtn });
  });

  refreshBtn.addEventListener("click", () => {
    const itemsLeftNumber = document.getElementById("itemsLeftNumber");

    remainingItems = items.length - 1 - delItemCount;
    itemsLeftNumber.innerHTML = remainingItems;

    // Make all items visible again
    for (let i = 1; i < items.length; i++) {
      items[i].style.opacity = 1;
      items[i].style.display = "block";
    }
    if (isItemCollected) {
      // Reset collection state of all items
      for (let i = 1; i < items.length; i++) {
        isItemCollected[i] = false;
      }
    }
  });

  // Game Settings
  bgImgInput.addEventListener("change", (e) => {
    if (areChangesSaved.value) {
      window.parent.postMessage({ type: "unsaved changes", gameId: urlParams.get("gameid"), url: window.location.origin }, parentUrl);
      areChangesSaved.value = false;
      toggleSaveChangesBtn();
    }

    handleSingleImageUpload(e, { targetImg: background, newImg: bgImg });
  });

  cardFaceImgInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newFaceSrc = reader.result;
      cardFaceImg.src = newFaceSrc;

      // Find the first card in the grid to get its type
      const firstCard = document.querySelector(".memory-card, img[data-type]");
      if (!firstCard) return;

      const targetType = firstCard.dataset.type;

      // Update all matching cards
      document.querySelectorAll(`[data-type='${targetType}']`).forEach((card) => {
        card.dataset.faceImage = newFaceSrc;
        if (cardsState[parseInt(card.dataset.index)]) {
          card.src = newFaceSrc; // if already flipped, reflect update
        }
      });

      // Optional: store for future use
      cardFaceMap[targetType] = newFaceSrc;
    };

    reader.readAsDataURL(file);
  });
  settingsBtn.addEventListener("click", () => handleSettingsButtonClick({ cleanUp: false, clickSound, settingsScreen, saveScreen }));
  settingsCloseBtn.addEventListener("click", () => handleSettingsCloseButtonClick({ clickSound, settingsScreen }));

  // Button
  btn.addEventListener("click", () => handleButtonClick({ clickSound, isTooltipOpen, btn, btnDiv, btnLastX, btnLastY, gameTooltip, title, description, isEditing, lastScales, btnSrc }));

  // Mouse enter
  btn.addEventListener("mouseenter", () => {
    if (isEditing.value) return;

    // Scale up the image
    btn.style.transition = "transform 0.3s ease-in-out";
    btn.style.transform = "scale(1.1)";
  });

  // Mouse leave
  btn.addEventListener("mouseleave", () => {
    if (isEditing.value) return;

    // Scale down the image
    btn.style.transform = "scale(1)";
  });

  // Game Tooltip
  btnOn.addEventListener("click", () => {
    if (areChangesSaved.value) {
      window.parent.postMessage({ type: "unsaved changes", gameId: urlParams.get("gameid"), url: window.location.origin }, parentUrl);
      areChangesSaved.value = false;
      toggleSaveChangesBtn();
    }

    btnOnHandler({ showTooltip, btnOn, btnOff, btnDiv, resizeBoxes });
  });

  btnOff.addEventListener("click", () => {
    if (areChangesSaved.value) {
      window.parent.postMessage({ type: "unsaved changes", gameId: urlParams.get("gameid"), url: window.location.origin }, parentUrl);
      areChangesSaved.value = false;
      toggleSaveChangesBtn();
    }

    btnOffHandler({ showTooltip, btnOff, btnOn, btnDiv, resizeBoxes });
  });

  btnBlack.addEventListener("click", () => {
    if (areChangesSaved.value) {
      window.parent.postMessage({ type: "unsaved changes", gameId: urlParams.get("gameid"), url: window.location.origin }, parentUrl);
      areChangesSaved.value = false;
      toggleSaveChangesBtn();
    }

    btnBlackHandler({ btnWhite, btnBlack, btnSrc, btn });
  });

  btnWhite.addEventListener("click", () => {
    if (areChangesSaved.value) {
      window.parent.postMessage({ type: "unsaved changes", gameId: urlParams.get("gameid"), url: window.location.origin }, parentUrl);
      areChangesSaved.value = false;
      toggleSaveChangesBtn();
    }

    btnWhiteHandler({ btnWhite, btnBlack, btnSrc, btn });
  });

  // Audio Upload
  for (let i = 0; i < 4; i++) {
    audioInputs[i].addEventListener("change", (e) => {
      if (areChangesSaved.value) {
        window.parent.postMessage({ type: "unsaved changes", gameId: urlParams.get("gameid"), url: window.location.origin }, parentUrl);
        areChangesSaved.value = false;
        toggleSaveChangesBtn();
      }

      handleAudioUpload(e, { audioElement: audioElements[i], playableAudio: playableAudios[i] });
    });
  }

  let tooltipTimeout; // Variable to store timeout reference

  // Mouse enter
  editModeBtn.addEventListener("mouseenter", () => handleUpScaling(editModeBtn));
  settingsBtn.addEventListener("mouseenter", () => handleUpScaling(settingsBtn));
  saveBtn.addEventListener("mouseenter", () => handleUpScaling(saveBtn));

  refreshBtn.addEventListener("mouseenter", () => handleUpScaling(refreshBtn));

  // Mouse leave
  editModeBtn.addEventListener("mouseleave", () => handleDownScaling(editModeBtn));
  settingsBtn.addEventListener("mouseleave", () => handleDownScaling(settingsBtn));
  saveBtn.addEventListener("mouseleave", () => handleDownScaling(saveBtn));

  refreshBtn.addEventListener("mouseleave", () => handleDownScaling(refreshBtn));

  // Context Menu
  for (let i = 1; i < items.length; i++) {
    items[i].addEventListener("contextmenu", (e) => {
      currentItemCM = i;
      handleItemContextMenu(e, { isEditing, contextMenu, changeImageBtn });
    });
  }

  changeImageInput.addEventListener("change", (e) => handleChangeImageUpload(e, items[currentItemCM]));

  document.addEventListener("click", function () {
    contextMenu.style.display = "none";
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.body.style.userSelect = "none"; // Disable selection for the whole document
  });

  changeImageBtn.addEventListener("click", () => changeImageInput.click());

  // Game Tooltip
  title.addEventListener("input", () => {
    if (areChangesSaved.value) {
      window.parent.postMessage({ type: "unsaved changes", gameId: urlParams.get("gameid"), url: window.location.origin }, parentUrl);
      areChangesSaved.value = false;
      toggleSaveChangesBtn();
    }

    handleTitleInput();
  });

  title.addEventListener("keydown", (e) => handleTitleKeyDown(e));

  description.addEventListener("input", () => {
    if (areChangesSaved.value) {
      window.parent.postMessage({ type: "unsaved changes", gameId: urlParams.get("gameid"), url: window.location.origin }, parentUrl);
      areChangesSaved.value = false;
      toggleSaveChangesBtn();
    }

    handleDescriptionInput;
  });

  description.addEventListener("keydown", (e) => handleDescriptionKeyDown(e));

  // Save Game
  saveBtn.addEventListener("click", () => handleSaveButtonClick({ isAddingItems, itemsAdditionScreen, cleanUp: false, clickSound, settingsScreen, saveScreen }));
  saveChangesBtn.addEventListener("click", (e) => saveGame(e, "game data"));

  saveCloseBtn.addEventListener("click", () => handleSaveCloseButtonClick({ clickSound, saveScreen }));
  saveGameBtn.addEventListener("click", (e) => saveGame(e, "game data"));

  addTagBtn.addEventListener("click", () => addTagOrSetting({ targetDiv: tagsDiv, targetInput: tagInput, arr: tags }));
  addSettingBtn.addEventListener("click", () => addTagOrSetting({ targetDiv: settingsDiv, targetInput: settingInput, arr: configurableSettings }));

  window.addEventListener("message", function (event) {
    // Always check the origin of the message for security purposes
    if (event.origin === parentUrl) {
      if (event.data.type === "game data") {
        initializeGame(event.data.gameData);
      } else if (event.data.type === "game data request") {
        saveGame(null, "game data request");
      } else if (event.data.type === "enable button") {
        areChangesSaved.value = false;
        toggleSaveChangesBtn();
      }
    } else {
      console.error("Untrusted origin:", event.origin);
    }
  });

  // Initialize the game
  // initializeGame();

  if (urlParams.get("isediting") === "true") {
    editModeBtn.click();
  }

  // Hide the edit mode button if the game is not being edited
  if (urlParams.get("isediting") === "false") editModeBtn.style.display = "none";
  else saveBtn.style.left = saveBtn.style.top = "-1000px";
}
