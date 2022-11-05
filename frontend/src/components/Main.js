import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Header from "./Header";
import Footer from "./Footer";

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <>
      <Header userEmail={props.userEmail} logOut={props.logOut} />
      <main>
        <section className="profile">
          <div
            className="profile__image-container"
            onClick={props.onEditAvatarClick}
          >
            <img
              src={currentUser.avatar}
              alt="profile"
              id="avatar"
              className="profile__image"
            />
            <div className="profile__image-overlay"></div>
          </div>

          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <p className="profile__description">{currentUser.about}</p>
            <button
              type="button"
              className="profile__edit-button"
              onClick={props.onEditProfileClick}
            ></button>
          </div>
          <button
            type="button"
            className="profile__add-button"
            onClick={props.onAddPlaceClick}
          ></button>
        </section>
        <section className="elements">
          {props.cards.map((card) => {
            return (
              <Card
                key={card._id}
                card={card}
                onCardClick={props.onCardClick}
                onCardLike={props.onCardLike}
                onCardDelete={props.onCardDelete}
              />
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Main;
