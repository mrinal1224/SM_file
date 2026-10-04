import { io } from "socket.io-client";

// Creating the socket object here gives the frontend one shared connection.
// autoConnect is false so React decides exactly when the connection starts.
const socket = io("http://localhost:8084", {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
