"use client";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { Form } from "./form";
import MirachatIcon from "../../../public/mirachat-icon.svg";
import Cute from "../../../public/cute.jpg";
import { useRouter } from "next/navigation";
import Messages from "./messages";
import HeaderChat from "./header-chat";
import { MyUser } from "../utils/interface";
import { ConnectionManager } from "./connection-manager";
import User from "./user";
import Image from "next/image";
import Back from "../../../public/back.svg";
import Forward from "../../../public/forward.svg";

export default function MyAside({
  users,
  selectedUser,
  onClick,
}: {
  users: MyUser[];
  selectedUser?: MyUser;
  onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}) {
  const [show, setShow] = useState<boolean>(true);
  function showAside() {
    setShow(!show);
  }
  return (
    <aside className="flex flex-col h-full pt-4 pl-2 pr-2 gap-3 items-center overflow-y-auto border-r-2 border-c9">
      <button
        onClick={showAside}
        className="w-8 absolute left-1 bg-white rounded-full shadow border"
      >
        {show ? (
          <Image src={Back} alt="" className="w-7" />
        ) : (
          <Image src={Forward} alt="" className="w-7" />
        )}
      </button>
      {show && (
        <>
          <Image src={MirachatIcon} alt="Mirachat Icon" className="w-44" />
          <ConnectionManager />
          <ul className="flex flex-col gap-1">
            {users?.map((user, index) => {
              return (
                <User
                  user={user}
                  selectedUser={selectedUser}
                  key={index}
                  key2={index}
                  onClick={onClick}
                />
              );
            })}
          </ul>
        </>
      )}
    </aside>
  );
}
