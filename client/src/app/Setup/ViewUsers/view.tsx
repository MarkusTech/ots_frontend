import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";

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

  return (
    <div className="container mx-auto">
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
              Password
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.UserID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.EmpName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.Position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.BranchID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.BranchName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.WhsCode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.PriceListNum}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.UserName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.Password}
              </td>
              <td className="px-12 py-4 whitespace-nowrap text-right text-sm font-medium">
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
      {showEdit && (
        <div>
          <div>WennWorks</div>
        </div>
      )}
    </div>
  );
};

export default ViewPage;
