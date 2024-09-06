import React from "react";
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
            <div className="flex items-center">
              <div>
                Search:{" "}
                <input
                  type="text"
                  className="mb-1"
                  // value={searchTerm}
                  // onChange={handleSearchForDraft}
                />
              </div>
              <div className="flex-grow"></div>
              <div className="flex items-center">
                <label htmlFor="fromDate" className="mr-2">
                  Filter By Date:
                </label>
                <input
                  id="fromDate"
                  type="date"
                  className="w-24 md:w-32 px-2 py-1 border rounded"
                  // onChange={(e) => setFromDate(e.target.value)}
                />
                <p>:&nbsp;</p>
                <button
                  className="p-1 mt-2 mb-1 mr-2 text-xs bg-[#f69629] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600 rounded w-24"
                  // onClick={handleFilter}
                >
                  Filter
                </button>
              </div>
            </div>

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
