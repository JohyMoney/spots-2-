class Api {
  constructor(baseUrl, headers) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
   return Promise.all([this.getInitialCards()]);
  }

getInitialCards() {
  return fetch(`${this._baseUrl}/cards`, {
    headers: this._headers,
  }).then(this._checkResponse);
}
getAppInfo() {
  return Promise.all([this.getUserInfo(), this.getInitialCards()]);
}

handleDeleteCard(cardId) {
  this._api.deleteCard(cardId)
    .then(() => {
      this._removeCard(); // Only remove after successful response
    })
    .catch((err) => console.error(err));
}

handleLikeCard() {
  this._api.changeLikeCardStatus(this._id, this._isLiked)
    .then((updatedCard) => {
      this._isLiked = !this._isLiked;
      this._renderLikes(updatedCard); // Only update UI after success
    })
    .catch((err) => console.error(err));
}
_checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

  _request(url, options) {
    return fetch(`${this._baseUrl}${url}`, options).then(this._checkResponse);
  }


 getUserInfo() {
  return fetch(`${this._baseUrl}/users/me`, {
    headers: this._headers
  }).then(this._checkResponse);
  }


 editProfile(name, about) {
  return fetch(`${this._baseUrl}/users/me`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  }).then(this._checkResponse);
}

addCard(name, link) {
  return fetch(`${this._baseUrl}/cards`, {
    method: "POST",
    headers: this._headers,
    body: JSON.stringify({
      name: name,
      link: link
    })
  }).then(this._checkResponse);
}


 postLike(cardId) {
  return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: this._headers
  }).then(this._checkResponse);
}

 deleteLike(cardId) {
  return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: this._headers
  }).then(this._checkResponse);
}

editUserInfo({ name: userName, about }) {
  return fetch(`${this._baseUrl}/users/me`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({
      name: userName,
      about,
    }),
  }).then(this._checkResponse);
}
editAvatarInfo({ avatar }) {
  return fetch(`${this._baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({
      avatar,
    }),
  }).then(this._checkResponse);
  }

deleteCard(cardId) {
  return fetch(`${this._baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: this._headers
  }).then(this._checkResponse);
  }

  changeLikeStatus(id, isLiked) {
    const method = isLiked ? "DELETE" : "PUT";
   return fetch(`${this._baseUrl}/cards/likes/${id}`, {
      method: method,
      headers: this._headers
  })
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  });
}
}




// export the class
export default Api;