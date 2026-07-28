import { io, Socket } from 'socket.io-client';
import { ENV } from '../config/env';
import { getToken } from '../storage/authStorage';

let socket: Socket | null = null;

export async function connectSocket() {
  const token = await getToken();

  if (socket?.connected) {
    return socket;
  }

  socket = io(ENV.SOCKET_URL, {
    transports: ['websocket'],
    auth: {
      token,
    },
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}