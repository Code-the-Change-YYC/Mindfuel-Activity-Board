import { Color } from "@material-ui/lab/Alert";

import { User } from "./User";

export type SocketServiceInterface = {
  webSocket: WebSocket | undefined;
  connect: (websocketAddress: string) => void;
  disconnect: () => void;
  parseSocketData: (socketData: string) => User | null;
  alert: (message: string, severity: Color) => void;
};
