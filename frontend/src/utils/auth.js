const BASE_URL = "https://api.sharound.students.nomoredomainssbs.ru";

const handleResponse = (res) => {
  return res.ok ? res : Promise.reject(`Error: ${res.status}`);
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: password, email: email }),
  }).then((res) => {
    if (handleResponse(res) === res) {
      return res.json();
    }
  });
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: password, email: email }),
  })
    .then((res) => {
      if (handleResponse(res) === res) {
        return res.json();
      } else {
        throw new Error("Failed to login");
      }
    })
    .then((res) => {
      localStorage.setItem("jwt", res.token);
      return true;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getUser = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (handleResponse(res) === res) {
      return res.json();
    }
  });
};
