import { SocketServiceInterface } from "../utils/SocketServiceInterface";

const SocketService: SocketServiceInterface = {
  webSocket: undefined,
  connect: (websocketAddress: string) => {},
  disconnect: () => {},
};

SocketService.connect = (websocketAddress) => {
  if (SocketService.webSocket === undefined) {
    SocketService.webSocket = new WebSocket(websocketAddress);

    SocketService.webSocket.onopen = () => {
      console.log("New client connected!");
    };

    SocketService.webSocket.onmessage = (event) => {
      console.log("New message: " + JSON.parse(event.data));
    };

    SocketService.onclose = () => {
      // Retry connection until disconnect has been called.

    };
  }
};

SocketService.disconnect = () => {
  if (SocketService.webSocket) {
    SocketService.webSocket.close();
    SocketService.webSocket = undefined;
  }
};

export default SocketService;
