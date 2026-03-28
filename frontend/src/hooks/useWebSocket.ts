'use client';
import { useEffect, useRef, useState } from 'react';
import { API } from '../lib/api';

export function useWebSocket(onMessage: (msg: any) => void) {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let reconnectTimer: any;
    
    function connect() {
      if (ws.current) return;
      const url = API.getWsUrl();
      const socket = new WebSocket(url);
      
      socket.onopen = () => {
        setConnected(true);
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error("WS parse error", e);
        }
      };
      
      socket.onclose = () => {
        setConnected(false);
        ws.current = null;
        reconnectTimer = setTimeout(connect, 3000);
      };
      
      socket.onerror = () => {
        socket.close();
      };

      ws.current = socket;
    }
    
    connect();
    
    return () => {
      clearTimeout(reconnectTimer);
      if (ws.current) {
        ws.current.close();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { connected };
}
