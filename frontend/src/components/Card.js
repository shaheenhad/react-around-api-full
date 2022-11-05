import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  // Checking if the current user is the owner of the current card
  const isOwn = card.owner._id === currentUser._id;

  // Creating a variable for the delete button
  const cardDeleteButtonClassName = `card__trash ${
    isOwn ? "card__trash_visible" : "card__trash_hidden"
  }`;

  // Check if the card was liked by the current user
  const isLiked = card.likes.some((user) => user._id === currentUser._id);

  // Creating a variable for the like button
  const cardLikeButtonClassName = `card__like ${
    isLiked ? "card__like_clicked" : ""
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleCardDelete() {
    onCardDelete(card);
  }

  return (
    <article className="card">
      <button
        className={cardDeleteButtonClassName}
        type="button"
        onClick={handleCardDelete}
      ></button>
      <div
        className="card__image"
        style={{ backgroundImage: `url(${card.link})` }}
        onClick={handleClick}
      ></div>
      <div className="card__info">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like-container">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></button>
          <p className="card__like-num">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}
export default Card;
