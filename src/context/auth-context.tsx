import React from "react";

type ContextType = {
  isLoggedIn: boolean;
  userId: string | undefined;
  token: string | undefined;
  login: (
    uid: string,
    token: string,
    expirationDate?: Date | undefined
  ) => void;
  logout: () => void;
};

export const AuthContext = React.createContext<ContextType | null>(null);
