import { addLiveUser, setLoading, setAlert } from "../state/actions";
import store from "../state/store";
import { SocketServiceInterface } from "../utils/SocketServiceInterface";
import { User } from "../utils/User";

let retries = 0;
const timeout = 60000;

const connect = (websocketAddress: string) => {
  if (SocketService.webSocket === undefined) {
    store.dispatch(setLoading(true));
    SocketService.webSocket = new WebSocket(websocketAddress);

    SocketService.webSocket.onopen = () => {
      store.dispatch(setLoading(false));
      if (retries > 0) {
        retries = 0; // Reset retries count
        store.dispatch(setAlert("Live connection successfully established!"));
      }
    };

    SocketService.webSocket.onmessage = (event) => {
      const user = SocketService.parseSocketData(event.data);
      if (user != null) {
        store.dispatch(addLiveUser(user));
      }
    };

    SocketService.webSocket.onclose = () => {
      store.dispatch(setLoading(false));
      store.dispatch(
        setAlert(
          `Live connection was closed. Reconnect will be attempted in ${
            timeout / 1000
          } seconds.`,
          "error"
        )
      );

      if (retries < 10) {
        setTimeout(() => {
          retries++;
          SocketService.webSocket = undefined;
          SocketService.connect(websocketAddress);
        }, timeout);
      } else {
        store.dispatch(
          setAlert(
            "Max live connection retries reached. Please refresh the page to try connecting again.",
            "error"
          )
        );
      }
    };

    SocketService.webSocket.onerror = (err) => {
      console.error(
        "Socket encountered the following error, closing socket: ",
        err
      );
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
    const user: User = JSON.parse(socketData);
    user.date = new Date();
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
