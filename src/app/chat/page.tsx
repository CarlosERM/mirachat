"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { Form } from "./form";
import Image from "next/image";
import MirachatIcon from "../../../public/mirachat-icon.svg";
import Cute from "../../../public/cute.jpg";
import { useRouter } from "next/navigation";
import Messages from "./messages";
import HeaderChat from "./header-chat";
import { MyMessage, MyUser } from "../utils/interface";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [users, setUsers] = useState<MyUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<MyUser>();
  const router = useRouter();
  const scrollView = useRef<HTMLUListElement>(null);

  function scrollDown() {
    if (scrollView.current) {
      console.log(scrollView.current.clientHeight);
      // scrollView.current.scrollTop = scrollView.current.scrollHeight;
      scrollView.current.scrollTo(0, scrollView.current.scrollHeight);

      console.log();
      // console.log(scrollView.current.scrollHeight);
      // scrollView.current.scroll({
      //   block: "end",
      //   behavior: "smooth",
      //   inline: "start",
      // });
    }
  }

  function onClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const { currentTarget } = e;
    const { id } = currentTarget.dataset;
    if (id) {
      updateSelectedUser(id);
    }
  }

  function updateSelectedUser(id: string) {
    for (let i = 0; i < users.length; i++) {
      if (id === users[i].userID) {
        let selectedUser: MyUser = {
          userID: users[i].userID,
          username: users[i].username,
          self: users[i].self,
          messages: users[i].messages,
        };
        setSelectedUser(selectedUser);
      }
    }
  }

  function updateUser(updatedUser: MyUser) {
    setUsers(
      users.map((user) =>
        user.userID === updatedUser.userID ? updatedUser : user
      )
    );
  }

  useEffect(() => {
    socket.connect();

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function listAllUsers(users: MyUser[]) {
      let newUsers: MyUser[] = users.map((user) => {
        return {
          ...user,
          self: user.userID == socket.id,
        };
      });
      newUsers = newUsers.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(newUsers);
    }

    function handleConnectionError(err: { message: string }) {
      if (err.message === "Invalid username!") {
        router.push("/");
      }
    }

    function newUser(user: MyUser) {
      let newUser = {
        ...user,
        self: user.userID == socket.id,
      };
      setUsers((previous) => [...previous, newUser]);
    }

    function handleNewMessage({
      content,
      from,
    }: {
      content: string;
      from: string;
    }) {
      setUsers((prevState) =>
        prevState.map((user) =>
          user.userID === from
            ? {
                ...user,
                messages: user.messages
                  ? [...user.messages, { content, fromSelf: false }]
                  : [{ content, fromSelf: false }],
              }
            : user
        )
      );

      if (selectedUser && from === selectedUser.userID) {
        const updatedUser = {
          ...selectedUser,
          messages: selectedUser.messages
            ? [...selectedUser.messages, { content, fromSelf: false }]
            : [{ content, fromSelf: false }],
        };

        setSelectedUser((prevState) => updatedUser);
        scrollDown();
      }
    }

    socket.on("users-list", listAllUsers);
    socket.on("user-connected", newUser);
    socket.on("private-message", handleNewMessage);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", handleConnectionError);

    // socket.onAny((event, ...args) => {
    //   console.log(event, args);
    // });
    return () => {
      socket.off("connect", onConnect);
      socket.off("users-list", listAllUsers);
      socket.off("disconnect", onDisconnect);
      socket.off("user-connected", newUser);
      socket.off("private-message", handleNewMessage);
    };
  }, [users, router, selectedUser]);

  return (
    <div className="flex h-full ">
      <aside className="h-full pt-4 pl-2 flex flex-col gap-3 items-center	overflow-y-scroll">
        <Image src={MirachatIcon} alt="Mirachat Icon" className="w-44" />
        <ul>
          {users?.map((user, index) => {
            return (
              <li
                className="p-4 text-lg rounded-lg hover:bg-c7 focus:bg-c8 flex gap-4 w-72"
                key={index}
                data-id={user.userID}
                onClick={onClick}
              >
                <Image
                  src={Cute}
                  alt="Foto do usuário"
                  className="w-8 rounded-2xl"
                />

                {user.username}
              </li>
            );
          })}
        </ul>
      </aside>
      {selectedUser && (
        <main className="h-full flex flex-col grow">
          {/* <ConnectionManager /> */}
          <HeaderChat username={selectedUser.username} />
          {/* <ConnectionState isConnected={isConnected} /> */}
          <Messages user={selectedUser} scrollView={scrollView} />
          <Form
            user={selectedUser}
            updateUser={updateUser}
            scrollDown={scrollDown}
          />
          {/* <p>Status: {isConnected ? "Conectado" : "Desconectado"} </p>
        <p>Transport: {transport}</p> */}
        </main>
      )}
    </div>
  );
}
