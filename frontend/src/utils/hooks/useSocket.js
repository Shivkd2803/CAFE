import { useEffect } from 'react';
import { io } from 'socket.io-client';

let socket;
export const getSocket = () => {
  if (!socket) socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
  return socket;
};

export const useSocket = (events = {}) => {
  useEffect(() => {
    const s = getSocket();
    Object.entries(events).forEach(([k, fn]) => s.on(k, fn));
    return () => Object.keys(events).forEach((k) => s.off(k));
  }, []); // eslint-disable-line
};