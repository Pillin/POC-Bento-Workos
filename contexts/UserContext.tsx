"use client";
import React, { ReactNode, useReducer, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserService from "@/services/UserService";

const channel = new BroadcastChannel("DEMO_TEST");

const initialUserContext = {
  isAuthenticated: "",
  setUser: () => {},
};

type actionType = any; //TODO CHANGE

export const UserContext = React.createContext(initialUserContext);

const manageUser = (state: typeof initialUserContext, action: actionType) => {
  switch (action.type) {
    case "CHANGE_TOKEN": {
      return { ...state, ...action };
    }
    case "LOGOUT": {
      if (!state.isAuthenticated) return { ...state };
      localStorage.removeItem("token");
      channel.postMessage("LOGOUT");
      return { isAuthenticated: false };
    }
    default:
      return;
  }
};

const UserContextProvider = ({
  token,
  children,
}: {
  token: string | undefined;
  children: ReactNode;
}) => {
  const { push } = useRouter();
  const currentToken = token || localStorage.getItem("token") || "";
  const [value, setUser] = useReducer(manageUser, { isAuthenticated: "" });

  useEffect(() => {
    (async () => {
      const { user, isAuthenticated } = await UserService.getUser(currentToken);

      localStorage.setItem("token", currentToken);
      setUser({
        type: "CHANGE_TOKEN",
        user,
        isAuthenticated,
        token: currentToken,
      });
      if (token) push("/auth");
    })();

    channel.onmessage = () => {
      setUser({ type: "LOGOUT" });
    };
  }, [currentToken, token, push]);

  return (
    <UserContext.Provider value={{ ...value, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
