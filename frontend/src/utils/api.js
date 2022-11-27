class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _handleResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  initialize() {
    return Promise.all([this.getUser(), this.getInitialCards()]);
  }

  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }).then((res) => this._handleResponse(res));
  }

  getUser(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }).then((res) => this._handleResponse(res));
  }

  setUserInfo({ name, description }, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        about: description,
      }),
    }).then((res) => this._handleResponse(res));
  }

  addCard({ name, link }, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) => this._handleResponse(res));
  }

  deleteCard(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }).then((res) => this._handleResponse(res));
  }

  toggleLike(id, isLiked, token) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }).then((res) => this._handleResponse(res));
  }

  updateProfilePic({ avatar }, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => this._handleResponse(res));
  }
}

const api = new Api({
  baseUrl: "https://api.shhad.students.nomoredomainssbs.ru",
  // baseUrl: `http://localhost:3000`,
});

export default api;
