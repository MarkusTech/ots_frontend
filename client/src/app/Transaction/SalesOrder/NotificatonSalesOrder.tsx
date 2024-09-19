import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

interface Props {
  DraftNumber: number;
}

interface HeaderData {
  EntryNum: string;
  DocNum: number;
  DraftNum: number;
  PostingDate: string;
  DocDate: string;
  DeliveryDate: string;
  CustomerCode: string;
  CustomerName: string;
  WalkInName: string;
  ShippingAdd: string;
  TIN: string;
  Reference: string;
  SCPWDIdNo: string;
  Branch: number;
  DocStat: string;
  BaseDoc: number;
  Cash: string;
  CreditCard: string;
  DebitCard: string;
  ODC: string;
  PDC: string;
  OnlineTransfer: string;
  OnAccount: string;
  COD: string;
  TotalAmtBefTax: number;
  TotalTax: number;
  TotalAmtAftTax: number;
  SCPWDDiscTotal: number;
  TotalAmtDue: number;
  Remarks: string;
  SalesCrew: string;
  ForeignName: string;
  ApprovalStat: number;
  CreatedBy: string;
  DateCreated: string;
  UpdatedBy: number;
  DateUpdated: Date;
  Synced: string;
}

interface DeatilsData {
  LineID: number;
  DraftNum: string;
  ItemCode: string;
  ItemName: string;
  Quantity: number;
  UoM: string;
  UoMConv: number;
  Whse: string;
  InvStat: string;
  SellPriceBefDisc: number;
  DiscRate: number;
  SellPriceAftDisc: number;
  LowerBound: number;
  TaxCode: string;
  TaxCodePerc: number;
  TaxAmt: number;
  PriceDisc: number;
  BelPriceDisc: string;
  Cost: number;
  BelCost: string;
  ModeReleasing: string;
  SCPWDdisc: string;
  GrossTotal: number;
  TruckerForDropShipOrBackOrder: string;
  PickUpLocation: string;
}

const NotificationSalesOrder: React.FC<Props> = ({ DraftNumber }) => {
  const [headerData, setHeaderData] = useState<HeaderData[]>([]);
  const [detailsData, setDetailsData] = useState<DeatilsData[]>([]);

  useEffect(() => {
    if (DraftNumber) {
      axios
        .get(
          `http://172.16.10.169:5000/api/v1/approval-summary/sales-order/${DraftNumber}`
        )
        .then((response) => {
          const headerResult = response.data.headerResult.recordset;
          setHeaderData(headerResult);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [DraftNumber]);

  if (headerData.length === 0) return <div>Loading...</div>;

  // Access the Seleted item in headerData array
  const [headerItem] = headerData;

  const sampleButton = () => {
    console.log(headerData);
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
                  value={headerItem.CustomerCode || ""}
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
                  value={headerItem.CustomerName || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="foreignName">Foreign Name</label>
              <div>
                <input
                  type="text"
                  readOnly
                  value={headerItem.ForeignName || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="WalkInName">Walk-in Customer Name</label>
              <div>
                <input
                  type="text"
                  readOnly
                  value={headerItem.WalkInName || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="ShippingAdd">Customer Shipping Address</label>
              <div>
                <input type="text" value={headerItem.ShippingAdd || ""} />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="TIN">Customer TIN</label>
              <div>
                <input type="text" value={headerItem.TIN || ""} />
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div>
            <div className="grid grid-cols-2">
              <label htmlFor="Reference">Customer Reference</label>
              <div>
                <input type="text" value={headerItem.Reference || ""} />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Branch</label>
              <div>
                <input type="text" value={headerItem.Branch || ""} />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Document Status</label>
              <div>
                <input type="text" value={headerItem.DocStat || ""} />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Base Document</label>
              <div>
                <input type="text" value={headerItem.BaseDoc || ""} />
              </div>
            </div>
          </div>
        </div>

        {/* Third Column */}
        <div className="col1">
          <div className="grid grid-cols-2">
            <label htmlFor="documentnumber">Document Number</label>
            <div>
              <input type="text" value={headerItem.DocNum || ""} />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="draftNumber">Draft Number</label>
            <div>
              <input type="text" value={headerItem.DraftNum || ""} />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Entry Number</label>
            <div>
              <input type="text" value={headerItem.EntryNum || ""} />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="docdate">Document Date</label>
            <div>
              <input type="text" value={headerItem.DocDate || ""} />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="postDate">Posting Date</label>
            <div>
              <input
                type="text"
                readOnly
                value={headerItem.PostingDate || ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="deliveryDate">Delivery Date</label>
            <div>
              <input
                type="date"
                id="deliveryDate"
                value={headerItem.DeliveryDate || ""}
              />
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
