import { socket } from "@/socket";
import { FormEvent, useState } from "react";
import Image from "next/image";
import sendIcon from "../../../public/send-icon.svg";
import Input from "./input-chat";
import { MyUser } from "../utils/interface";

export function Form({
  user,
  updateUser,
}: {
  user: MyUser;
  updateUser: (updatedUser: MyUser) => void;
}) {
  const [value, setValue] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessage();
    setValue("");
  }

  function sendMessage() {
    socket.emit("private-message", {
      content: value,
      to: user.userID,
    });

    if (user.messages) {
      user.messages.push({
        from: socket.userID,
        to: user.userID,
        content: value,
        fromSelf: true,
      });
    } else {
      user.messages = [
        {
          from: socket.userID,
          to: user.userID,
          content: value,
          fromSelf: true,
        },
      ];
    }
    // console.log("---------------------------------");
    // console.log("Enviando mensagem.......");
    // console.log(user);
    // console.log("---------------------------------");
    updateUser(user);
  }

  return (
    <>
      <form className="flex p-4 pt-2" onSubmit={onSubmit}>
        <Input value={value} setValue={setValue} />
        <button
          type="submit"
          className="bg-c1 rounded-r-lg p-4 hover:bg-c5 focus:bg-c6"
        >
          <Image src={sendIcon} alt="send icon" />
        </button>
      </form>
    </>
  );
}
