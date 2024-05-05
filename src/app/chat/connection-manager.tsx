// import { socket } from '../socket';

// export function ConnectionManager() {
//   function connect() {
//     socket.connect();
//   }

//   function disconnect() {
//     socket.disconnect();
//   }

//   return (
//     <>
//       <button onClick={ connect }>Connect</button>
//       <button onClick={ disconnect }>Disconnect</button>
//     </>
//   );
// }
"use client";
import { socket } from "../../socket";
import { useEffect, useState } from "react";

export function ConnectionManager() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  function connect() {
    socket.connect();
    setIsConnected(true);
  }

  function disconnect() {
    socket.disconnect();
    setIsConnected(false);
    setTransport("N/A");
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </>
  );
}
