import React from "react";

function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen ? "popup_is-visible" : ""
      }`}
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__close"
          onClick={props.onClose}
        ></button>
        <form
          onSubmit={props.onSubmit}
          name={props.name}
          className="popup__form"
          id={props.name}
        >
          <h2 className="popup__title">{props.title}</h2>
          <fieldset className="popup__form-fieldset">
            {props.children}
            <button type="submit" className="popup__submit-button">
              {props.btnText}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
