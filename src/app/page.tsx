"use client";
import { FormEvent, createContext, useEffect, useState } from "react";
import Input from "./chat/input-chat";
import Link from "next/link";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MirachatIcon from "../../public/mirachat-icon.svg";
export default function UsernamePage() {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      // socket.auth = { sessionID };
      // socket.connect();
      router.push("/chat");
    }
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (username) {
      // setError(false);
      // socket.on("connect_error", (err) => {
      //   if (err.message === "Invalid username!") {
      //     router.push("/");
      //     setError(true);
      //   }
      // });
      socket.auth = { username };
      // socket.connect();
      router.push("/chat");
    }
  }

  return (
    <>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4">
        <Image src={MirachatIcon} alt="Mirachat Icon" />
        <form className="flex flex-col max-w-sm gap-4" onSubmit={onSubmit}>
          <input
            type="text"
            className="rounded-lg border-2 border-c2 p-3 focus:outline-none focus:border-c1"
            value={username}
            placeholder={"Username"}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error && <p>errou</p>}
          <button
            type="submit"
            className="bg-c1 rounded-lg p-3 hover:bg-c5 focus:bg-c6 text-lg text-c4 font-semibold shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
