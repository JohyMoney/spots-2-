import "./index.css";
import { disablebutton, resetValidation, settings } from "../scripts/validation.js";
import Api from "../utils/api.js";
import { setbuttonText } from "../utils/helpers.js";
import defaultAvatar from "../images/avatar.jpg";
import fallbackCardImage from "../images/1-photo-by-moritz-feldmann-from-pexels.jpg";
import valThorensImage from "../images/1-photo-by-moritz-feldmann-from-pexels.jpg";
import restaurantTerraceImage from "../images/2-photo-by-ceiline-from-pexels.jpg";
import outdoorCafeImage from "../images/3-photo-by-tubanur-dogan-from-pexels.jpg";
import bridgeOverForestImage from "../images/4-photo-by-maurice-laschet-from-pexels.jpg";
import tunnelLightImage from "../images/5-photo-by-van-anh-nguyen-from-pexels.jpg";
import mountainHouseImage from "../images/6-photo-by-moritz-feldmann-from-pexels.jpg";

const profileDisplayName = "Bessie Coleman";
const profileDisplayDescription = "Civil Aviator";

const localCardImages = {
  "Val Thorens": valThorensImage,
  "Restaurant terrace": restaurantTerraceImage,
  "An outdoor cafe": outdoorCafeImage,
  "A very long bridge, over the forest and through the trees": bridgeOverForestImage,
  "Tunnel with morning light": tunnelLightImage,
  "Mountain house": mountainHouseImage
};

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
    isLiked: false
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
    isLiked: false
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
    isLiked: false
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
    isLiked: false
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
    isLiked: false
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
    isLiked: false
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
    isLiked: false
  }
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "827c1060-a8a1-45e4-bf30-fb285779703f",
    "Content-Type": "application/json"
  }
});

const editProfileModal = document.querySelector("#edit-profile-modal");
const addCardModal = document.querySelector("#new-post-modal");
const previewModal = document.querySelector("#preview-modal");
const avatarModal = document.querySelector("#avatar-modal");
const deleteModal = document.querySelector("#delete-modal");

const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const newPostBtn = document.querySelector(".profile__add-btn");
const editProfileBtn = document.querySelector(".profile__edit-btn");

const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const addCardCloseBtn = addCardModal.querySelector(".modal__close-btn");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteConfirmBtn = deleteModal.querySelector(".modal__submit-btn_type_delete");
const deleteCancelBtn = deleteModal.querySelector(".modal__submit-btn_type_cancel");

const editProfileForm = editProfileModal.querySelector(".modal__form");
const addCardForm = addCardModal.querySelector(".modal__form");
const avatarForm = avatarModal.querySelector(".modal__form");

const editProfileNameInput = document.querySelector("#profile-name-input");
const editProfileDescriptionInput = document.querySelector("#profile-description-input");
const captionInput = document.querySelector("#post-title-input");
const postImageInput = document.querySelector("#post-image-input");
const avatarInput = document.querySelector("#avatar-image-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");
const cardList = document.querySelector(".cards__list");

const cardTemplate = document.querySelector("#card-template");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

let currentModal = null;
let cardElementToDelete = null;
let cardIdToDelete = null;
let currentUserId = null;

function getSubmitButton(evt, formEl) {
  return evt.submitter || formEl.querySelector(settings.submitButtonSelector);
}

function openModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.add("modal_is-opened");
  currentModal = modal;
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove("modal_is-opened");
  if (currentModal === modal) {
    currentModal = null;
  }
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape" && currentModal) {
    closeModal(currentModal);
  }
}

