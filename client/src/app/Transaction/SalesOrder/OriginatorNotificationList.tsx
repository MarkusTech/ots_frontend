import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import NotificationSalesOrder from "./NotificatonSalesOrder";
import SalesOrderOriginator from "./SalesOrderOriginator";

interface Props {
  originatorUserID: number;
  userData: string;
  userBranchID: string;
  userWarehouseData: string;
  userPriceListNumData: string;
  userIDData: string;
}

interface NotificationArr {
  AppSummID: number;
  AppType: string;
  ReqDate: string;
  DraftNum: number;
  DocDate: string;
  DocType: string;
  CustomerName: string;
  TotalAmtDue: number;
  Remarks: string;
  Status: string;
}

const OriginatorNotificationList: React.FC<Props> = ({
  originatorUserID,
  userData,
  userBranchID,
  userWarehouseData,
  userPriceListNumData,
  userIDData,
}) => {
  const [notifications, setNotifications] = useState<NotificationArr[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [showSalesOrder, setShowSalesOrder] = useState<boolean>(false);
  const [draftNum, setDraftNum] = useState<number>(0);
  const [draftNumString, setDraftNumString] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [showSalesOrderFromDraftNum, setShowSalesOrderFromDraftNum] =
    useState<boolean>(false);
  const [headerStatus, setHeaderStatus] = useState<string>("");

  const userData_props = userData;
  const userBranchID_props = userBranchID;
  const userWarehouseData_props = userWarehouseData;
  const userPriceListNumData_props = userPriceListNumData;
  const userIDData_props = userIDData;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://172.16.10.169:5000/api/v1/originator-list/${originatorUserID}`
        );
        setNotifications(response.data.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [originatorUserID]);

  const handleShowView = async (AppSummID: number, DraftNum: number) => {
    const selectedNotification = notifications.find(
      (notification) => notification.AppSummID === AppSummID
    );

    if (selectedNotification) {
      setDraftNum(selectedNotification.DraftNum);
      setStatus(selectedNotification.Status);
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/originator/status/${DraftNum}`
      );

      const status =
        response.data.success && response.data.data.DocStat !== ""
          ? response.data.data.DocStat
          : "Pending";

      setStatus(status);
    } catch (error) {
      console.error("Error fetching status:", error);
      setStatus("Pending");
    }

    setShowSalesOrder(!showSalesOrder);
  };

  const handleHideView = () => {
    setShowSalesOrder(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <Draggable>
          <div
            className="bg-white shadow-lg"
            style={{
              border: "1px solid #ccc",
              position: "absolute",
              top: "20%",
              left: "20%",
              maxHeight: "700px",
              overflowY: "auto",
            }}
          >
            <div
              className="grid grid-cols-2 p-2 text-left windowheader"
              style={{ cursor: "move" }}
            >
              <div>Originator Approval List</div>
              <div className="text-right">
                <span className="cursor-pointer" onClick={handleClose}>
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">
                <div className="table-container">
                  <table className="w-full">
                    <thead className="tables">
                      <tr>
                        <th>Approval Summary ID</th>
                        <th>Approval Type</th>
                        <th>Request Date</th>
                        <th>Draft Number</th>
                        <th>Document Date</th>
                        <th>Document Type</th>
                        <th>Customer Name</th>
                        <th>Total Amount Due</th>
                        <th>Remarks</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map((notification) => (
                        <tr key={notification.AppSummID}>
                          <td>{notification.AppSummID}</td>
                          <td>{notification.AppType}</td>
                          <td>
                            {new Date(
                              notification.ReqDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="text-red-500 font-bold">
                            {notification.DraftNum}
                          </td>
                          <td>
                            {new Date(
                              notification.DocDate
                            ).toLocaleDateString()}
                          </td>
                          <td>{notification.DocType}</td>
                          <td>{notification.CustomerName}</td>
                          <td>{notification.TotalAmtDue}</td>
                          <td>{notification.Remarks}</td>
                          <td
                            className={
                              notification.Status === "Pending"
                                ? "bg-orange-200"
                                : notification.Status === "Approved"
                                ? "bg-green-200"
                                : notification.Status === "Decline"
                                ? "bg-red-200"
                                : ""
                            }
                          >
                            {notification.Status}
                          </td>

                          <td>
                            {notification.Status === "Approved" ? (
                              <button
                                className="ml-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                onClick={() => {
                                  setDraftNumString(
                                    notification.DraftNum.toString()
                                  );
                                  setShowSalesOrderFromDraftNum(true);
                                  setHeaderStatus(notification.Status);
                                }}
                              >
                                View
                              </button>
                            ) : (
                              <button
                                className="ml-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                onClick={() =>
                                  handleShowView(
                                    notification.AppSummID,
                                    notification.DraftNum
                                  )
                                }
                              >
                                View
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}
      {/* Conditionally render SalesOrder */}
      {showSalesOrder && (
        <Draggable>
          <div
            className="bg-white shadow-lg"
            style={{
              border: "1px solid #ccc",
              position: "absolute",
              top: "20%",
              left: "20%",
              maxHeight: "700px",
              overflowY: "auto",
            }}
          >
            <div
              className="grid grid-cols-2 p-2 text-left windowheader"
              style={{ cursor: "move" }}
            >
              <div>Sales Order ({status})</div>
              <div className="text-right">
                <span className="cursor-pointer" onClick={handleHideView}>
                  ❌
                </span>
              </div>
            </div>
            <div>
              <NotificationSalesOrder DraftNumber={draftNum} />
            </div>
          </div>
        </Draggable>
      )}
      {showSalesOrderFromDraftNum && (
        <Draggable handle=".header">
          <div
            className="container bg-white"
            style={{
              border: "1px solid #ccc",
              position: "absolute",
              zIndex: 2,
              top: "5%",
              left: "15%",
              transform: "translate(-50%, -50%)",
              borderBottom: "solid 2px #F0AB00",
            }}
          >
            <div
              className="header grid grid-cols-2 p-2 text-left windowheader"
              style={{
                cursor: "move",
                borderBottom: "solid 2px #F0AB00",
              }}
            >
              <div className="">Sales Order ({headerStatus})</div>
              <div className="text-right">
                <span
                  className="text-md text-red-600 cursor-pointer"
                  onClick={() => setShowSalesOrderFromDraftNum(false)}
                >
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <SalesOrderOriginator
                userData={userData_props}
                userBranchID={userBranchID_props}
                userWarehouseData={userWarehouseData_props}
                userPriceListNumData={userPriceListNumData_props}
                userIDData={userIDData_props}
                DraftNumber_props={draftNumString}
              />
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default OriginatorNotificationList;
