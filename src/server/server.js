import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import crypto from "crypto";
import { InMemorySessionStore } from "./sessionStore.js";
import { InMemoryMessageStore } from "./messageStore.js";

const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

const randomID = () => crypto.randomBytes(8).toString("hex");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;

    if (sessionID) {
      const session = sessionStore.findSession(sessionID);
      if (session) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      }
    }

    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.sessionID = randomID();
    socket.userID = randomID();
    socket.username = username;

    next();
  });

  io.on("connection", (socket) => {
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });

    socket.emit("session", {
      sessionID: socket.sessionID,
      userID: socket.userID,
    });

    socket.join(socket.userID);

    const users = [];
    const messagesPerUser = new Map();
    messageStore.findMessagesForUser(socket.userID).forEach((message) => {
      const { from, to } = message;
      const otherUser = socket.userID === from ? to : from;

      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });

    sessionStore.findAllSessions().forEach((session) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
        messages: messagesPerUser.get(session.userID) || [],
      });
    });
    // console.log(users);
    socket.emit("users-list", users);

    // socket.on("users-list", () => {
    //   socket.emit("users-list", users);
    // });

    socket.broadcast.emit("user-connected", {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });

    socket.on("private-message", ({ content, to }) => {
      const message = {
        content,
        from: socket.userID,
        to,
      };
      // console.log("Mensagem " + content + " enviada para " + to);
      socket.to(to).to(socket.userID).emit("private-message", message);
      messageStore.saveMessage(message);
    });

    socket.on("disconnect", async () => {
      const matchingSockets = await io.in(socket.userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;

      if (isDisconnected) {
        socket.broadcast.emit("user-disconnected", socket.userID);
        sessionStore.saveSession(socket.sessionID, {
          userID: socket.userID,
          username: socket.username,
          connected: false,
        });
      }
      const users = [];
      sessionStore.findAllSessions().forEach((session) => {
        users.push({
          userID: session.userID,
          username: session.username,
          connected: session.connected,
        });
      });
      // console.log(users);
      // console.log(matchingSockets);
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
