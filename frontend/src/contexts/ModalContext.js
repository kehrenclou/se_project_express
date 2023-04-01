import { createContext, useState } from "react";

export const ModalContext = createContext();

export const useInitializeModalStore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);
  const [status, setStatus] = useState(""); //used for tooltip fail/sucess
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] =
  useState(false);
  // const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  // const [isConfirmDeletePopupOpen, setIsConfirmDeletePopoupOpen] =
  //   useState(false);

  console.log("from modalstore file", status, isToolTipOpen);

  return {
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isConfirmDeletePopupOpen,
    isToolTipOpen,
    isLoading,
    status,
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsConfirmDeletePopupOpen,
    setIsToolTipOpen,
    setIsLoading,
    setStatus,
  };
};
