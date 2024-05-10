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
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    } else {
      socket.connect();
    }

    if (socket.connected) {
      console.log("Conectado: " + socket.connected);
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
      // setIsConnected(false);
      // setTransport("N/A");
      setUsers((prevState) =>
        prevState.map((user) =>
          user.self
            ? {
                ...user,
                connected: false,
              }
            : user
        )
      );
    }

    function listAllUsers(users: MyUser[]) {
      console.log("Usuários: " + users);

      let newUsers: MyUser[] = users.map((user) => {
        return {
          ...user,
          self: user.userID === socket.userID,
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
      console.log("Erro de conexão");
      localStorage.clear();
      router.back();
      // if (err.message === "Invalid username!") {
      //   router.push("/");
      // }
    }

    function newUser(user: MyUser) {
      if (user.userID !== socket.userID) {
        console.log("--------------------------------");
        console.log("NEW USER ENTERED");
        console.log("User ID: " + user.userID);
        console.log("Socket ID: " + socket.userID);
        console.log("--------------------------------");

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
        }

        // setUsers((previous) =>
        //   previous.map((myUser) =>
        //     user.userID === socket.userID ? myUser : myUser
        //   )
        // );
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
      console.log("---------------------------");
      console.log("Conteudo: " + content);
      console.log("De: " + from);
      console.log("Para: " + to);
      console.log("---------------------------");

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
                    messages: user.messages
                      ? [...user.messages, { content, fromSelf: fromSelf }]
                      : [{ content, fromSelf: fromSelf }],
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
      console.log("-----------------------------");
      console.log("Session ID: ");
      console.log(sessionID);
      console.log("User ID: ");
      console.log(userID);
      console.log("-----------------------------");
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
    }

    // socket.on("connect", () => {
    //   setUsers((prevState) =>
    //     prevState.map((user) =>
    //       user.self
    //         ? {
    //             ...user,
    //             connected: true,
    //           }
    //         : user
    //     )
    //   );
    // });

    // socket.on("disconnect", () => {
    //   setUsers((prevState) =>
    //     prevState.map((user) =>
    //       user.self
    //         ? {
    //             ...user,
    //             connected: false,
    //           }
    //         : user
    //     )
    //   );
    // });

    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    socket.on("session", handleSession);
    socket.on("users-list", listAllUsers);
    socket.on("user-connected", newUser);
    socket.on("private-message", handleNewMessage);
    socket.on("connect", onConnect);
    socket.on("user-disconnected", onDisconnect);
    socket.on("connect_error", handleConnectionError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("users-list", listAllUsers);
      socket.off("user-disconnected", onDisconnect);
      socket.off("user-connected", newUser);
      socket.off("private-message", handleNewMessage);
      socket.off("session", handleSession);
      socket.off("connect_error", handleConnectionError);
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
                {user.self ? " (Você)" : ""}
                {user.connected ? "Conectado" : "Desconectado"}
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
          <Form user={selectedUser} updateUser={updateUser} />
          {/* <p>Status: {isConnected ? "Conectado" : "Desconectado"} </p>
        <p>Transport: {transport}</p> */}
        </main>
      )}
    </div>
  );
}
