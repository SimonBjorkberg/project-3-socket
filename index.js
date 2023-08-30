const { Server } = require("socket.io");

const io = new Server({ cors: "https://dapper-kelpie-a71f03.netlify.app/" });

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId: socket.id });

      console.log("online users", onlineUsers)

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    const response = {
      message: message.newMessage,
      recipientId: message.recipientId,
      chatId: message.chatId,
    };

    if (user) {
      io.to(user.socketId).emit("getMessage", response);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(5500);
