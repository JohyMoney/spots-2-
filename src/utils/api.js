class Api {
  constructor(baseUrl, headers) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
   return Promise.all([this.getInitialCards()]);
  }

  async getInitialCards() {
    const res = await fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    });
    if (res.ok) {
      return res.json();
    }
    return await Promise.reject(`Error: ${res.status}`);
  }
  async getUserInfo() {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    });
    if (res.ok) {
      return res.json();
    }
    return await Promise.reject(`Error: ${res.status}`);
  }

  async editProfile(name, about) {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    });
    if (res.ok) {
      return res.json();
    }
    return await Promise.reject(`Error: ${res.status}`);
  }

  async addCard(name, link) {
    const res = await fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link
      })
    });
    if (res.ok) {
      return res.json();
    }
    return await Promise.reject(`Error: ${res.status}`);
}


  async postLike(cardId) {
  const res = await fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: this._headers
  });
  if (res.ok) {
    return res.json();
  }
  return await Promise.reject(`Error: ${res.status}`);
}

  async deleteLike(cardId) {
  const res = await fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: this._headers
  });
  if (res.ok) {
    return res.json();
  }
  return await Promise.reject(`Error: ${res.status}`);
}
  async editUserInfo({ name, about }) {
  const res = await fetch(`${this._baseUrl}/users/me`, {
    method: "PATCH",
    headers: this._headers,
    // Send the data in the body as a JSON string.
    body: JSON.stringify({
      name,
      about,
    }),
  });
  if (res.ok) {
    return res.json();
  }
  return await Promise.reject(`Error: ${res.status}`);
  }

  async editAvatarinfo({ avatar }) {
    const res = await fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    });
    if (res.ok) {
      return res.json();
    }
    return await Promise.reject(`Error: ${res.status}`);
  }

  async deleteCard(cardId) {
    const res = await fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers
    });
    if (res.ok) {
      return res.json();
    }
    return await Promise.reject(`Error: ${res.status}`);
  }

  ChangeLikeStatus(id, isLiked) {
    const method = isLiked ? "DELETE" : "PUT";
   return fetch(`${this._baseUrl}/cards/likes/${id}`, {
      method: isLiked ? "DELETE" : "PUT",
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