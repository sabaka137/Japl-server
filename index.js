const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const http = require("http");
const cors = require("cors");
const authRouter = require("./Auth/AuthRouter");
const groupsRouter = require("./Groups/GroupsRouter");
const usersRouter = require("./Users/UsersRouter");
const ConversationRouter = require("./Conversations/ConversationRouter");
const MessageRouter = require("./Messages/MessageRouter");

function preloadDB() {
  return mongoose.connect(process.env.MONGODB_LINK);
}

const ioConfig = {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
};

const corsConfig = {
  origin: ["http://localhost:3000"],
  credentials: true,
};
console.log(process.env.PORT)

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, ioConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));

app.use("/auth", authRouter);
app.use("/groups", groupsRouter);
app.use("/users", usersRouter);
app.use("/conversation", ConversationRouter);
app.use("/message", MessageRouter);


preloadDB()
  .then(() => {
    server.listen(process.env.PORT, () =>
      console.log(`http://localhost:${process.env.PORT}`)
    );
  })
  .catch((error) => {
    console.log("Error during preload MongoDB");
    throw error;
  });

  io.listen(4000)
let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
const RemoveUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};
io.on("connection", (socket) => {

  socket.on("disconnect", () => {
    RemoveUser(socket.id);
    socket.broadcast.emit("callEnded");
  });

  socket.on("disconnecting", function () {
    let rooms = socket.rooms;
    rooms.forEach(function (room) {
      io.in(room).emit("room-leave", "teadfad");
    });
  });

  socket.on("create-room", (roomId) => {
    socket.join(roomId);
    //send notif
  });
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    io.to(getUser(roomId).socketId).emit("user-joined");
  });

  socket.on("send-invite", (userToCall) => {
    io.to(getUser(userToCall).socketId).emit("receive-notification", "adad");
  });

  socket.on("call-user", ({ userToCall, signalData, from, name }) => {
    
    io.to(getUser(userToCall).socketId).emit("call-user", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(getUser(data.to).socketId).emit("callAccepted", data.signal);
  });

  socket.on("change-view", ({ view, userId }) => {
    io.to(getUser(userId).socketId).emit("changing-view", view);
  });
  socket.on("load-file", ({ file, userId }) => {
    io.to(getUser(userId).socketId).emit("receive-file", file);
  });


  socket.on("add-user", (userId) => {
   
    addUser(userId, socket.id);
  });
  socket.on("send-message", (data) => {
    const user = getUser(data.receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });
});


