"use client";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { Form } from "./form";
import Image from "next/image";
import MirachatIcon from "../../../public/mirachat-icon.svg";
import Cute from "../../../public/cute.jpg";
import { useRouter } from "next/navigation";
import Messages from "./messages";
import HeaderChat from "./header-chat";
import { MyUser } from "../utils/interface";
import { ConnectionManager } from "./connection-manager";

export default function User({
  user,
  selectedUser,
  key2,
  onClick,
}: {
  user: MyUser;
  selectedUser?: MyUser;
  key2: number;
  onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}) {
  return (
    <li
      className={
        selectedUser?.userID === user.userID
          ? "p-4 text-lg rounded-lg bg-c8 flex gap-4 w-72 items-center cursor-pointer relative"
          : "p-4 text-lg rounded-lg hover:bg-c7 focus:bg-c8 active:bg-c8 flex gap-4 w-72 items-center cursor-pointer relative"
      }
      key={key2}
      data-id={user.userID}
      onClick={onClick}
    >
      <div className="relative w-11 h-11">
        <Image
          src={Cute}
          alt="Foto do usuário"
          className="w-full h-full rounded-full"
        />
        {user.connected ? (
          <span className="w-3.5 h-3.5 bg-c12 absolute right-0 bottom-0 rounded-full border border-white"></span>
        ) : (
          <span className="w-3.5 h-3.5 bg-red-600 absolute right-0 bottom-0 rounded-full border border-white"></span>
        )}
      </div>
      <p>
        {user.username}
        {user.self ? " (You)" : ""}
      </p>
      {user.newMessage && (
        <span className="w-3.5 h-3.5 bg-c12 rounded-full absolute right-4"></span>
      )}
    </li>
  );
}
