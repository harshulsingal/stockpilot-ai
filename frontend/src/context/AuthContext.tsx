import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
} from "../services/authService";

const AuthContext =
  createContext<any>(null);

export const AuthProvider = ({
  children,
}: any) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((user) => {
        setUser(user);
      })
      .catch(() => {
        localStorage.removeItem(
          "token"
        );
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);