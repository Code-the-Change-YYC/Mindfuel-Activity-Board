import { User } from "./User";

export type SocketServiceInterface = {
  webSocket: WebSocket | undefined;
  connect: (websocketAddress: string) => void;
  disconnect: () => void;
  parseSocketData: (socketData: string) => User | null;
};
