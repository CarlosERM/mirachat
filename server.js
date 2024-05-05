import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.use((socket, next) => {
    const username = socket.handshake.auth.username;

    if (!username) {
      return next(new Error("Invalid username!"));
    }

    socket.username = username;

    next();
  });

  io.on("connection", (socket) => {
    let users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        username: socket.username,
      });
    }
    socket.emit("users-list", users);

    // Notify all existing users that a new user was connected
    socket.broadcast.emit("user-connected", {
      userID: socket.id,
      username: socket.username,
    });

    socket.on("private-message", ({ content, to }) => {
      console.log("Mensagem " + content + " enviada para " + to);
      socket.to(to).emit("private-message", { content, from: socket.id });
    });
  });

  httpServer
    .once("error", (err) => {
      // console.log(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
