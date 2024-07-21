import { HttpApiProvider } from "./useHttpApi";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  return <HttpApiProvider>{children}</HttpApiProvider>;
};

export { useHttpApi } from "./useHttpApi";
export default GlobalStateProvider;
