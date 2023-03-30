import { useContext } from "react";
import { UserContext } from "../contexts";

/* ---------------------------------- hook ---------------------------------- */
export const useUser = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  return { currentUser, setCurrentUser };
};
