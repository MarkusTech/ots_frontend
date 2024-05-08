// WindowState.tsx

import { useState } from "react";

export const useWindowState = () => {
  const [showSalesOrder, setShowSalesOrder] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const toggleSalesOrder = () => {
    setShowSalesOrder(!showSalesOrder);
  };

  const toggleWindow = (e: any) => {
    if (e === "salesorder") {
      setShowSalesOrder(!showSalesOrder);
    } else if (e === "users") {
      // setShowUsers(!showUsers);
      alert("Hello");
    }
  };

  return { showSalesOrder, showUsers, toggleSalesOrder, toggleWindow };
};
