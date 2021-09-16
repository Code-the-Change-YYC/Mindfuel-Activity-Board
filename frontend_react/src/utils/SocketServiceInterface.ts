export type SocketServiceInterface = {
  webSocket: WebSocket | undefined;
  connect: (websocketAddress: string) => void;
  disconnect: () => void;
};
