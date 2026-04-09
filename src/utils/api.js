class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Error: ${res.status}`);
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    }).then((res) => this._checkResponse(res));
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    }).then((res) => this._checkResponse(res));
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about })
    }).then((res) => this._checkResponse(res));
  }

  updateUserAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar })
    }).then((res) => this._checkResponse(res));
  }

  addCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link })
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, { method: "DELETE" });
  }

  addLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, { method: "PUT" });
  }

  removeLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, { method: "DELETE" });
  }

  _request(endpoint, options = {}) {
    const finalOptions = {
      headers: this._headers,
      ...options
    };
    const url = `${this._baseUrl}${endpoint}`;
    return fetch(url, finalOptions).then(this._checkResponse);
  }
}

export default Api;
