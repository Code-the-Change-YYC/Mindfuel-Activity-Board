import { io, Socket } from "socket.io-client";

interface SocketServiceInterface {
    webSocket: Socket | undefined,
    connect: (websocketAddress: string) => void,
    disconnect: () => void
};

// const websocketAddress = "wss://wonderville.org:5556";
// const socket = io(websocketAddress);

// socket.on("connect", () => console.log("Connected to socket!"));

// socket.on("message", (data) => {
//   console.log(data);
// });

// export {};
