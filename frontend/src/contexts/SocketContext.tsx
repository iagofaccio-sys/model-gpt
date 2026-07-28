import { createContext, ReactNode, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket } from '../services/socket.service';
import { useAuth } from '../hooks/useAuth';

type SocketContextData = {
  socket: Socket | null;
};

export const SocketContext = createContext({} as SocketContextData);

type Props = {
  children: ReactNode;
};

export function SocketProvider({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    async function setup() {
      if (isAuthenticated) {
        const connectedSocket = await connectSocket();
        setSocket(connectedSocket);
      } else {
        disconnectSocket();
        setSocket(null);
      }
    }

    setup();

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}