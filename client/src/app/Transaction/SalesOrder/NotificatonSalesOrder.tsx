import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

interface Props {
  DraftNumber: number;
}

interface HeaderData {}

interface DeatilsData {}

const NotificationSalesOrder: React.FC<Props> = ({ DraftNumber }) => {
  const [headerData, setHeaderData] = useState("");
  const [detailsData, setDetailsData] = useState("");

  useEffect(() => {
    if (DraftNumber) {
      axios
        .get(
          `http://172.16.10.169:5000/api/v1/approval-summary/sales-order/${DraftNumber}`
        )
        .then((response) => {
          response.data.data;
        });
    }
  });

  const sampleButton = () => {
    console.log(DraftNumber);
  };

  return (
    <>
      <div className="salesbody p-2 text-sm rounded-md flex gap-40 container overflow-x-auto shadow-lg">
        <div className="flex flex-wrap gap-5 col1 mr-3">
          {/* First Column */}
          <div>
            <div className="grid grid-cols-2">
              <label htmlFor="CustomerCode">Customer Code</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value="12345"
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="CustomerName">Customer Name</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value="John Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="foreignName">Foreign Name</label>
              <div>
                <input type="text" readOnly value="Juan Pérez" />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="WalkInName">Walk-in Customer Name</label>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="ShippingAdd">Customer Shipping Address</label>
              <div>
                <input type="text" value="123 Main St." />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="TIN">Customer TIN</label>
              <div>
                <input type="text" value="123-456-789" />
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div>
            <div className="grid grid-cols-2">
              <label htmlFor="Reference">Customer Reference</label>
              <div>
                <input type="text" value="Ref123" />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Branch</label>
              <div>
                <input type="text" readOnly value="Main Branch" />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Document Status</label>
              <div>
                <input type="text" readOnly value="Approved" />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Base Document</label>
              <div>
                <input type="text" readOnly value="Base123" />
              </div>
            </div>
          </div>
        </div>

        {/* Third Column */}
        <div className="col1">
          <div className="grid grid-cols-2">
            <label htmlFor="documentnumber">Document Number</label>
            <div>
              <input type="text" value="DOC123" />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="draftNumber">Draft Number</label>
            <div>
              <input type="text" readOnly value="DRFT001" />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Entry Number</label>
            <div>
              <input type="text" readOnly value="ENT789" />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="docdate">Document Date</label>
            <div>
              <input type="text" readOnly value="2024-09-17" />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="postDate">Posting Date</label>
            <div>
              <input type="text" readOnly value="2024-09-18" />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="deliveryDate">Delivery Date</label>
            <div>
              <input type="date" id="deliveryDate" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="fields mt-2 rounded-md text-left container bg-white overflow-x-auto shadow-xl p-2 max-h-[200px]">
        <div>
          <table>
            <thead className="tables">
              <tr>
                <th></th>
                <th>Item Codes</th>
                <th>Item Name</th>
                <th>Unit of Measure (UOM)</th>
                <th>UOM Conversion</th>
                <th>Exclude BO</th>
                <th>Warehouse</th>
                <th>Quantity</th>
                <th>Inventory Status</th>
                <th>Price</th>
                <th>Selling Price before Discount</th>
                <th>Discount Rate (%)</th>
                <th>Mode of Releasing</th>
                <th>Trucker for Dropship/Back-order</th>
                <th>Pick up Location</th>
                <th>Selling Price after Discount</th>
                <th>Standard Price Discount</th>
                <th>Lower Bound</th>
                <th>Tax Code</th>
                <th>Tax Rate %</th>
                <th>Tax Amount</th>
                <th>Below Vol. Disc. Price</th>
                <th>Cost</th>
                <th>Below Cost</th>
                <th>SC/PWD Discount (Y/N)</th>
                <th>Gross Total</th>
              </tr>
            </thead>
            <tbody>{/* Table rows go here */}</tbody>
          </table>
        </div>
      </div>

      {/* Bottom Form */}
      <div className="text-left p-2 grid grid-cols-2 col1 text-[14px] mt-5">
        <div className="w-[300px]">
          <div className="grid grid-cols-2">
            <label htmlFor="modeofpayment">Mode of Payment:</label>
            <div>
              <div className="flex justify-start gap-2">
                <input type="checkbox" className="w-[20px]" />
                Cash
              </div>
              <div className="flex justify-start gap-2">
                <input type="checkbox" className="w-[20px]" />
                Credit Card
              </div>
              <div className="flex justify-start gap-2">
                <input type="checkbox" className="w-[20px]" />
                Debit Card
              </div>
              <div className="flex justify-start gap-2">
                <input type="checkbox" className="w-[20px]" />
                PDC
              </div>
              <div className="flex justify-start gap-2">
                <input type="checkbox" className="w-[20px]" />
                PO
              </div>
              <div className="flex justify-start gap-2">
                <input type="checkbox" className="w-[20px]" />
                Dated Check
              </div>
              <div className="flex justify-start gap-2">
                <input type="checkbox" className="w-[20px]" />
                Online Transfer
              </div>
              <div className="flex justify-start gap-2">
                <input type="checkbox" className="w-[20px]" />
                On Account
              </div>
              <div className="flex justify-start gap-2">
                <input type="checkbox" className="w-[20px]" />
                Cash on Delivery
              </div>
            </div>
          </div>
          {/* Mode of Releasing */}
          <div className="grid grid-cols-2">
            <label htmlFor="moderel">Mode of Releasing</label>
            <div>
              <select className="selections">
                <option value="" disabled selected>
                  Please Select
                </option>
                <option value="Standard-Pick-up">Standard-Pick-up</option>
                <option value="Standard-Delivery">Standard-Delivery</option>
                <option value="Back Order-Pick-up">Back Order-Pick-up</option>
                {/* Add other options */}
              </select>
            </div>
          </div>
          {/* Other Fields */}
          <div className="grid grid-cols-2">
            <label htmlFor="contactnumber">Contact Person Number:</label>
            <div>
              <input type="text" />
            </div>
          </div>
          <button onClick={sampleButton}>ALERT</button>
        </div>
      </div>
    </>
  );
};

export default NotificationSalesOrder;
