"use client";
import { Socket, io } from "socket.io-client";

Socket;

interface MySocket extends Socket {
  userID?: string;
}

export const socket: MySocket = io({ autoConnect: false });
