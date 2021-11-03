import { SocketServiceInterface } from "../utils/SocketServiceInterface";
import { User } from "../utils/User";
import { Location } from "../utils/Location";
import { addUser } from "../redux/actions";
import store from "../redux/store";

const connect = (websocketAddress: string) => {
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

const disconnect = () => {
  console.log("Disconnecting socket.");
  if (SocketService.webSocket) {
    SocketService.webSocket.close();
    SocketService.webSocket = undefined;
  }
};

const parseSocketData = (socketData: string) => {
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
    } else {
      user.asset = {
        name: "Wonderville Session",
        type: "Session",
      };
    }
    return user;
  } catch (SyntaxError) {
    console.log("Error: String was not a valid JSON! Socket Data:", socketData);
    return null;
  }
};

const SocketService: SocketServiceInterface = {
  webSocket: undefined,
  connect: connect,
  disconnect: disconnect,
  parseSocketData: parseSocketData,
};

export default SocketService;
