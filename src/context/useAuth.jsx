import { useContext } from "react";
import { AuthContext } from "./createAuthContext";

export default function useAuth() {
  return useContext(AuthContext);
}
