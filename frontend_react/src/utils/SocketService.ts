import { Socket } from "socket.io-client";

export type SocketServiceInterface = {
  webSocket: Socket | undefined;
  connect: (websocketAddress: string) => void;
  disconnect: () => void;
};