function handleOverlayClose(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

function getCardImageSrc(data) {
  return localCardImages[data.name] || data.link || fallbackCardImage;
}

function isCardLikedByUser(cardData) {
  if (!Array.isArray(cardData.likes) || !currentUserId) {
    return Boolean(cardData.isLiked);
  }

  return cardData.likes.some((likeUser) => likeUser && likeUser._id === currentUserId);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content.firstElementChild.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  const cardImageSrc = getCardImageSrc(data);

  cardImageEl.src = cardImageSrc;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  data.isLiked = isCardLikedByUser(data);

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_active");
  }

  cardImageEl.addEventListener("error", () => {
    cardImageEl.src = fallbackCardImage;
  });

  cardLikeBtn.addEventListener("click", () => {
    if (!data._id) {
      data.isLiked = !data.isLiked;
      cardLikeBtn.classList.toggle("card__like-button_active", data.isLiked);
      return;
    }

    const request = data.isLiked
      ? api.removeLike(data._id)
      : api.addLike(data._id);

    request
      .then((updatedCard) => {
        data.isLiked = isCardLikedByUser(updatedCard);
        cardLikeBtn.classList.toggle("card__like-button_active", data.isLiked);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = cardImageSrc;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElementToDelete = cardElement;
    cardIdToDelete = data._id || null;
    openModal(deleteModal);
  });

  return cardElement;
}

function renderCards(cards, append = true) {
  cards.forEach((cardData) => {
    const cardElement = getCardElement(cardData);
    if (append) {
      cardList.append(cardElement);
    } else {
      cardList.prepend(cardElement);
    }
  });
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = getSubmitButton(evt, editProfileForm);
  setbuttonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value
    })
    .then((data) => {
      profileNameEl.textContent = profileDisplayName;
      profileDescriptionEl.textContent = profileDisplayDescription;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setbuttonText(submitBtn, false);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = getSubmitButton(evt, addCardForm);
  setbuttonText(submitBtn, true);

  const newCardData = {
    name: captionInput.value.trim(),
    link: postImageInput.value.trim()
  };

  api
    .addCard(newCardData)
    .then((cardData) => {
      renderCards([cardData], false);
      evt.target.reset();
      disablebutton(addCardForm.querySelector(settings.submitButtonSelector), settings);
      closeModal(addCardModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setbuttonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = getSubmitButton(evt, avatarForm);
  setbuttonText(submitBtn, true);

  api
    .updateUserAvatar({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      profileAvatarEl.alt = profileDisplayName;
      evt.target.reset();
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setbuttonText(submitBtn, false);
    });
}

function handleDeleteConfirm() {
  if (!cardElementToDelete) {
    closeModal(deleteModal);
    return;
  }

  if (!cardIdToDelete) {
    cardElementToDelete.remove();
    closeModal(deleteModal);
    return;
  }

  const confirmBtn = deleteConfirmBtn;
  setbuttonText(confirmBtn, true, "Deleting...", "Delete");

  api
    .deleteCard(cardIdToDelete)
    .then(() => {
      cardElementToDelete.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setbuttonText(confirmBtn, false, "Deleting...", "Delete");
    });
}

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});

if (newPostBtn) {
  newPostBtn.addEventListener("click", () => {
    addCardForm.reset();
    resetValidation(addCardForm, settings);
    openModal(addCardModal);
  });
}

if (avatarModalBtn) {
  avatarModalBtn.addEventListener("click", () => {
    avatarForm.reset();
    resetValidation(avatarForm, settings);
    openModal(avatarModal);
  });
}

editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));
addCardCloseBtn.addEventListener("click", () => closeModal(addCardModal));
previewCloseBtn.addEventListener("click", () => closeModal(previewModal));
avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));
deleteCloseBtn.addEventListener("click", () => closeModal(deleteModal));
deleteCancelBtn.addEventListener("click", () => closeModal(deleteModal));
deleteConfirmBtn.addEventListener("click", handleDeleteConfirm);

editProfileModal.addEventListener("click", handleOverlayClose);
addCardModal.addEventListener("click", handleOverlayClose);
previewModal.addEventListener("click", handleOverlayClose);
avatarModal.addEventListener("click", handleOverlayClose);
deleteModal.addEventListener("click", handleOverlayClose);

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
addCardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    currentUserId = userInfo._id;
    profileNameEl.textContent = profileDisplayName;
    profileDescriptionEl.textContent = profileDisplayDescription;
    profileAvatarEl.src = defaultAvatar;
    profileAvatarEl.alt = profileDisplayName;
    renderCards(initialCards);
  })
  .catch((err) => {
    console.log(err);
    profileAvatarEl.src = defaultAvatar;
    profileNameEl.textContent = profileDisplayName;
    profileDescriptionEl.textContent = profileDisplayDescription;
    profileAvatarEl.alt = profileDisplayName;
    renderCards(initialCards);
  });

profileAvatarEl.addEventListener("error", () => {
  profileAvatarEl.src = defaultAvatar;
});

