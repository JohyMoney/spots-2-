import "./index.css";
import { enableValidation,validationConfig } from "./validation";
import { Api } from "../utils/api.js";
import{setbuttonText } from "../utils/helpers.js";





const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "827c1060-a8a1-45e4-bf30-fb285779703f",
    "Content-Type": "application/json"
  }
});
  api.getAppInfo()
  .then(([cards]) => {
    cards.forEach(function (item) {
      const cardEl = getCardElement(item);
      cardList.append(cardEl);
    });
api.getUserInfo()
  .then((userInfo) => { {

  }})
  .then((userInfo) => {

    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    cardImageEL.src = userInfo.avatar;
    cardImageEL.alt = userInfo.name;
  })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");

const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const editProfileForm = editProfileModal.querySelector(".modal__form");
const addCardForm = document.querySelector("#new-post-modal .modal__form");
const newPostBtn = document.querySelector(".profile__add-btn");
const addCardModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = addCardModal.querySelector(".modal__close-btn");
const cardSubmitBtn = addCardModal.querySelector(".modal__submit-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarForm.querySelector(".modal__submit-btn");
const avatarInput = avatarForm.querySelector("#profile-avatar-input");


const deleteForm = deleteModal.querySelector(".modal__form");


const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const cardImageEL = document.querySelector(".card__image");
const deleteModal = document.querySelector("#delete-modal");


const addCardCloseBtn = addCardModal.querySelector(".modal__close-btn");
const addCardFormEl = addCardModal.querySelector(".modal__form");
const captionInputEl = addCardFormEl.querySelector("#card-caption-input");
const linkInputEl = addCardFormEl.querySelector("#card-link-input");

const previewCloseBtn = document.querySelector(".modal__close_type_preview");
const cardDeleteButton = document.querySelector(".card__delete-button");


const cardTemplate = document.querySelector("#card-template");
const previewModal = document.querySelector("#preview-modal");
const previewImageEl = document.querySelector(".modal__image");
const previewCaptionEl = document.querySelector(".modal__caption");

let selectedcard;let selectedCardId;




editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});


newPostBtn.addEventListener("click", function () {
  openModal(addCardModal);
});




const cardList = document.querySelector(".cards__list");
const captionInput = document.querySelector("#post-title-input");
const postImageInput = document.querySelector("#post-image-input");

function getCardElement(data) {
  const cardElement = cardTemplate.content.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");




  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_active");
  });

  cardDeleteBtn.addEventListener("click", (evt) => handleDeleteCard(cardElement, data._id));{
    evt.target.closest(".card").remove();
  };

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  return cardElement;
  });

avatarForm.addEventListener("submit", handleAvatarSubmit);

likeButton.addEventListener("click", () => {
  if (likeButton.classList.contains("card__like-button_active")) {
    api.deleteLike(data._id)
      .then((updatedCard) => {
        likeButton.classList.remove("card__like-button_active");
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    api.postLike(data._id)
      .then((updatedCard) => {
        likeButton.classList.add("card__like-button_active");
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

  cardDeleteButton.addEventListener("click", () => {
  api.deleteCard(data._id)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";
  setbuttonText(submitBtn, "Save");


api.editUserInfo({name: editProfileNameInput.value, about: editProfileDescriptionInput.value})
  .then((data) => {
    profileNameEl.textContent = data.name;
    profileDescriptionEl.textContent = data.about;
    closeModal(editProfileModal);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Save";
  });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api.updateUserAvatar({avatar: avatarInput.value})
  .then((data) => {
    cardImageEL.src = data.avatar;
    cardImageEL.alt = data.name;
    closeModal(avatarModal);
  })
  .catch((err) => {
    console.log(err);
  });
}

  avatarModalBtn.addEventListener("click", () => {
    openModal(avatarModal);
  });

  avatarCloseBtn.addEventListener("click", () => {
    closeModal(avatarModal);
  });

  return cardElement;

}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  currentModal = modal;
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    closeModal(openedModal);
  }
}


function closeModal(modal) {
   if (!modal) return;
  modal.classList.remove("modal_is-opened");
  currentModal = null;
}

function handledeleteSubmit(evt) {
  evt.preventDefault();
  api.deleteCard(selectedCardId)
  .then(() => {
    selectedcard.remove();
    closeModal(deleteModal);
  })
  .catch((err) => {
    console.log(err);
  });
}

function handleDeleteCard(evt) {
  selectedcard =cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
  closeModal(deleteModal);
}


editProfileCloseBtn.addEventListener("click", handleCloseClick);
addCardCloseBtn.addEventListener("click", handleCloseClick);
previewCloseBtn.addEventListener("click", handleCloseClick);
newPostCloseBtn.addEventListener("click", handleCloseClick);


document.addEventListener("keydown", handleEscapeKey);

let currentModal = null;

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api.updateUserAvatar({avatar: avatarInput.value})
  .then((data) => {
    cardImageEL.src = data.avatar;
    cardImageEL.alt = data.name;
    closeModal(avatarModal);
  })
  .catch((err) => {
    console.log(err);
  });
}


function handleCloseClick() {
  closeModal(currentModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  api.editUserInfo({name: editProfileNameInput.value, about: editProfileDescriptionInput.value})
  .then((data) => {
    profileNameEl.textContent = data.name;
    profileDescriptionEl.textContent = data.about;
    closeModal(editProfileModal);
  })
  .catch((err) => {
    console.log(err);
  });
  console.log("Title:", captionInput.value);
  console.log("Image URL:", postImageInput.value);
  addCardModal.classList.remove("modal_is-opened");
  const newCardData = {
    name: captionInput.value,
    link: postImageInput.value
  };
  const newCardElement = getCardElement(newCardData);
  cardList.prepend(newCardElement);
  evt.target.reset();
  disablebutton(cardSubmitBtn, settings);
  closeModal(addCardModal);
}
editProfileModal.addEventListener("click", (evt) => {
  if (evt.target === editProfileModal) {
    closeModal(editProfileModal);
  }
});

addCardModal.addEventListener("click", (evt) => {
  if (evt.target === addCardModal) {
    closeModal(addCardModal);
  }
});

previewModal.addEventListener("click", (evt) => {
  if (evt.target === previewModal) {
    closeModal(previewModal);
  }
});


initialCards.forEach(function (item) {
  const cardElement = getCardElement(item);
  cardList.append(cardElement);
});
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
addCardForm.addEventListener("submit", handleAddCardSubmit);



enableValidation(validationConfig);