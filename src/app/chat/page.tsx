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

export default function Home() {
  const [users, setUsers] = useState<MyUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<MyUser>();
  const router = useRouter();
  const scrollView = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollDown();
  }, [users]);

  function scrollDown() {
    if (scrollView.current) {
      scrollView.current.scrollIntoView({
        behavior: "smooth",
      });
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
          connected: users[i].connected,
          newMessage: users[i].newMessage,
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
    function onDisconnect(userID: string) {
      // console.log("------------------------------------");
      // console.log("USER " + userID + " DISCONNECTED");
      // console.log("------------------------------------");
      setUsers((prevState) =>
        prevState.map((user) =>
          user.userID === userID
            ? {
                ...user,
                connected: false,
              }
            : user
        )
      );

      if (selectedUser?.userID === userID) {
        const updatedUser = {
          ...selectedUser,
          connected: false,
        };
        setSelectedUser(updatedUser);
      }
    }
    socket.on("user-disconnected", onDisconnect);

    return () => {
      socket.off("user-disconnected", onDisconnect);
    };
  }, [users, selectedUser]);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    } else {
      socket.connect();
    }
  }, []);

  useEffect(() => {
    function listAllUsers(users: MyUser[]) {
      // console.log("Usuários: " + users);

      let newUsers: MyUser[] = users.map((user) => {
        return {
          ...user,
          self: user.userID === socket.userID,
          messages: user.messages?.map((message) => ({
            ...message,
            fromSelf: message.from === socket.userID,
          })),
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
      // console.log("Erro de conexão");
      localStorage.clear();
      router.push("/");
    }

    function newUser(user: MyUser) {
      if (user.userID !== socket.userID) {
        // console.log("--------------------------------");
        // console.log("NEW USER ENTERED");
        // console.log("User ID: " + user.userID);
        // console.log("Socket ID: " + socket.userID);
        // console.log("--------------------------------");

        let newUser = {
          ...user,
          self: socket.userID === user.userID,
        };
        let isInside = false;

        for (let i = 0; i < users.length; i++) {
          if (users[i].userID === user.userID) {
            isInside = true;
          }
        }

        if (!isInside) {
          setUsers((previous) => [...previous, newUser]);
        } else {
          setUsers((prevState) =>
            prevState.map((myUser) =>
              myUser.userID === user.userID
                ? {
                    ...myUser,
                    connected: newUser.connected,
                  }
                : myUser
            )
          );

          if (selectedUser) {
            const updatedUser = {
              ...selectedUser,
              connected: newUser.connected,
            };

            setSelectedUser(updatedUser);
          }
        }
      }
    }

    function handleNewMessage({
      content,
      from,
      to,
    }: {
      content: string;
      from: string;
      to: string;
    }) {
      // console.log("---------------------------");
      // console.log("Conteudo: " + content);
      // console.log("De: " + from);
      // console.log("Para: " + to);
      // console.log("---------------------------");
      // console.log("---------------------------------");
      // console.log("Recebendo mensagem.......");
      // console.log(users);
      // console.log("---------------------------------");
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const fromSelf = socket.userID === from;
        // console.log(fromSelf);
        if (user.userID === (fromSelf ? to : from)) {
          setUsers((prevState) =>
            prevState.map((user) =>
              user.userID === from
                ? {
                    ...user,
                    newMessage: true,
                    messages: user.messages
                      ? [
                          ...user.messages,
                          {
                            content,
                            from: from,
                            to: to,
                            fromSelf: from === socket.userID,
                          },
                        ]
                      : [
                          {
                            content,
                            from: from,
                            to: to,
                            fromSelf: from === socket.userID,
                          },
                        ],
                  }
                : user
            )
          );

          if (selectedUser && from === selectedUser.userID) {
            const updatedUser = {
              ...selectedUser,
              newMessage: false,
              messages: selectedUser.messages
                ? [
                    ...selectedUser.messages,
                    {
                      content,
                      from: from,
                      to: to,
                      fromSelf: from === socket.userID,
                    },
                  ]
                : [
                    {
                      content,
                      from: from,
                      to: to,
                      fromSelf: from === socket.userID,
                    },
                  ],
            };
            setSelectedUser((prevState) => updatedUser);
          }
          break;
        }
      }
    }

    function handleSession({
      sessionID,
      userID,
    }: {
      sessionID: string;
      userID: string;
    }) {
      // console.log("-----------------------------");
      // console.log("Session ID: ");
      // console.log(sessionID);
      // console.log("User ID: ");
      // console.log(userID);
      // console.log("-----------------------------");
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
    }

    // socket.onAny((event, ...args) => {
    //   console.log(event, args);
    // });

    socket.on("session", handleSession);
    socket.on("users-list", listAllUsers);
    socket.on("user-connected", newUser);
    socket.on("private-message", handleNewMessage);
    socket.on("connect_error", handleConnectionError);

    return () => {
      socket.off("session", handleSession);
      socket.off("users-list", listAllUsers);
      socket.off("user-connected", newUser);
      socket.off("private-message", handleNewMessage);
      socket.off("connect_error", handleConnectionError);
    };
  }, [users, router, selectedUser]);

  return (
    <div className="flex h-full">
      <aside className="h-full pt-4 pl-2 pr-2 flex flex-col gap-3 items-center	overflow-y-scroll">
        <Image src={MirachatIcon} alt="Mirachat Icon" className="w-44" />
        <ConnectionManager />
        <ul className="flex flex-col gap-1">
          {users?.map((user, index) => {
            return (
              <li
                className={
                  selectedUser?.userID === user.userID
                    ? "p-4 text-lg rounded-lg bg-c8 flex gap-4 w-72 items-center cursor-pointer relative"
                    : "p-4 text-lg rounded-lg hover:bg-c7 focus:bg-c8 active:bg-c8 flex gap-4 w-72 items-center cursor-pointer relative"
                }
                key={index}
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
          })}
        </ul>
      </aside>
      {selectedUser && (
        <main className="h-full flex flex-col grow">
          <HeaderChat username={selectedUser.username} />
          <Messages user={selectedUser} scrollView={scrollView} />
          <Form user={selectedUser} updateUser={updateUser} />
        </main>
      )}
    </div>
  );
}
