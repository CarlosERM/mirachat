"use client";
import { socket } from "../../socket";

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div className="flex gap-3">
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
