// const BASE_URL = "https://api.shhad.students.nomoredomainssbs.ru";
const BASE_URL = "http://localhost:3000";

const handleResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: password, email: email }),
  }).then((res) => handleResponse(res));
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: password, email: email }),
  })
    .then((res) => handleResponse(res))
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
      authorization: `Bearer ${token}`,
    },
  }).then((res) => handleResponse(res));
};
