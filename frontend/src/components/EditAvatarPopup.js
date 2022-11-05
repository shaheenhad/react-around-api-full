import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const inputRef = React.useRef();
  React.useEffect(() => {
    inputRef.current.value = "";
  }, [props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="edit-profile-pic"
      title="Change profile picture"
      btnText={props.isLoading ? "Saving..." : "Save"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <div className="popup__input-wrapper">
        <input
          className="popup__input popup__input_type_image"
          type="url"
          placeholder="Image link"
          id="profile-pic"
          name="avatar"
          required
          ref={inputRef}
        />
        <span className="popup__input-error profile-pic-input-error"></span>
      </div>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
