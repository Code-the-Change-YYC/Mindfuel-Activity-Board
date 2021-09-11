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

    SocketService.webSocket.onclose = function (event: CloseEvent) {
      console.log(
        "Socket was closed. Reconnect will be attempted in 10 seconds.",
        event.reason
      );
      setTimeout(() => {
        SocketService.connect(websocketAddress);
      }, 10000);
    };

    SocketService.webSocket.onerror = function (err) {
      console.error("Socket encountered error, closing socket.");
      SocketService.webSocket?.close();
    };
  }
};

SocketService.disconnect = () => {
  console.log("Disconnecting socket.");
  if (SocketService.webSocket) {
    SocketService.webSocket.close();
    SocketService.webSocket = undefined;
  }
};

export default SocketService;
