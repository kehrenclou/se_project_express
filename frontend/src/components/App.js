/* --------------------------------- imports -------------------------------- */
import React, { useEffect, useState, useMemo } from "react";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";

import { api } from "../utils/api";
import * as auth from "../utils/auth";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import InfoToolTip from "./InfoToolTip";

import { UserContext, AuthContext, useInitializeAuthStore, useInitializeUserStore } from "../contexts";

/* -------------------------------------------------------------------------- */
/*                                 functionApp                                */
/* -------------------------------------------------------------------------- */
function App() {
  /* ------------------------------- use states ------------------------------- */
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  const [isLoading, setIsLoading] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState(""); //used for tooltip fail/sucess

  // const [currentUser, setCurrentUser] = useState({
  //   name: " ",
  //   about: " ",
  //   avatar: " ",
  //   //test adding email and id
  //   email: "email@email.com",
  //   id: "",
  // });

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState({});

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopoupOpen] =
    useState(false);
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);

  let history = useHistory();
  const authStore = useInitializeAuthStore();
  const userStore=useInitializeUserStore();
  /* -------------------------------- setup API ------------------------------- */
  // const baseUrl = "http://localhost:3000"; //trying 3001

  // const storeValue = useMemo(() => {
  //   return {
  //     currentUser,
  //   };
  // }, [currentUser]);
  /* --------------------------- useEffect  ----------------------------------- */
  //on load
  //on loggedIn change
  //loads user info and card info here
  //not loading current data
  //?how is jwt being updated

  //1. useEffect on load - check tokens, set userinfo
  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
    console.log("authstoretoken", authStore.token); //returns token
    //no token on loading page
    if (!authStore.token) {
      history.push("/signin");
    } else {
      console.log("useeffectonload", token); //token here
      console.log("authstore", authStore);

      api.setHeaders({
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });
      api
        .getInfo()
        // auth
        //   .getContent(token) //in auth file- on load check token frontend auth.getcontent
        //sends with token in header - endpoint /users/me=>sendUserProfile from controller
        //QUESTION: how is the token able to return the user info - its getting it
        .then((res) => {
          if (res) {
            console.log("useeffect onloadres", res); //return object with userino
            authStore.setIsLoggedIn(true);
            //do headers need to be set here?
            // api.setHeaders({
            //   authorization: `Bearer ${token}`,
            //   "Content-Type": "application/json",
            // });
            userStore.setCurrentUser(res);
            // loadAppInfo(); //load appinfo in this file
            console.log("ue onload user?", userStore.currentUser); //
          }
        })
        .catch((err) => {
          auth.handleAuthError(err);
          history.push("/signin");
        });
    }
  }, []);

  //use effect gets cards from server & sets - when isLoggedIn state changes
  //isLoggedIn changes on handleLoginSubmit before protected route is loaded
  //api.getInitialCards
  useEffect(() => {
    if (!authStore.isLoggedIn) {
      console.log(
        "ue cards on load authStore.isnotloggedin",
        authStore.isLoggedIn
      );
      return;
    } //exit if not logged in
    api.setHeaders({
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
    api
      .getInitialCards() //card info from server
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }, [authStore.isLoggedIn]);

  useEffect(() => {
    const handleEscClose = (event) => {
      if (event.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", handleEscClose, false);
    return () => {
      document.removeEventListener("keydown", handleEscClose, false);
    };
  }, []);

  /* --------------------------- handlers with apis --------------------------- */
  //Update User
  function handleUpdateUser(input) {
    setIsLoading(true);
    api
      .setUserInfo(input.name, input.about)
      .then((userData) => {
        userStore.setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  //Update Avatar
  function handleUpdateAvatar(newAvatar) {
    setIsLoading(true);

    api
      .setProfileAvatar(newAvatar.avatar)
      .then((newAvatar) => {
        // setUserAvatar(newAvatar);
        userStore.setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  //Like Unlike Card
  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((user) => user === userStore.currentUser._id);
    // Send a request to the API and getting the updated card data
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          //state of cards before changing them
          //map returns array with each of its elements modified
          state.map((currentCard) =>
            // console.log(currentCard)
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }

  //Confirm Delete Card
  function handleConfirmDelete(event) {
    setIsLoading(true);
    api
      .deleteCard(cardToDelete._id)
      .then(() => {
        setCards(
          cards.filter(function (item) {
            return item._id !== cardToDelete._id;
          })
        );
        closeAllPopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  //Add New Card
  function handleAddPlaceSubmit(newCard) {
    setIsLoading(true);
    api
      .addNewCard(newCard.name, newCard.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  /* ---------------------------handlers with auth----------------------------- */
  //register
  function handleRegisterSubmit({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        if (res._id) {
          setStatus("success");
          setIsToolTipOpen(true);
          history.push("/signin");
        } else {
          setStatus("fail");
        }
      })
      .catch((err) => {
        auth.handleAuthError(err);
        setStatus("fail");
      })
      .finally(() => {
        setIsToolTipOpen(true);
      });
  }

  //login
  //?should this also be calling loginuser from backendcontroller
  function handleLoginSubmit({ email, password }) {
    auth
      .login(email, password)
      .then((res) => {
        if (res) {
          console.log("handleloginsubmit", res, email, password); //returns token and email
          localStorage.setItem("jwt", res.token);
          setToken(res.token);
          api.setHeaders({
            authorization: `Bearer ${res.token}`, //useAuth.token will be a response instead of useAuth
            "Content-Type": "application/json",
          });
          authStore.setIsLoggedIn(true);
          // fetchUserInfo();

          history.push("/");
        } else {
          setStatus("fail");
          setIsToolTipOpen(true);
        }
      })
      .catch((err) => {
        // auth.handleAuthError(err);
        console.log(err);
        setStatus("fail");
        setIsToolTipOpen(true);
      });
  }

  //signout
  function handleSignOut() {
    authStore.setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    history.push("/signin");
  }
  /* --------------------------handler functions ------------------------------- */

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(clickedCard) {
    setSelectedCard(clickedCard);
  }

  function handleCardDelete(card) {
    setIsConfirmDeletePopoupOpen(true);
    setCardToDelete(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmDeletePopoupOpen(false);
    setSelectedCard(null);
    setIsToolTipOpen(false);
  }
  /* --------------------------------- return --------------------------------- */
  return (
    <div className="root">
      <div className="page">
        <AuthContext.Provider value={authStore}>
        <UserContext.Provider value={userStore}>
          <Header onSignOut={handleSignOut} />
          {/* <Header email={email} onSignOut={handleSignOut} /> */}
          <Switch>
            <ProtectedRoute exact path="/" loggedIn={authStore.isLoggedIn}>
              <Main
                onEditAvatarClick={handleEditAvatarClick}
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            </ProtectedRoute>
            <Route path="/signup">
              <Register onRegisterSubmit={handleRegisterSubmit} />
            </Route>
            <Route path="/signin">
              <Login onLoginSubmit={handleLoginSubmit} />
            </Route>
            <Route>
              {authStore.isLoggedIn ? (
                <Redirect to="/" />
              ) : (
                <Redirect to="/signin" />
              )}
            </Route>
          </Switch>
          <Footer />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />

          <ConfirmDeletePopup
            isOpen={isConfirmDeletePopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleConfirmDelete}
            isLoading={isLoading}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
            isLoading={isLoading}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <InfoToolTip
            isOpen={isToolTipOpen}
            onClose={closeAllPopups}
            status={status}
          />
        </UserContext.Provider>
        </AuthContext.Provider>
      </div>
    </div>
  );
}

export default App;
