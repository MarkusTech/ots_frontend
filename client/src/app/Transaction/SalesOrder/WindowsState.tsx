// WindowState.tsx

import { useState } from "react";

export const useWindowState = () => {
  const [showSalesOrder, setShowSalesOrder] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const toggleWindow = (e: any) => {
    if (e === "salesorder") {
      setShowSalesOrder(!showSalesOrder);
    } else if (e === "users") {
      setShowUsers(!showUsers);
      alert("Hello");
    } else if (e === "settings") {
      setShowSalesOrder(!showSalesOrder);
    }
  };

  return { showSalesOrder, showUsers, toggleWindow };
};
