import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { authService } from "./api";
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  branch: string;
  gender: string;
  rollNumber: string;
  program: string;
  yearOfStudy: string;
  hostel: string;
  grievances?: [];
  created_at?: Date;
}
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

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
