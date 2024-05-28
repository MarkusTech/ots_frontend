import React from "react";

const page = () => {
  return (
    <div className="container mx-auto">
      <div className="tableHeigthView overflow-y-auto">
        <table className="w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Approval Type ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Approval Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-blue-100 cursor-pointer transition-colors">
              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                00001
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                Below Standard Discounting
              </td>
            </tr>
            <tr className="hover:bg-blue-100 cursor-pointer transition-colors">
              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                00002
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                Below Cost
              </td>
            </tr>
            <tr className="hover:bg-blue-100 cursor-pointer transition-colors">
              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                00003
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                Over Credit
              </td>
            </tr>
            <tr className="hover:bg-blue-100 cursor-pointer transition-colors">
              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                00004
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                PO Issuance from PDC
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
