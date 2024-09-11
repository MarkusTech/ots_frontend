import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Draggable from "react-draggable";

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

const NotificationList = () => {
  const [notifications, setNotifications] = useState<NotificationArr[]>([]);
  const [status, setStatus] = useState<string>("");

  // Fetch the API data using useEffect and axios
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://172.16.10.169:5000/api/v1/approval-summary"
        );
        setNotifications(response.data.data); // Assuming the data is inside the 'data' property
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleStatusChange = (e: any) => {
    setStatus(e.target.value); // Update the state when the option changes
    alert(e.target.value);
  };

  return (
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
            <span className="cursor-pointer">❌</span>
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
                        {new Date(notification.ReqDate).toLocaleDateString()}
                      </td>
                      <td>{notification.DraftNum}</td>
                      <td>
                        {new Date(notification.DocDate).toLocaleDateString()}
                      </td>
                      <td>{notification.DocType}</td>
                      <td>{notification.CustomerName}</td>
                      <td>{notification.TotalAmtDue}</td>
                      <td>{notification.Remarks}</td>
                      <td>
                        <select
                          value={notification.Status} // Pre-select the current status
                          onChange={handleStatusChange} // Handle the status change
                          className="text-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="approve">Approve</option>
                          <option value="decline">Reject</option>
                        </select>
                      </td>
                      <td>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                          Update
                        </button>
                        <button className="ml-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
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
  );
};

export default NotificationList;
