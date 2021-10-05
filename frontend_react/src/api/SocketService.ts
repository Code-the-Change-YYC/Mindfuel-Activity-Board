import { SocketServiceInterface } from "../utils/SocketServiceInterface";
import { User } from "../utils/User";
import { Location } from "../utils/Location";
import { addUser } from "../store/home/actions";
import store from "../store/home/store";

const SocketService: SocketServiceInterface = {
  webSocket: undefined,
  connect: (websocketAddress: string) => {},
  disconnect: () => {},
  parseSocketData: (socketData: string) => null,
};

SocketService.connect = (websocketAddress) => {
  if (SocketService.webSocket === undefined) {
    SocketService.webSocket = new WebSocket(websocketAddress);

    SocketService.webSocket.onopen = () => {
      console.log("New client connected!");
    };

    SocketService.webSocket.onmessage = (event) => {
      console.log("New message: " + JSON.parse(event.data));
      const user = SocketService.parseSocketData(event.data);
      if (user != null) {
        store.dispatch(addUser(user));
      }
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

SocketService.parseSocketData = (socketData: string) => {
  try {
    const jsonData = JSON.parse(socketData);
    const userLocation: Location = jsonData.payload.location;
    const user: User = {
      type: jsonData.type,
      location: userLocation,
    };
    if (user.type === "wondervilleAsset") {
      user.ip = jsonData.payload.ip;
      user.asset = JSON.parse(jsonData.payload.asset);
    }
    return user;
  } catch (SyntaxError) {
    console.log("Error: String was not a valid JSON!");
    return null;
  }
};

export default SocketService;
