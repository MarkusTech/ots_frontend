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
            <TableRow className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <TableCell className="p-3 font-semibold">User ID</TableCell>
              <TableCell className="p-3 font-semibold">Full Name</TableCell>
              <TableCell className="p-3 font-semibold">Position</TableCell>
              <TableCell className="p-3 font-semibold">Branch ID</TableCell>
              <TableCell className="p-3 font-semibold">Branch Name</TableCell>
              <TableCell className="p-3 font-semibold">
                Warehouse Code
              </TableCell>
              <TableCell className="p-3 font-semibold">
                Price List Number
              </TableCell>
              <TableCell className="p-3 font-semibold">Username</TableCell>
              <TableCell className="p-3 font-semibold">Password</TableCell>
              <TableCell className="p-3 font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User, index: number) => (
              <TableRow
                key={index}
                className="bg-white hover:bg-gray-100 transition-colors"
              >
                <TableCell className="p-3">{user.userId}</TableCell>
                <TableCell className="p-3">{user.fullName}</TableCell>
                <TableCell className="p-3">{user.position}</TableCell>
                <TableCell className="p-3">{user.branchID}</TableCell>
                <TableCell className="p-3">{user.branchName}</TableCell>
                <TableCell className="p-3">{user.warehouseCode}</TableCell>
                <TableCell className="p-3">{user.priceListNumber}</TableCell>
                <TableCell className="p-3">{user.username}</TableCell>
                <TableCell className="p-3">{user.password}</TableCell>
                <TableCell className="p-3 flex justify-center items-center">
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
