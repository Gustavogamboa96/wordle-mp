import { io } from 'socket.io-client';

// Always connect to the render.com server
const URL = 'https://wordlemp-server.onrender.com';

export const socket = io(URL, {
transports: ["websocket"] // use webSocket only
});