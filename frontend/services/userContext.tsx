import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { IUser } from "../../backend/models/User";
import { authService } from "./api";

interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await authService.getUserProfile();
      setUser(profile);
    };

    if (!user) {
      fetchUserProfile();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};