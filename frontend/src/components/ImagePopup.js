import React from "react";

function ImagePopup(props) {
  return (
    <div
      className={`popup popup_type_image ${
        props.card ? "popup_is-visible" : ""
      }`}
    >
      <div className="popup__container popup__container_image">
        <button
          type="button"
          className="popup__close popup__close_image"
          onClick={props.onClose}
        ></button>
        <img
          className="popup__image"
          src={props.card ? props.card.link : ""}
          alt={props.card ? props.card.name : ""}
        />
        <p className="popup__caption">{props.card ? props.card.name : ""}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
