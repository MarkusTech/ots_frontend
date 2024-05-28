// WindowState.tsx

import { useState } from "react";

export const useWindowState = () => {
  const [showSalesOrder, setShowSalesOrder] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [viewUsers, setViewUsers] = useState(false);
  const [showApprovalType, setShowApprovalType] = useState(false);
  const [showApprovalProcedure, setShowApprovalProcedure] = useState(false);

  const toggleWindow = (e: any) => {
    if (e === "salesorder") {
      setShowSalesOrder(!showSalesOrder);
    } else if (e === "users") {
      setShowUsers(!showUsers);
    } else if (e === "view") {
      setViewUsers(!viewUsers);
    } else if (e == "approvalType") {
      setShowApprovalType(!showApprovalType);
    } else if (e == "approvalProcedure") {
      setShowApprovalProcedure(!showApprovalProcedure);
    }
  };

  return {
    showSalesOrder,
    showUsers,
    viewUsers,
    showApprovalType,
    showApprovalProcedure,
    toggleWindow,
  };
};
