import React from "react";
import SalesOrder from "./SalesOrder";

// export const getData = async () => {
//     const { data } = await axios.get(`${process.env.NEXT_PUBLIC_IP}/item`);
//     return data;
// }

export default async function page() {
//   const tableData = await getData();
  return (
    <>
        <SalesOrder />
    </>
  );
}
