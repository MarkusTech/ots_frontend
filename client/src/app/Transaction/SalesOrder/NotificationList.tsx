// Notification list for approver
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import Swal from "sweetalert2";
import NotificationSalesOrder from "./NotificatonSalesOrder";

interface Props {
  userIDData: number;
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

const NotificationList: React.FC<Props> = ({ userIDData }) => {
  const [notifications, setNotifications] = useState<NotificationArr[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [showSalesOrder, setShowSalesOrder] = useState<boolean>(false);
  const [draftNum, setDraftNum] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://172.16.10.169:5000/api/v1/approver-list/${userIDData}`
        );
        setNotifications(response.data.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [userIDData]);

  const handleStatusChange = (e: any, appSummID: number) => {
    const newStatus = e.target.value;

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.AppSummID === appSummID
          ? { ...notification, Status: newStatus }
          : notification
      )
    );
  };

  const handleUpdate = async (appSummID: number) => {
    const notificationToUpdate = notifications.find(
      (notification) => notification.AppSummID === appSummID
    );

    if (!notificationToUpdate) {
      Swal.fire({
        icon: "error",
        title: "No notification found to update",
      });
      return;
    }

    // Add confirmation step before proceeding with the update
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this notification?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch(
          `http://172.16.10.169:5000/api/v1/approval-summary/${appSummID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificationToUpdate),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
        });
      } catch (error) {
        console.error("Error updating notification:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to update the notification.",
        });
      }
    } else {
      // If the user cancels the update
      Swal.fire({
        icon: "info",
        title: "Update Cancelled",
      });
    }
  };

  const handleShowView = (AppSummID: number) => {
    const selectedNotification = notifications.find(
      (notification) => notification.AppSummID === AppSummID
    );

    if (selectedNotification) {
      setDraftNum(selectedNotification.DraftNum); // Set the DraftNum in the state
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
              <div>Approval List</div>
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
                          <td>{notification.DraftNum}</td>
                          <td>
                            {new Date(
                              notification.DocDate
                            ).toLocaleDateString()}
                          </td>
                          <td>{notification.DocType}</td>
                          <td>{notification.CustomerName}</td>
                          <td>{notification.TotalAmtDue}</td>
                          <td>{notification.Remarks}</td>
                          <td>
                            <select
                              value={notification.Status}
                              onChange={(e) =>
                                handleStatusChange(e, notification.AppSummID)
                              }
                              className={`text-blue-500 ${
                                notification.Status === "Pending"
                                  ? "bg-orange-200"
                                  : notification.Status === "pending"
                                  ? "bg-orange-200"
                                  : notification.Status === "Approved"
                                  ? "bg-green-200"
                                  : notification.Status === "Decline"
                                  ? "bg-red-200"
                                  : ""
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approve</option>
                              <option value="Decline">Reject</option>
                            </select>
                          </td>

                          <td>
                            <button
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              onClick={() =>
                                handleUpdate(notification.AppSummID)
                              }
                            >
                              Update
                            </button>

                            <button
                              className="ml-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              onClick={() =>
                                handleShowView(notification.AppSummID)
                              }
                            >
                              View
                            </button>
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
              <div>Sales Order</div>
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
    </>
  );
};

export default NotificationList;
