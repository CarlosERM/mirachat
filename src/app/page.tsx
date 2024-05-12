"use client";
import { FormEvent, createContext, useEffect, useState } from "react";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MirachatIcon from "../../public/mirachat-icon.svg";
import GithubIcon from "../../public/github.svg";
import LinkedinIcon from "../../public/linkedin.svg";
import Link from "next/link";

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
  }, [router]);

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
      {/* <div className="w-40 mt-4 ml-4">
        <Link href="/">
          <Image src={MirachatIcon} alt="Mirachat Icon" />
        </Link>
      </div> */}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        {/* <Image src={MirachatIcon} alt="Mirachat Icon" /> */}
        <div className="w-48 mt-4 ml-4">
          <Link href="/">
            <Image src={MirachatIcon} alt="Mirachat Icon" />
          </Link>
        </div>
        <form
          className="flex flex-col w-full lg:max-w-md gap-4 shadow-md px-6 py-8 rounded-lg border"
          onSubmit={onSubmit}
        >
          <input
            type="text"
            className="rounded-lg border-2 border-c2 p-3 focus:outline-none focus:border-c1 w-full"
            value={username}
            placeholder={"Username"}
            onChange={(e) => setUsername(e.target.value)}
          />
          {/* {error && <p>errou</p>} */}
          <button
            type="submit"
            className="bg-c1 rounded-lg p-3 hover:bg-c5 focus:bg-c6 text-lg text-c4 font-semibold shadow-md w-full"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="absolute bottom-4 left-4 flex justify-center gap-7">
        <a
          href="https://github.com/CarlosERM"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image className="h-12" src={GithubIcon} alt="Logo do Github" />
        </a>
        <a
          href="https://www.linkedin.com/in/carloserm/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image className="h-12" src={LinkedinIcon} alt="Logo do Linkedin" />
        </a>
      </div>
    </>
  );
}
