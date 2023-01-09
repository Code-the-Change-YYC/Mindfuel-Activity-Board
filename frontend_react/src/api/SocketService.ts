import { Color } from "@material-ui/lab/Alert";
import _ from "lodash";

import { addLiveUser, setAlert, setWebSocketConnectionStatus } from "../state/actions";
import store from "../state/store";
import { AppState } from "../utils/AppState";
import { SocketServiceInterface } from "../utils/SocketServiceInterface";
import { User } from "../utils/User";

const timeout = 30000;

const connect = (websocketAddress: string) => {
  if (SocketService.webSocket === undefined) {
    SocketService.webSocket = new WebSocket(websocketAddress);

    SocketService.webSocket.onopen = () => {
      store.dispatch(setWebSocketConnectionStatus(true));
    };

    SocketService.webSocket.onmessage = (event) => {
      const user = SocketService.parseSocketData(event.data);
      if (user != null) {
        store.dispatch(addLiveUser(user));
      }
    };

    SocketService.webSocket.onclose = () => {
      store.dispatch(setWebSocketConnectionStatus(false));

      // Retry after timeout
      setTimeout(() => {
        SocketService.webSocket = undefined;
        SocketService.connect(websocketAddress);
      }, timeout);
    };

    SocketService.webSocket.onerror = (err) => {
      console.error("Socket encountered the following error, closing socket: ", err);
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

const alert = (message: string, severity: Color) => {
  const appState: AppState = store.getState();

  // Only alert when 'Live' is selected on the timeline
  if (_.isNil(appState.historicalUsers)) {
    store.dispatch(setAlert(message, severity));
  }
};

const SocketService: SocketServiceInterface = {
  webSocket: undefined,
  connect: connect,
  disconnect: disconnect,
  parseSocketData: parseSocketData,
  alert: alert,
};

export default SocketService;
