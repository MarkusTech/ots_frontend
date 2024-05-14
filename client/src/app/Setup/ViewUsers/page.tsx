import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

// Define types for user data
interface User {
  userId: number;
  fullName: string;
  position: string;
  branchID: string;
  branchName: string;
  warehouseCode: string;
  priceListNumber: string;
  username: string;
  password: string;
}

// Sample user data array (replace with your actual user data)
const users: User[] = [
  {
    userId: 123,
    fullName: "John Doe",
    position: "Manager",
    branchID: "1234",
    branchName: "Branch A",
    warehouseCode: "WH001",
    priceListNumber: "001",
    username: "johndoe",
    password: "password",
  },
  {
    userId: 123,
    fullName: "Jane Smith",
    position: "Supervisor",
    branchID: "5678",
    branchName: "Branch B",
    warehouseCode: "WH002",
    priceListNumber: "002",
    username: "janesmith",
    password: "password123",
  },
  // Add more users as needed
];

const ViewPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <Paper className="overflow-x-auto">
        <Table className="min-w-max w-full table-auto">
          <TableHead>
            <TableRow className="bg-gray-800 text-white">
              <TableCell className="p-2">User ID</TableCell>
              <TableCell className="p-2">Full Name</TableCell>
              <TableCell className="p-2">Position</TableCell>
              <TableCell className="p-2">Branch ID</TableCell>
              <TableCell className="p-2">Branch Name</TableCell>
              <TableCell className="p-2">Warehouse Code</TableCell>
              <TableCell className="p-2">Price List Number</TableCell>
              <TableCell className="p-2">Username</TableCell>
              <TableCell className="p-2">Password</TableCell>
              <TableCell className="p-2">Actions</TableCell>{" "}
              {/* New cell for actions */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User, index: number) => (
              <TableRow
                key={index}
                className="bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <TableCell className="p-2">{user.userId}</TableCell>
                <TableCell className="p-2">{user.fullName}</TableCell>
                <TableCell className="p-2">{user.position}</TableCell>
                <TableCell className="p-2">{user.branchID}</TableCell>
                <TableCell className="p-2">{user.branchName}</TableCell>
                <TableCell className="p-2">{user.warehouseCode}</TableCell>
                <TableCell className="p-2">{user.priceListNumber}</TableCell>
                <TableCell className="p-2">{user.username}</TableCell>
                <TableCell className="p-2">{user.password}</TableCell>
                <TableCell className="p-2 flex justify-center items-center">
                  <IconButton aria-label="edit" className="focus:outline-none">
                    <EditIcon className="text-blue-500" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default ViewPage;
