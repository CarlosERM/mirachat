"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { socket } from "../../socket";
import Link from "next/link";
import Image from "next/image";
import MirachatIcon from "../../../public/mirachat-icon.svg";
export function ConnectionManager() {
  const [show, setShow] = useState<boolean>(false);

  function connect() {
    setShow(false);
    socket.connect();
  }

  function disconnect() {
    setShow(true);
    socket.disconnect();
  }

  return (
    <>
      {show && (
        <div className="absolute h-screen w-screen bg-c4 z-10 left-0 top-0">
          <div className="flex flex-col gap-4 items-center">
            <div className="w-44 mt-4 ml-4">
              <Image src={MirachatIcon} alt="Mirachat Icon" />
            </div>
            <div className="flex gap-3">
              <button
                className="bg-c1 rounded-lg px-3 py-2 hover:bg-c5 focus:bg-c6 text-c4"
                onClick={connect}
              >
                Connect
              </button>
              <button
                className="text-gray-500 hover:text-gray-700 hover:underline hover:underline-offset-2"
                onClick={disconnect}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-3 ">
        <button
          className="bg-c1 rounded-lg px-3 py-2 hover:bg-c5 focus:bg-c6 text-c4"
          onClick={connect}
        >
          Connect
        </button>
        <button
          className="text-gray-500 hover:text-gray-700 hover:underline hover:underline-offset-2"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </div>
    </>
  );
}
