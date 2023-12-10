"use client";

import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";

const UserProfile = () => {
  const data = useContext(UserContext);
  const { isAuthenticated, setUser } = data;

  if (!isAuthenticated) return;
  return <section></section>;
};

export default UserProfile;
