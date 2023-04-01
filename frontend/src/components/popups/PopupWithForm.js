/* --------------------------------- imports -------------------------------- */
import React from "react";
import Popup from "./Popup";

/* ------------------------- function PopupWIthForm ------------------------- */
function PopupWithForm({
  isOpen,
  onClose,
  onSubmit,
  name,
  title,
  children,
  submitText,
}) {

  /* -------------------------------- handlers -------------------------------- */
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  /* --------------------------------- return --------------------------------- */
  return (
    <Popup isOpen={isOpen} onClose={onClose} name={name}>
      <h2 className="modal__title">{title}</h2>
      <form
        className={`modal__form modal__form_type_${name}`}
        id={`modal-form-${name}`}
        name={`form-${name}`}
        onSubmit={handleSubmit}
      >
        {children}
        <button
          aria-label="Submit Form Button"
          type="submit"
          id={`${name}-submit-button`}
          className="button modal__button-submit"
        >
          {submitText}
        </button>
      </form>
    </Popup>
  );
}
export default PopupWithForm;
