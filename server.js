const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { engine } = require("express-handlebars");
const { router, products, messages } = require("./routes/router.js");
const fs = require("fs");

const PORT = 8080;
const app = express();
const httpserver = new HttpServer(app);
const io = new IOServer(httpserver);

app.use(express.static("views"));

app.engine("handlebars", engine());
app.set("views", "./views");
app.set("view engine", "handlebars");

app.use("/", router);

io.on("connection", (socket) => {
  io.sockets.emit("products", products);
  io.sockets.emit("chat");
  socket.on("newProduct", (newProduct) => {
    products.push(newProduct);
    io.sockets.emit("products", products);
  });
  socket.on("newMessage", (newMessage) => {
    messages.push(newMessage);
    fs.writeFileSync("./chat/chat.txt", JSON.stringify(messages));
    io.sockets.emit("chat");
  });
});
app.get("/messages", (req, res) => {
  let messages = JSON.parse(fs.readFileSync("./chat/chat.txt"));
  io.sockets.emit("messages", messages);
  return res.send(messages);
});

const server = httpserver.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
server.on("error", () => console.log(`Error: ${err}`));
