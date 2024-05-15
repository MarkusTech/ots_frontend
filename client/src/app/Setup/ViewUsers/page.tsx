import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Draggable from "react-draggable";

// Define types for user data
interface User {
  UserID: string;
  EmpName: string;
  Position: string;
  BranchID: string;
  BranchName: string;
  WhsCode: string;
  PriceListNum: string;
  UserName: string;
  Password: string;
}

const ViewPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://172.16.10.169:5001/api/v2/users");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
  };

  const handleShowAdd = () => {
    setShowAdd(!showAdd);
  };

  return (
    <div className="container mx-auto">
      {/* the css on tableHeightView is on global css */}
      <div className="tableHeigthView overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Branch ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Branch Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Warehouse Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Price List Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user: User) => (
              <tr
                key={user.UserID}
                className="hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.UserID}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.EmpName}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.Position}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.BranchID}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.BranchName}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.WhsCode}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.PriceListNum}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.UserName}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={handleShowEdit}
                  >
                    <EditIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mb-6 pt-2 px-4">
        <h2 className="text-lg font-semibold text-gray-800"></h2>
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={handleShowAdd}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM9 9V5a1 1 0 0 1 2 0v4h4a1 1 0 0 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V9z"
              clipRule="evenodd"
            />
          </svg>
          Create
        </button>
      </div>

      {/* Draggable */}
      {showEdit && (
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
              background: "white",
              zIndex: "9999", // Set a high z-index value to bring it to the front. HAHAHA
            }}
          >
            <div
              className="grid grid-cols-2 p-2 text-left windowheader"
              style={{ cursor: "move" }}
            >
              <div>Edit User</div>
              <div className="text-right">
                <span className="cursor-pointer">❌</span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">asdasd</div>
            </div>
          </div>
        </Draggable>
      )}

      {/* show add */}
      {showAdd && (
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
              background: "white",
              zIndex: "9999", // Set a high z-index value to bring it to the front. HAHAHA
            }}
          >
            <div
              className="grid grid-cols-2 p-2 text-left windowheader"
              style={{ cursor: "move" }}
            >
              <div>Select User</div>
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
                </div>

                <div className="table-container">
                  <table className="w-full">
                    <thead className="tables">
                      <tr>
                        <th>Employee Name</th>
                        <th>Position</th>
                        <th>Branch ID</th>
                        <th>Branch Name</th>
                        <th>Designated Warehouse</th>
                        <th>Price List Number</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default ViewPage;
