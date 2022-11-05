import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  // Subscription to the context
  const currentUser = React.useContext(CurrentUserContext);
  // input state variables
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(e) {
    // Prevent the browser from navigating to the form address
    e.preventDefault();

    // Pass the values of the managed components to the external handler
    props.onUpdateUser({
      name,
      description,
    });
  }

  return (
    <PopupWithForm
      name="edit"
      title="Edit profile"
      btnText={props.isLoading ? "Saving..." : "Save"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <div className="popup__input-wrapper">
        <input
          className="popup__input popup__input_type_name"
          type="text"
          placeholder="Name Surname"
          id="name"
          name="name"
          required
          minLength="2"
          maxLength="40"
          onChange={handleNameChange}
          value={name || ""}
        />
        <span className="popup__input-error name-input-error"></span>
      </div>
      <div className="popup__input-wrapper">
        <input
          className="popup__input popup__input_type_title"
          type="text"
          placeholder="Title"
          id="title"
          name="description"
          required
          minLength="2"
          maxLength="200"
          onChange={handleDescChange}
          value={description || ""}
        />
        <span className="popup__input-error title-input-error"></span>
      </div>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
