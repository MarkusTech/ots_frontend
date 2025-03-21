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

interface DetailData {
  LineID: string;
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
  PickUpLocation: string | null;
}

const NotificationSalesOrder: React.FC<Props> = ({ DraftNumber }) => {
  const [headerData, setHeaderData] = useState<HeaderData[]>([]);
  const [detailsData, setDetailsData] = useState<DetailData[]>([]);
  const [isCash, setIsCash] = useState<boolean>(false);
  const [isCreditCard, setIsCreditCard] = useState<boolean>(false);
  const [isDebitCard, setIsDebitCard] = useState<boolean>(false);
  const [isPdc, setIsPdc] = useState<boolean>(false);
  const [isPo, setIsPo] = useState<boolean>(false);
  const [isOnlineTransfer, setIsOnlineTransfer] = useState<boolean>(false);
  const [isOnAccount, setIsOnAccount] = useState<boolean>(false);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState<boolean>(false);

  useEffect(() => {
    if (DraftNumber) {
      axios
        .get(
          `http://172.16.10.169:5000/api/v1/approval-summary/sales-order/${DraftNumber}`
        )
        .then((response) => {
          console.log(response.data.headerData);

          // Ensure the data exists before setting state
          const headerResult = response.data.headerData;
          const detailsResult = response.data.detailsData;

          if (headerResult && detailsResult) {
            setHeaderData([headerResult]); // set headerData as an array
            setDetailsData(detailsResult);

            const validation = headerResult;

            // Validation for different payment types
            setIsCash(validation.Cash === "Y");
            setIsCreditCard(validation.CreditCard === "Y");
            setIsDebitCard(validation.DebitCard === "Y");
            setIsPo(validation.ODC === "Y");
            setIsPdc(validation.PDC === "Y");
            setIsOnlineTransfer(validation.OnlineTransfer === "Y");
            setIsOnAccount(validation.OnAccount === "Y");
            setIsCashOnDelivery(validation.COD === "Y");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [DraftNumber]);

  if (!headerData || headerData.length === 0) return <div>Loading...</div>;

  // Access the selected item in headerData array
  const [headerItem] = headerData;

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
                  className="bg-slate-200"
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
                  className="bg-slate-200"
                  readOnly
                  value={headerItem.WalkInName || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="ShippingAdd">Customer Shipping Address</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value={headerItem.ShippingAdd || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="TIN">Customer TIN</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value={headerItem.TIN || ""}
                />
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div>
            <div className="grid grid-cols-2">
              <label htmlFor="Reference">Customer Reference</label>
              <div>
                <input
                  type="text"
                  readOnly
                  className="bg-slate-200"
                  value={headerItem.Reference || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Branch</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value={headerItem.Branch || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Document Status</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value={headerItem.DocStat || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Base Document</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value={headerItem.BaseDoc || ""}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Third Column */}
        <div className="col1">
          <div className="grid grid-cols-2">
            <label htmlFor="documentnumber">Document Number</label>
            <div>
              <input
                type="text"
                className="bg-slate-200"
                readOnly
                value={headerItem.DocNum || ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="draftNumber">Draft Number</label>
            <div>
              <input
                type="text"
                className="bg-slate-200"
                readOnly
                value={headerItem.DraftNum || ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Entry Number</label>
            <div>
              <input
                type="text"
                className="bg-slate-200"
                readOnly
                value={headerItem.EntryNum || ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="docdate">Document Date</label>
            <div>
              <input
                type="text"
                className="bg-slate-200"
                readOnly
                value={
                  headerItem.DocDate
                    ? new Date(headerItem.DocDate).toLocaleDateString("en-US")
                    : ""
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2">
            <label htmlFor="postDate">Posting Date</label>
            <div>
              <input
                type="text"
                className="bg-slate-200"
                readOnly
                value={
                  headerItem.PostingDate
                    ? new Date(headerItem.PostingDate).toLocaleDateString(
                        "en-US"
                      )
                    : ""
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="deliveryDate">Delivery Date</label>
            <div>
              <input
                type="text"
                className="bg-slate-200"
                id="deliveryDate"
                readOnly
                value={
                  headerItem.DeliveryDate
                    ? new Date(headerItem.DeliveryDate).toLocaleDateString(
                        "en-US"
                      )
                    : ""
                }
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
            <tbody>
              {detailsData.map((item) => (
                <tr key={item.LineID}>
                  <td>{item.ItemCode}</td>
                  <td>{item.ItemName}</td>
                  <td>{item.UoM}</td>
                  <td>{item.UoMConv}</td>
                  <td>{item.BelPriceDisc}</td>
                  <td>{item.Whse}</td>
                  <td>{item.Quantity}</td>
                  <td>{item.InvStat}</td>
                  <td>
                    {item.PriceDisc
                      ? `₱${Number(item.PriceDisc).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : ""}
                  </td>
                  <td>
                    {item.SellPriceBefDisc
                      ? `₱${Number(item.SellPriceBefDisc).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : ""}
                  </td>

                  <td>{item.DiscRate}</td>
                  <td>{item.ModeReleasing}</td>
                  <td>{item.TruckerForDropShipOrBackOrder}</td>
                  <td>{item.PickUpLocation}</td>
                  <td>
                    {item.SellPriceAftDisc
                      ? `₱${Number(item.SellPriceAftDisc).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : ""}
                  </td>
                  <td>
                    {item.SellPriceAftDisc
                      ? `₱${Number(item.SellPriceAftDisc).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : ""}
                  </td>
                  <td>
                    {item.LowerBound
                      ? `₱${Number(item.LowerBound).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : ""}
                  </td>

                  <td>{item.TaxCode}</td>
                  <td>{item.TaxCodePerc}</td>
                  <td>
                    {item.TaxAmt
                      ? `₱${Number(item.TaxAmt).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : ""}
                  </td>
                  <td>
                    {item.PriceDisc
                      ? `₱${Number(item.PriceDisc).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : ""}
                  </td>
                  <td>
                    {item.Cost
                      ? `₱${Number(item.Cost).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : ""}
                  </td>

                  <td>{item.BelCost}</td>
                  <td>{item.SCPWDdisc}</td>
                  <td>
                    {item.GrossTotal
                      ? `₱${Number(item.GrossTotal).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Form */}
      <div className="text-left p-2 grid grid-cols-2 col1 text-[14px] mt-5">
        <div className="w-[300px] ">
          <div className="grid grid-cols-2">
            {/* ------------------------ Mode of Payment! ------------------------- */}
            <label htmlFor="modeofpayment">Mode of Payment:</label>
            <div className="">
              <div className="flex justify-start gap-2 w-[100px]">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  readOnly
                  checked={isCash}
                />
                Cash
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  readOnly
                  checked={isCreditCard}
                />
                Credit Card
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  readOnly
                  checked={isDebitCard}
                />
                Debit Card
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  readOnly
                  checked={isPdc}
                />
                PDC
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  readOnly
                  checked={isPo}
                />
                PO
              </div>
              <div className="flex justify-start gap-2 w-[200px]">
                <input className="w-[20px]" type="checkbox" readOnly />
                Dated Check
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  readOnly
                  checked={isOnlineTransfer}
                />
                Online Transfer
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  readOnly
                  checked={isOnAccount}
                />
                On Account
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  readOnly
                  checked={isCashOnDelivery}
                />
                Cash on Delivery
              </div>
            </div>
          </div>
          {/* End of mode of payment */}

          <div className="grid grid-cols-2">
            <label htmlFor="salescrew">Sales Crew</label>
            <div>
              <input
                type="text"
                className="bg-slate-200"
                readOnly
                value={headerItem.SalesCrew}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="remarks">Remarks</label>
            <div>
              <textarea
                name="remarks"
                className="bg-slate-200"
                id="remarks"
                value={headerItem.Remarks}
              ></textarea>
            </div>
          </div>
        </div>

        {/* ----------------------------- Calculation ------------------------- */}
        <div className="text-right w-full grid justify-end">
          <div className="w-[440px] ">
            <div className="grid grid-cols-2 text-right">
              <label htmlFor="totAmountBefVat" className="text-right">
                Total Amount Before VAT
              </label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value={
                    headerItem.TotalAmtBefTax
                      ? `₱${Number(headerItem.TotalAmtBefTax).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : ""
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="totalVat">Total VAT</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value={
                    headerItem.TotalTax
                      ? `₱${Number(headerItem.TotalTax).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : ""
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="totalAftVat">Total After VAT</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value={
                    headerItem.TotalAmtAftTax
                      ? `₱${Number(headerItem.TotalAmtAftTax).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : ""
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="PwdDisTotal">SC/PWD Discount Total</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value={
                    headerItem.SCPWDDiscTotal
                      ? `₱${Number(headerItem.SCPWDDiscTotal).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : "₱0.00"
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="totAmtDue">Total Amount Due</label>
              <div>
                <input
                  type="text"
                  className="bg-slate-200"
                  readOnly
                  value={
                    headerItem.TotalAmtDue
                      ? `₱${Number(headerItem.TotalAmtDue).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : ""
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------- End Calculation ------------------------- */}
      </div>
    </>
  );
};

export default NotificationSalesOrder;
