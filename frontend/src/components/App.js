import React, { useEffect, useState } from "react";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";

import { api } from "../utils/api";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

import EditProfilePopup from "./popups/EditProfilePopup";
import EditAvatarPopup from "./popups/EditAvatarPopup";
import InfoToolTip from "./popups/InfoToolTip";

import {
  UserContext,
  AuthContext,
  ModalContext,
  useInitializeAuthStore,
  useInitializeUserStore,
  useInitializeModalStore,
} from "../contexts";

function App() {


  const [isMobileView, setIsMobileView] = useState(false);

  let history = useHistory();
  const authStore = useInitializeAuthStore();
  const userStore = useInitializeUserStore();
  const modalStore = useInitializeModalStore();


  // on token change
  // set headers
  useEffect(() => {
    api.setHeaders({
      authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    });
  }, [authStore.token]);

  useEffect(() => {
    if (window.innerWidth <= 625) {
      setIsMobileView(true);
    }
  }, [window.innerWidth]);

  // on load
  // set token to local storage,redirect depending on iftoken
  useEffect(() => {

    if (!authStore.token) {
      history.push("/signin");
      return;
    }
  
    history.push("/");
  }, []);

  // on load
  // set esc close handler
  useEffect(() => {
    const handleEscClose = (event) => {
      if (event.key === "Escape") {
        modalStore.closeAllPopups();
      }
    };
    document.addEventListener("keydown", handleEscClose, false);
    return () => {
      document.removeEventListener("keydown", handleEscClose, false);
    };
  }, []);

  return (
    <div className="root">
      <div className="page">
        <AuthContext.Provider value={authStore}>
          <UserContext.Provider value={userStore}>
            <ModalContext.Provider value={modalStore}>
              <Header />
              <Switch>
                <ProtectedRoute exact path="/">
                  <Main />
                </ProtectedRoute>
                <Route path="/signup">
                  <Register />
                </Route>
                <Route path="/signin">
                  <Login />
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
              <EditAvatarPopup />
              <EditProfilePopup />
              <InfoToolTip />
            </ModalContext.Provider>
          </UserContext.Provider>
        </AuthContext.Provider>
      </div>
    </div>
  );
}

export default App;
