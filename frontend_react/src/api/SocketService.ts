import { io } from "socket.io-client";

const websocketAddress = "wss://wonderville.org:5556";
const socket = io(websocketAddress);

socket.on("connect", () => console.log("Connected to socket!"));

socket.on("message", (data) => {
  console.log(data);
});

export {};
