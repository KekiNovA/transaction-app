import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import GlobalStateProvider from "./state";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          error: {
            style: {
              background: "#ff5252",
              color: "#fff",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
          },
          success: {
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
            iconTheme: {
              primary: "#f1f2f6",
              secondary: "#2f3542",
            },
          },
        }}
      ></Toaster>
    </GlobalStateProvider>
  </React.StrictMode>
);
