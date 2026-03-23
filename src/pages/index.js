import "./index.css";
import { enableValidation } from "../scripts/validation.js";
import Api from "../utils/api.js";
import { setbuttonText } from "../utils/helpers.js";
import defaultAvatar from "../images/avatar.jpg";
import fallbackCardImage from "../images/1-photo-by-moritz-feldmann-from-pexels.jpg";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
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

const profileAddButtons = document.querySelectorAll(".profile__add-btn");
const avatarModalBtn = profileAddButtons[0] || null;
const newPostBtn = profileAddButtons[1] || null;
const editProfileBtn = document.querySelector(".profile__edit-btn");

const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const addCardCloseBtn = addCardModal.querySelector(".modal__close-btn");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");

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

function openModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.add("modal_is-opened");
  currentModal = modal;
}

function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove("modal_is-opened");
  if (currentModal === modal) {
    currentModal = null;
  }
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

function getCardElement(data) {
  const cardElement = cardTemplate.content.firstElementChild.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardImageEl.src = data.link || fallbackCardImage;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  cardImageEl.addEventListener("error", () => {
    cardImageEl.src = fallbackCardImage;
  });

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_active");
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  cardDeleteBtn.addEventListener("click", () => {
    if (!data._id) {
      cardElement.remove();
      return;
    }

    api
      .deleteCard(data._id)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => {
        console.log(err);
      });
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
  const submitBtn = evt.submitter;
  setbuttonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
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
  const submitBtn = evt.submitter;
  setbuttonText(submitBtn, true);

  const newCardData = {
    name: captionInput.value,
    link: postImageInput.value
  };

  api
    .addCard(newCardData)
    .then((cardData) => {
      renderCards([cardData], false);
      evt.target.reset();
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
  const submitBtn = evt.submitter;
  setbuttonText(submitBtn, true);

  api
    .updateUserAvatar({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      profileAvatarEl.alt = data.name;
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

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

if (newPostBtn) {
  newPostBtn.addEventListener("click", () => {
    openModal(addCardModal);
  });
}

if (avatarModalBtn) {
  avatarModalBtn.addEventListener("click", () => {
    openModal(avatarModal);
  });
}

editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));
addCardCloseBtn.addEventListener("click", () => closeModal(addCardModal));
previewCloseBtn.addEventListener("click", () => closeModal(previewModal));
avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));

editProfileModal.addEventListener("click", handleOverlayClose);
addCardModal.addEventListener("click", handleOverlayClose);
previewModal.addEventListener("click", handleOverlayClose);
avatarModal.addEventListener("click", handleOverlayClose);

document.addEventListener("keydown", handleEscapeKey);

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
addCardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatarEl.src = userInfo.avatar || defaultAvatar;
    profileAvatarEl.alt = userInfo.name;
    renderCards(cards);
  })
  .catch((err) => {
    console.log(err);
    profileAvatarEl.src = defaultAvatar;
    renderCards(initialCards);
  });

profileAvatarEl.addEventListener("error", () => {
  profileAvatarEl.src = defaultAvatar;
});

enableValidation({
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible"
});
