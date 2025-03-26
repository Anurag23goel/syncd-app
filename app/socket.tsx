import { io } from "socket.io-client";

const SOCKET_URL = "https://api-syncd.rebuilters.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // We will connect manually after setting the token
});

export const connectSocketWithToken = (token: string) => {
  // ✅ Attach token to headers
  socket.io.opts.extraHeaders = {
    authtoken: token,
  };

  socket.connect();
};

export default socket;
