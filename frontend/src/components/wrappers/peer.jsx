import React, { createContext, useContext } from "react";
import usePeer from "./peerhook";

// Create the PeerContext
const PeerContext = createContext(null);

// Provider Component
export const PeerProvider = ({ children }) => {
  const peer = usePeer(); // Use the custom hook

  return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
};

// Custom hook to use the PeerContext
export const usePeerContext = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("usePeerContext must be used within a PeerProvider");
  }
  return context;
};
