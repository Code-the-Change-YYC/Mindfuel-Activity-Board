import { io, Socket } from "socket.io-client";

interface SocketServiceInterface {
  webSocket: Socket | undefined;
  connect: (websocketAddress: string) => void;
  disconnect: () => void;
}

const SocketService: SocketServiceInterface = {
  webSocket: undefined,
  connect: (websocketAddress: string) => {},
  disconnect: () => {},
};

SocketService.connect = (websocketAddress) => {
  if (SocketService.webSocket == undefined) {
    SocketService.webSocket = io(websocketAddress);

    SocketService.webSocket.on("connect", () => {
      console.log("Connected to socket!");

      SocketService.webSocket?.on("message", (payload) => {
        console.log("JSON received: " + payload);
      });
    });
  }
};

export default SocketService;
