import { SocketServiceInterface } from "../utils/SocketServiceInterface";
import { User } from "../utils/User";
import { Location } from "../utils/Location";
import { addLiveUser, loading, setAlert } from "../redux/actions";
import store from "../redux/store";

let retries = 0;

const connect = (websocketAddress: string) => {
  if (SocketService.webSocket === undefined) {
    store.dispatch(loading(true));
    SocketService.webSocket = new WebSocket(websocketAddress);

    SocketService.webSocket.onopen = () => {
      store.dispatch(loading(false));
      if (retries > 0) {
        retries = 0; // Reset retries count
        setAlert("Successfully connected!");
      }
      console.log("New client connected!");
    };

    SocketService.webSocket.onmessage = (event) => {
      console.log("New message: " + JSON.parse(event.data));
      const user = SocketService.parseSocketData(event.data);
      if (user != null) {
        store.dispatch(addLiveUser(user));
      }
    };

    SocketService.webSocket.onclose = (event: CloseEvent) => {
      store.dispatch(loading(false));
      store.dispatch(
        setAlert(
          "Connection was closed. Reconnect will be attempted in 60 seconds.",
          "error"
        )
      );

      if (retries < 10) {
        setTimeout(() => {
          retries++;
          SocketService.webSocket = undefined;
          SocketService.connect(websocketAddress);
        }, 60000);
      } else {
        store.dispatch(
          setAlert(
            "Max socket connection retries reached. Please refresh the page to try connecting again.",
            "error"
          )
        );
      }
    };

    SocketService.webSocket.onerror = (err) => {
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
