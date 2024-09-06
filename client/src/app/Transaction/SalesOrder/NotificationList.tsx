import React from "react";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";

const NotificationList = () => {
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
          <div>Notification List List</div>
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
                    <th>Customer Name</th>
                    <th>Total Amount</th>
                    <th>Remarks</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default NotificationList;
