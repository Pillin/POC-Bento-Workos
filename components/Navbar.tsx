"use client";
import Image from "next/image";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";

const NavBar = ({ authLink }: { authLink: string }) => {
  const { isAuthenticated, setUser } = useContext(UserContext);

  if (isAuthenticated === "") return;

  return (
    <section className="flex flex-row justify-between p-4 w-full">
      <section className="w-14">
        <Image
          width={50}
          height={50}
          layout="responsive"
          src="/cat-heart.svg"
          alt="A heart cat"
        />
      </section>

      {isAuthenticated && (
        <button
          onClick={() => setUser({ type: "LOGOUT" })}
          className="flex items-center text-white hover:bg-gray-800 font-semibold py-1 px-2 shadow"
        >
          Log Out
        </button>
      )}
      {!isAuthenticated && (
        <a
          href={authLink}
          className="flex items-center text-white hover:bg-gray-800 font-semibold py-1 px-2 shadow"
        >
          Log In
        </a>
      )}
    </section>
  );
};

export default NavBar;
