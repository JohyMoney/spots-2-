import "./index.css";
import { disablebutton, resetValidation, settings } from "../scripts/validation.js";
import Api from "../utils/api.js";
import { setbuttonText } from "../utils/helpers.js";
import defaultAvatar from "../images/avatar.jpg";
import fallbackCardImage from "../images/1-photo-by-moritz-feldmann-from-pexels.jpg";

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

function getCardElement(data) {
  const cardElement = cardTemplate.content.firstElementChild.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardImageEl.src = data.link || fallbackCardImage;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_active");
  }

  cardImageEl.addEventListener("error", () => {
    cardImageEl.src = fallbackCardImage;
  });

  cardLikeBtn.addEventListener("click", () => {
    const request = data.isLiked
      ? api.removeLike(data._id)
      : api.addLike(data._id);

    request
      .then((updatedCard) => {
        data.isLiked =
          typeof updatedCard.isLiked === "boolean" ? updatedCard.isLiked : !data.isLiked;
        cardLikeBtn.classList.toggle("card__like-button_active", data.isLiked);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
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
      setbuttonText(confirmBtn, false);
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
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatarEl.src = userInfo.avatar || defaultAvatar;
    profileAvatarEl.alt = userInfo.name;
    renderCards(cards);
  })
  .catch((err) => {
    console.log(err);
    profileAvatarEl.src = defaultAvatar;
  });

profileAvatarEl.addEventListener("error", () => {
  profileAvatarEl.src = defaultAvatar;
});

