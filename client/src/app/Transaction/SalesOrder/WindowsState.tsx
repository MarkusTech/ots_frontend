// WindowState.tsx

import { useState } from "react";

export const useWindowState = () => {
  const [showSalesOrder, setShowSalesOrder] = useState(false);

  const toggleSalesOrder = () => {
    setShowSalesOrder(!showSalesOrder);
  };

  const toggleWindow = (e: any) => {
    if (e === "salesorder") {
      setShowSalesOrder(!showSalesOrder);
    }
  };

  return { showSalesOrder, toggleSalesOrder, toggleWindow };
};
