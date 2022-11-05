import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Main from "./Main";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import * as auth from "../utils/auth";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isInfoTooltipOpen: false,
      selectedCard: null,
      userEmail: "",
      currentUser: {},
      cards: [],
      isLoading: false,
      regSuccess: false,
    };
    this.handleEditAvatarClick = this.handleEditAvatarClick.bind(this);
    this.handleEditProfileClick = this.handleEditProfileClick.bind(this);
    this.handleAddPlaceClick = this.handleAddPlaceClick.bind(this);
    this.handleAuthRegClick = this.handleAuthRegClick.bind(this);
    this.closeAllPopups = this.closeAllPopups.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleUpdateAvatar = this.handleUpdateAvatar.bind(this);
    this.handleCardLike = this.handleCardLike.bind(this);
    this.handleCardDelete = this.handleCardDelete.bind(this);
    this.handleAddPlaceSubmit = this.handleAddPlaceSubmit.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }
  componentDidMount() {
    api
      .getUser()
      .then((res) => {
        this.setState({ currentUser: res });
      })
      .catch((err) => {
        console.log(err);
      });

    // Get initial cards
    api
      .getInitialCards()
      .then((res) => {
        this.setState({ cards: res });
      })
      .catch((err) => {
        console.log(err);
      });
    // Check if user has jwt token
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .getUser(jwt)
        .then((res) => {
          if (res) {
            this.setState({
              loggedIn: true,
              userEmail: res.data.email,
            });
          }
        })
        .then(() => {
          this.props.history.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleLogIn(email, password) {
    auth
      .authorize(email, password)
      .then((res) => {
        if (res) {
          this.setState({ loggedIn: true, userEmail: email }, () =>
            this.props.history.push("/")
          );
        } else {
          this.handleAuthRegClick(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleRegister(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          this.handleAuthRegClick(true);
          this.props.history.push("/signin");
        } else {
          this.handleAuthRegClick(false);
        }
      })
      .catch((err) => {
        this.handleAuthRegClick(false);
        console.log(err);
      });
  }

  handleLogOut() {
    localStorage.removeItem("jwt");
    this.setState({ loggedIn: false, email: null });
  }

  handleEditProfileClick() {
    this.setState({ isEditProfilePopupOpen: true });
  }

  handleAddPlaceClick() {
    this.setState({ isAddPlacePopupOpen: true });
  }

  handleEditAvatarClick() {
    this.setState({ isEditAvatarPopupOpen: true });
  }

  handleCardClick(card) {
    this.setState({ selectedCard: card });
  }

  handleAuthRegClick(result) {
    this.setState({
      regSuccess: result,
      isInfoTooltipOpen: true,
    });
  }

  closeAllPopups() {
    this.setState({
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      selectedCard: null,
      isInfoTooltipOpen: false,
    });
  }

  handleUpdateUser(info) {
    this.setState({ isLoading: true });
    api
      .setUserInfo(info)
      .then((res) => {
        this.setState({ currentUser: res }, this.closeAllPopups());
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  handleUpdateAvatar(data) {
    this.setState({ isLoading: true });
    api
      .updateProfilePic(data)
      .then((res) => {
        this.setState({ currentUser: res }, this.closeAllPopups());
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some(
      (user) => user._id === this.state.currentUser._id
    );

    // Send a request to the API and getting the updated card data
    api
      .toggleLike(card._id, isLiked)
      .then((newCard) => {
        const newCards = this.state.cards.map((c) =>
          c._id === card._id ? newCard : c
        );
        this.setState({ cards: newCards });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        const newCards = this.state.cards.filter((c) => c._id !== card._id);
        this.setState({ cards: newCards });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleAddPlaceSubmit(card) {
    this.setState({ isLoading: true });
    api
      .addCard(card)
      .then((res) => {
        const newCards = [res, ...this.state.cards];
        this.setState({ cards: newCards }, this.closeAllPopups());
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <CurrentUserContext.Provider value={this.state.currentUser}>
        <div className="page">
          <div className="page__content">
            <Switch>
              <ProtectedRoute
                exact
                path="/"
                loggedIn={this.state.loggedIn}
                component={Main}
                onEditProfileClick={this.handleEditProfileClick}
                onAddPlaceClick={this.handleAddPlaceClick}
                onEditAvatarClick={this.handleEditAvatarClick}
                onCardClick={this.handleCardClick}
                cards={this.state.cards}
                onCardLike={this.handleCardLike}
                onCardDelete={this.handleCardDelete}
                logOut={this.handleLogOut}
                userEmail={this.state.userEmail}
              />
              <Route path="/signup">
                <Register register={this.handleRegister} />
              </Route>
              <Route path="/signin">
                <Login logIn={this.handleLogIn} />
              </Route>
            </Switch>

            <InfoTooltip
              isOpen={this.state.isInfoTooltipOpen}
              success={this.state.regSuccess}
              onClose={this.closeAllPopups}
            />
            <EditProfilePopup
              isOpen={this.state.isEditProfilePopupOpen}
              onClose={this.closeAllPopups}
              onUpdateUser={this.handleUpdateUser}
              isLoading={this.state.isLoading}
            />
            <AddPlacePopup
              isOpen={this.state.isAddPlacePopupOpen}
              onClose={this.closeAllPopups}
              onAddPlaceSubmit={this.handleAddPlaceSubmit}
              isLoading={this.state.isLoading}
            />
            <EditAvatarPopup
              isOpen={this.state.isEditAvatarPopupOpen}
              onClose={this.closeAllPopups}
              onUpdateAvatar={this.handleUpdateAvatar}
              isLoading={this.state.isLoading}
            />
            <ImagePopup
              card={this.state.selectedCard}
              onClose={this.closeAllPopups}
            />
          </div>
        </div>
      </CurrentUserContext.Provider>
    );
  }
}

export default withRouter(App);
