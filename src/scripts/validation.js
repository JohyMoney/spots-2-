export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible"
};

const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  }
  else {
    hideInputError(formEl, inputEl, config);
  }
};

const showInputError = (formEl, inputEl, errorMessage, config) => {
  const errorEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.add(config.inputErrorClass);
  errorEl.textContent = errorMessage;
  errorEl.classList.add(config.errorClass);
};

const hideInputError = (formEl, inputEl, config) => {
  const errorEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.remove(config.inputErrorClass);
  errorEl.classList.remove(config.errorClass);
  errorEl.textContent = "";
};




const hasvalidInput = (inputList, config) => {
  return inputList.some((inputEl) => {
    return !inputEl.validity.valid;
  });
}

const toggleButtonState = (inputList, buttonEl, config) => {
  if (hasvalidInput(inputList, config)) {
    disablebutton(buttonEl, config);
  }
  else {
    buttonEl.disabled = false;
    modifyButtonState(buttonEl, true, config);
  }
}
const modifyButtonState = (buttonEl, isActive, config) => {
  if (isActive) {
    buttonEl.classList.remove(config.inactiveButtonClass);
  }
  else {
    buttonEl.classList.add(config.inactiveButtonClass);
  }
}
export const disablebutton = (buttonEl, config) => {
  if (!buttonEl) {
    return;
  }
  buttonEl.disabled = true;
  modifyButtonState(buttonEl, false, config);
}

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonEl, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", function () {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonEl, config);
    });
  });
};



export const resetValidation = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);
  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl, config);
  });
  disablebutton(buttonEl, config);
};

export const enableValidation = (config) => {
  const formList = (document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });

}
enableValidation(settings);


