"use client";

import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
} from "react";
import { useWs, WebSocketService } from "@/utils/ws";

type WSContextType = {
  ws: WebSocketService;
  isConnected: boolean;
};

export const WSContext = createContext<WSContextType>(null);

const WsProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const ws = useWs();
  return <WSContext.Provider value={ws}>{props.children}</WSContext.Provider>;
};

export default WsProvider;
