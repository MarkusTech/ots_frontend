import React from "react";

const NotificatonSalesOrder = () => {
  return (
    <>
      <div className="salesbody p-2 text-sm rounded-md flex gap-40  container overflow-x-auto shadow-lg">
        <div className="w-[] flex flex-wrap gap-5 col1 mr-3">
          <div>
            <div className="grid grid-cols-2">
              <label htmlFor="CustomerCode">Customer Code</label>
              <div>
                <input type="text" className="bg-slate-200" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="CustomerName">Customer Name</label>
              <div>
                <input type="text" className="bg-slate-200" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label className="" htmlFor="foreignName">
                Foreign Name
              </label>
              <div>
                <input type="text" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label htmlFor="WalkInName">Walk-in Customer Name</label>
            </div>

            <div className="grid grid-cols-2">
              <label className="" htmlFor="ShippingAdd">
                Customer Shipping Address
              </label>
              <div>
                <input type="text" />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label className="" htmlFor="TIN">
                Customer TIN
              </label>
              <div>
                <input
                  type="text"
                  value={customerData.map((e) => e.cusLicTradNum)}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2">
              <label className="" htmlFor="Reference">
                Customer Reference
              </label>
              <div>
                <input
                  type="text"
                  value={customerReference}
                  onChange={handleCustomerChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label className="" htmlFor="entrynumber">
                Branch
              </label>
              <div>
                <input type="text" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label className="" htmlFor="entrynumber">
                Document Status
              </label>
              <div>
                <input type="text" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label className="" htmlFor="entrynumber">
                Base Document
              </label>
              <div>
                <input type="text" readOnly />
              </div>
            </div>

            {showSCPDW && (
              <div className="grid grid-cols-2">
                <label className="" htmlFor="entrynumber">
                  SC/PWD ID
                </label>
                <div>
                  <input onChange={handleScOrPwd} type="text" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-[] col1">
          <div className="grid grid-cols-2">
            <label htmlFor="documentnumber">Document Number</label>
            <div>
              <input value={docNumber !== "0" ? docNumber : 0} type="text" />
            </div>
            {/*  */}
            {/* Document Number */}
            {showDoc && (
              <Draggable>
                <div
                  className="w-[400px] h-[100px] bg-white shadow-lg"
                  style={{
                    border: "1px solid #ccc",
                    position: "absolute",
                    top: "12%",
                    left: "68.3%",
                  }}
                >
                  <div
                    className="grid grid-cols-2 p-2 text-left windowheader"
                    style={{ cursor: "move" }}
                  >
                    <div>Document Number</div>
                    <div className="text-right">
                      <span onClick={handleShowDoc} className="cursor-pointer">
                        ❌
                      </span>
                    </div>
                  </div>
                  <div className="content"></div>
                </div>
              </Draggable>
            )}
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="draftNumber">Draft Number</label>
            <div>
              <input
                type="text"
                readOnly
                value={draftNumber !== null ? draftNumber : ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Entry Number</label>
            <div>
              <input
                type="text"
                readOnly
                value={entryNumbers !== null ? entryNumbers : ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="docdate">Document Date</label>
            <div>
              <input type="text" value={todayDate} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="postDate">Posting Date</label>
            <div>
              <input type="text" value={todayDate} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="deliveryDate">Delivery Date</label>
            <div>
              <input
                type="date"
                id="deliveryDate"
                value={deliveryDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------- TABLE --------------------------------------- */}
      <div className="fields mt-2 rounded-md text-left container bg-white overflow-x-auto shadow-xl p-2 max-h-[200px]">
        <div className="">
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
                {/* <th>Vol. Disc. Price</th> */}
                <th>Below Vol. Disc. Price</th>
                <th>Cost</th>
                <th>Below Cost</th>
                <th>SC/PWD Discount (Y/N)</th>
                <th>Gross Total</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData, rowIndex) => (
                <tr className="trcus" key={rowIndex}>
                  {/* Handle Remove Row */}
                  <td>
                    <button
                      onClick={() =>
                        handleRemoveRow(rowIndex, rowData.itemCode)
                      }
                    >
                      <span className="text-md text-red-600">❌</span>
                    </button>
                  </td>
                  {/* Item Code */}
                  <td>
                    <div className="flex gap-3 justify-end">
                      <div>{rowData.itemCode}</div>
                      <div className="text-right">
                        {cardCodedata != "" && (
                          <button
                            className="bg-[#F0AB00] pr-1 pl-1"
                            onClick={() => openItemTable(rowIndex)}
                          >
                            =
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Item Name */}
                  <td>{rowData.itemName}</td>
                  {/* Unit of Measurement */}
                  <td>
                    {/* {rowData.itemCode == 0 */}
                    {rowData.itemCode == "" ? (
                      ""
                    ) : (
                      <div className="grid grid-cols-2">
                        <div>{rowData.uom}</div>
                        <div className="text-right">
                          {rowData.itemCode != "" && (
                            <button
                              onClick={() =>
                                openOUMTable(rowIndex, rowData.itemCode)
                              }
                              className="bg-[#F0AB00] pr-1 pl-1"
                            >
                              =
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  {/* UOM Conversion */}
                  <td>{rowData.uom == "" ? "" : rowData.uomConversion}</td>
                  {/* Handle Exlude BO */}
                  <td>
                    <select
                      name=""
                      onChange={(e) =>
                        handleChangeExcludeBO(e.target.value, rowIndex)
                      }
                      className="w-[100px] h-[20px]"
                    >
                      <option value="N" selected>
                        N
                      </option>
                      <option value="Y">Y</option>
                    </select>
                  </td>
                  {/* Warehouse */}
                  <td>
                    {rowData.uom == "" ? (
                      ""
                    ) : (
                      <div className="flex gap-3 justify-end">
                        <div>{rowData.location}</div>
                        <div className="text-right">
                          {rowData.uom != "" && (
                            <button
                              onClick={() =>
                                openLocationTable(
                                  rowIndex,
                                  rowData.itemCode,
                                  rowData.uom,
                                  rowData.uomConversion,
                                  rowData.itemName
                                )
                              }
                              className="bg-[#F0AB00] pr-1 pl-1"
                            >
                              =
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  {/* Quantity */}
                  <td>
                    <input
                      className="border-l-white border-t-white border-r-white"
                      type="text"
                      id="quantityInput"
                      value={
                        !isNaN(rowData.quantity) && rowData.quantity !== 0
                          ? rowData.quantity.toString()
                          : ""
                      }
                      onChange={(e) =>
                        handleQuantityChange(rowIndex, e.target.value)
                      }
                    />
                  </td>

                  {/* Inventory Status */}
                  <td
                    className={
                      rowData.quantity == 0
                        ? "bg-white"
                        : rowData.inventoryStatus === "Available"
                        ? "bg-green-200"
                        : rowData.inventoryStatus === "Out of Stocks"
                        ? "bg-red-200"
                        : ""
                    }
                  >
                    {rowData.quantity == 0 ? "" : rowData.inventoryStatus}
                  </td>
                  {/* price */}
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(rowData.price)}
                  </td>
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(
                          rowData.sellingPriceBeforeDiscount
                        )}
                  </td>
                  <td
                    className={
                      rowData.discountRate <= 0 ? "bg-red-200 " : "bg-green-200"
                    }
                  >
                    {rowData.quantity <= 0
                      ? ""
                      : parseFloat(Math.max(rowData.discountRate).toFixed(2)) <=
                        0
                      ? 0
                      : Math.max(rowData.discountRate).toFixed(2)}
                  </td>
                  {/* Mode Of Releasing */}
                  <td>
                    {rowData.quantity == 0 ? (
                      ""
                    ) : (
                      <div className="flex gap-3 justify-end">
                        <div>{rowData.modeOfReleasing}</div>
                        <div className="text-right">
                          <button
                            onClick={() => openModRelTable(rowIndex)}
                            className="bg-[#F0AB00] pr-1 pl-1"
                          >
                            =
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  {/* -------------- Tracker --------------- */}
                  <td>
                    {rowData.quantity == 0 ? (
                      ""
                    ) : (
                      <div className="flex gap-3 justify-end">
                        <div>{rowData.truckPanelORDropShip}</div>
                        <div className="text-right">
                          <button
                            onClick={() => openTruckerTable(rowIndex)}
                            className="bg-[#F0AB00] pr-1 pl-1"
                          >
                            =
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  {/* ---------------------------------------- */}
                  {/* -------------- Pick Up Location --------------- */}
                  <td>
                    {rowData.quantity == 0 ? (
                      ""
                    ) : (
                      <div className="flex gap-3 justify-end">
                        <div>{rowData.pickUpLocation}</div>
                        <div className="text-right">
                          <button
                            onClick={() => openPickUpLocation(rowIndex)}
                            className="bg-[#F0AB00] pr-1 pl-1"
                          >
                            =
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  {/* Selling Price After Discount wmr code */}
                  <td>
                    {rowData.quantity == 0 ? (
                      ""
                    ) : (
                      <input
                        className="w-[100%] border-l-white border-t-white border-r-white"
                        type="number"
                        id={rowData.itemCode}
                        onClick={(e) => changeTextBoxValue(rowIndex)}
                        onChange={(e) => handleInputChange(e, rowIndex)}
                        value={rowData.sellingPriceAfterDiscount}
                      />
                    )}
                  </td>
                  {/* Stardar Price Discount */}
                  <td>
                    <div>{localCurrency.format(rowData.priceDisc)}</div>
                  </td>
                  {/* Lower Bound */}
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(rowData.lowerBound)}
                  </td>
                  {/* tax code */}
                  <td>{rowData.taxCode} </td>
                  {/* Tax rate */}
                  <td>{rowData.taxCodePercentage}%</td>
                  {/* Tax Amount */}
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(rowData.taxAmount)}
                  </td>

                  {/* Below Volume Discount Price */}
                  <td
                    className={
                      rowData.belVolDisPrice === "Y"
                        ? "bg-red-200"
                        : rowData.belVolDisPrice === "N"
                        ? "bg-green-200"
                        : "" // No background color if neither "Y" nor "N"
                    }
                  >
                    {rowData.quantity === 0 ? "" : rowData.belVolDisPrice}
                  </td>

                  {/* Cost */}
                  <td>{Math.floor(rowData.cost).toFixed(2)}</td>
                  {/* Below Cost */}
                  <td
                    className={
                      rowData.belCost === "Y"
                        ? "bg-red-200"
                        : rowData.belCost === "N"
                        ? "bg-green-200"
                        : "" // No background color if neither "Y" nor "N"
                    }
                  >
                    {rowData.belCost}
                  </td>

                  {/* ---------------------------------------- */}

                  {/* SC/PWD Discount */}
                  <td
                    className={
                      rowData.scPwdDiscount == "N"
                        ? "bg-red-200"
                        : "bg-green-200"
                    }
                  >
                    {rowData.scPwdDiscount}
                  </td>
                  {/* Gross Total */}
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(rowData.grossTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {openItemTablePanel && (
          <Draggable>
            <div
              className="fields h-[500px] overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                width: "80%",
                top: "10%",
                left: "10%",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Item List</div>
                <div className="text-right">
                  <span onClick={openItemTable} className="cursor-pointer">
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <div>
                    Search:{" "}
                    <input
                      type="text"
                      className="mb-1"
                      value={searchTerm}
                      onChange={handleSearchItem}
                    />
                  </div>
                  <table>
                    <thead className="tables">
                      <tr>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Item Price</th>
                        <th>Availability</th>
                        <th>UOM</th>
                        <th>Num In Sale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDataItem.map((item: any, index) => (
                        // eslint-disable-next-line react/jsx-key
                        <tr className="tdcus cursor-pointer">
                          <td key={index} onClick={() => handleItemClick(item)}>
                            {item.ItemCode}
                          </td>
                          <td key={index} onClick={() => handleItemClick(item)}>
                            {item.ItemName}
                          </td>
                          <td key={index} onClick={() => handleItemClick(item)}>
                            {localCurrency.format(item.SRP)}
                          </td>
                          <td key={index} onClick={() => handleItemClick(item)}>
                            {item.Availability}
                          </td>
                          <td key={index} onClick={() => handleItemClick(item)}>
                            {item.UomCode}
                          </td>
                          <td key={index} onClick={() => handleItemClick(item)}>
                            {item.NumInSale}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        {openOUMPanel && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "45%",
                left: "35%",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Select OUM</div>
                <div className="text-right">
                  <span
                    onClick={() => closeOUMTable()}
                    className="cursor-pointer"
                  >
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <div>
                    <table>
                      <thead className="tables">
                        <tr>
                          <th>UOM</th>
                          <th>Conversion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {UOMList.map((e: any, rowIndex: any) => (
                          // eslint-disable-next-line react/jsx-key
                          <tr className="trcus cursor-pointer">
                            <td
                              className="tdcus cursor-pointer"
                              onClick={() =>
                                handleUOM(rowIndex, e.BaseQty, e.UomCode)
                              }
                            >
                              {e.UomCode}
                            </td>
                            <td
                              className="tdcus cursor-pointer"
                              onClick={() =>
                                handleUOM(rowIndex, e.BaseQty, e.UomCode)
                              }
                            >
                              {e.BaseQty}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        {/* Open Mode Of Releasing */}
        {openModRelTablePanel && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "40%",
                left: "65%",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Mode of Releasing</div>
                <div className="text-right">
                  <span onClick={openModRelTable} className="cursor-pointer">
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <table>
                    <thead className="tables">
                      <tr>
                        <th>Mode Of Releasing</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select
                            name=""
                            className="w-full p-2"
                            onChange={(e) => changeManualModRel(e.target.value)}
                          >
                            <option value="" disabled selected>
                              Please Select
                            </option>
                            <option value="Standard-Pick-up">
                              Standard-Pick-up
                            </option>
                            <option value="Standard-Delivery">
                              Standard-Delivery
                            </option>
                            <option value="Standard-Pick-up to Other Store">
                              Standard-Pick-up to Other Store
                            </option>
                            <option value="Back Order-Pick-up">
                              Back Order-Pick-up
                            </option>
                            <option value="Back Order-Delivery">
                              Back Order-Delivery
                            </option>
                            <option value="Back Order-Pick-up to Other Store">
                              Back Order-Pick-up to Other Store
                            </option>
                            <option value="Drop-Ship-Pick-up to DC">
                              Drop-Ship-Pick-up to DC
                            </option>
                            <option value="Drop-Ship-Pick-up to Vendor">
                              Drop-Ship-Pick-up to Vendor
                            </option>
                            <option value="Drop-Ship-Delivery from DC">
                              Drop-Ship-Delivery from DC
                            </option>
                            <option value="Drop-Ship-Delivery from Vendor">
                              Drop-Ship-Delivery from Vendor
                            </option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        {/* Open Trucker Table */}
        {openTruckPanel && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "40%",
                left: "65%",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Trucker for Dropship/Back-order</div>
                <div className="text-right">
                  <span onClick={openTruckerTable} className="cursor-pointer">
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <table>
                    <thead className="tables">
                      <tr>
                        <th>Trucker for Dropship/Back-order</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select
                            name=""
                            className="w-full p-2"
                            onChange={(e) =>
                              changeManualTruckPanel(e.target.value)
                            }
                          >
                            <option value="" disabled selected>
                              Please Select
                            </option>
                            <option value="N/A">N/A</option>
                            <option value="Customer">Customer</option>
                            <option value="Store">Store</option>
                            <option value="Vendor">Vendor</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        {/* Open Pick Up Location Panel */}
        {openPickUpLocations && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "40%",
                left: "65%",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Pick Up Location</div>
                <div className="text-right">
                  <span onClick={openPickUpLocation} className="cursor-pointer">
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <table>
                    <thead className="tables">
                      <tr>
                        <th>Pick Up Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select
                            name=""
                            className="w-full p-2"
                            onChange={(e) =>
                              changeManualPickUpLocation(e.target.value)
                            }
                          >
                            <option value="" disabled selected>
                              Please Select
                            </option>
                            <option value="SEL">SEL - Selling Area</option>
                            <option value="STG">STG - Storage</option>
                            <option value="WHS">WHS - Wharehouse</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        {/* Open Location Panel */}
        {openLocationPanel && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "40%",
                left: "20%",
                height: "300px",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Warehouse</div>
                <div className="text-right">
                  <span
                    onClick={() => closeLocationTable()}
                    className="cursor-pointer"
                  >
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <div>
                    <div className="mb-2 text-[13px] flex gap-5">
                      <div>
                        Item Code:{" "}
                        <span className="underline">{itemcodewh}</span>
                      </div>
                      <div>
                        Item Name:{" "}
                        <span className="underline">{itemnamews}</span>
                      </div>
                      <div>
                        UOM: <span className="underline">{itemuomws}</span>
                      </div>
                    </div>
                    <table>
                      <thead className="tables">
                        <tr>
                          <th>Warehouse Code</th>
                          <th>Warehouse Name</th>
                          <th>Availability</th>
                          <th>On-hand</th>
                          <th>Commited</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WareHouseList.map((item: any, index) => (
                          // eslint-disable-next-line react/jsx-key
                          <tr className="tdcus">
                            <td
                              key={index}
                              onClick={(e) =>
                                handleWarehouseChange(item.WhsCode)
                              }
                            >
                              {item.WhsCode}
                            </td>
                            <td
                              key={index}
                              onClick={(e) =>
                                handleWarehouseChange(item.WhsCode)
                              }
                            >
                              {item.WhsName}
                            </td>
                            <td
                              key={index}
                              onClick={(e) =>
                                handleWarehouseChange(item.WhsCode)
                              }
                            >
                              {item.Availability}
                            </td>
                            <td
                              key={index}
                              onClick={(e) =>
                                handleWarehouseChange(item.WhsCode)
                              }
                            >
                              {item.OnHand}
                            </td>
                            <td
                              key={index}
                              onClick={(e) =>
                                handleWarehouseChange(item.WhsCode)
                              }
                            >
                              {item.Committed}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        {/* Approval Procedure Summary */}
        {appProcSummary && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "40%",
                left: "20%",
                height: "300px",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>{approvalTitle}</div>
                <div className="text-right">
                  <span
                    onClick={() => closeAppProcSummary()}
                    className="cursor-pointer"
                  >
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div>
                  {/* remarks */}
                  <label htmlFor="remarks" className="block mb-2">
                    Remarks:
                  </label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    className="p-2 border rounded w-full"
                    placeholder="Enter your remarks here"
                    rows={4}
                    style={{ minHeight: "80px" }} // Adjust the height as needed
                    value={approvalSummaryRemarks} // Bind the textarea value to the state
                    onChange={(e) => setApprovalSummaryRemarks(e.target.value)} // Update the state on change
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSubmitAppProSum}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </Draggable>
        )}
      </div>
      {/* ----------------------------------------------------- End of Table ----------------------------------------------- */}

      <div className="text-left ml-2">
        {cardCodedata != "" && (
          <button
            onClick={() => handleAddRow()}
            className="p-1 mt-2 mb-1 text-[12px] bg-[#f69629]"
          >
            <span>+</span> Add Row
          </button>
        )}
      </div>

      {/* --------------------------------------------------- Bottom Form-------------------------------------------------------- */}
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
                  checked={isCheckedCash}
                  onChange={handCash}
                  disabled={ccstatus}
                />
                Cash
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedCreditCard}
                  onChange={handleCreditCard}
                  disabled={ccstatus}
                />
                Credit Card
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedDebit}
                  onChange={handleDebit}
                  disabled={ccstatus}
                />
                Debit Card
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedPDC}
                  onChange={handlePDC}
                  disabled={ccstatus}
                />
                PDC
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedPO}
                  onChange={handlePO}
                  disabled={ccstatus}
                />
                PO
              </div>
              <div className="flex justify-start gap-2 w-[200px]">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedDatedCheck}
                  onChange={handleDatedCheck}
                  disabled={ccstatus}
                />
                Dated Check
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedOnlineTransfer}
                  onChange={handlOnlineTransfer}
                  disabled={ccstatus}
                />
                Online Transfer
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedOnAccount}
                  onChange={handleOnAccount}
                  disabled={ccstatus}
                />
                On Account
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedCashOnDel}
                  onChange={handleCashOnDel}
                  disabled={ccstatus}
                />
                Cash on Delivery
              </div>
            </div>
          </div>
          {/* End of mode of payment */}

          <div className="grid grid-cols-2">
            <label htmlFor="moderel">Mode of Releasing</label>
            <div>
              <select
                className="selections"
                onChange={(e) => modeReleasing(e.target.value)}
                name=""
                id=""
              >
                <option value="" disabled selected>
                  Please Select
                </option>
                <option value="Standard-Pick-up">Standard-Pick-up</option>
                <option value="Standard-Delivery">Standard-Delivery</option>
                <option value="Standard-Pick-up to Other Store">
                  Standard-Pick-up to Other Store
                </option>
                <option value="Back Order-Pick-up">Back Order-Pick-up</option>
                <option value="Back Order-Delivery">Back Order-Delivery</option>
                <option value="Back Order-Pick-up to Other Store">
                  Back Order-Pick-up to Other Store
                </option>
                <option value="Drop-Ship-Pick-up to DC">
                  Drop-Ship-Pick-up to DC
                </option>
                <option value="Drop-Ship-Pick-up to Vendor">
                  Drop-Ship-Pick-up to Vendor
                </option>
                <option value="Drop-Ship-Delivery from DC">
                  Drop-Ship-Delivery from DC
                </option>
                <option value="Drop-Ship-Delivery from Vendor">
                  Drop-Ship-Delivery from Vendor
                </option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="salescrew">Sales Crew</label>
            <div>
              <select
                className="selections"
                onChange={(e) => addSalesCrews(e.target.value)}
                value={selectedSalesCrew}
                id="salescrew"
              >
                <option value="">Select a Sales Crew</option>
                {salesCrew.map((crew: any, index: any) => (
                  <option key={index} value={crew.SlpName}>
                    {crew.SlpName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="remarks">Remarks</label>
            <div>
              <textarea
                name="remarks"
                id="remarks"
                onChange={handleRemarksChange}
                value={remarksField}
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
                <input value={totalAfterVat} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="totalVat">Total VAT</label>
              <div>
                <input value={totalVat} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="totalAftVat">Total After VAT</label>
              <div>
                <input value={totalBeforeVat} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="PwdDisTotal">SC/PWD Discount Total</label>
              <div>
                <input value={SCPWDdata} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="totAmtDue">Total Amount Due</label>
              <div>
                <input value={totalAmoutDueData} type="text" readOnly />
              </div>
            </div>
          </div>
        </div>
        {/* ----------------------------- End Calculation ------------------------- */}
      </div>
      <div className="grid grid-cols-2">
        <div className="p-2 flex justify-start">
          <div className="flex space-x-2">
            <div>
              {isSaved ? (
                // Show the "Update" button when the form is saved
                <button
                  className={`p-2 mt-2 mb-1 text-[12px] ${
                    isDocNumberGreaterThanZero
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-[#F4D674] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600"
                  } rounded w-24`}
                  onClick={handleUpdate}
                  disabled={isDocNumberGreaterThanZero}
                >
                  Update draft
                </button>
              ) : (
                // Show the "Save as draft" button when the form is not saved
                <button
                  className={`p-2 mt-2 mb-1 text-[12px] ${
                    isDocNumberGreaterThanZero
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-[#f69629] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600"
                  } rounded w-24`}
                  onClick={handleSubmit}
                  disabled={isDocNumberGreaterThanZero}
                >
                  Save as draft
                </button>
              )}
            </div>

            <div>
              {isCommited ? (
                <button
                  className={`p-2 mt-2 mb-1 mr-2 text-[12px] ${
                    isDocNumberGreaterThanZero
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-[#f69629] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600"
                  } rounded w-24`}
                  onClick={handleSaveCommit}
                  disabled={isDocNumberGreaterThanZero}
                >
                  Commit
                </button>
              ) : (
                // display a sweet alert
                <button
                  className={`p-2 mt-2 mb-1 mr-2 text-[12px] ${
                    isDocNumberGreaterThanZero
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-[#f69629] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600"
                  } rounded w-24`}
                  onClick={swalCommit}
                  disabled={isDocNumberGreaterThanZero}
                >
                  Commit
                </button>
              )}
            </div>

            {/* ------------------------------------------- Print Button ------------------------------------------ */}
            <div>
              <button
                className={`p-2 mt-2 mb-1 mr-2 text-[12px] ${
                  printButtonDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#f69629] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600"
                } rounded w-24`}
                disabled={printButtonDisabled}
                onClick={PrintReceipt}
              >
                Print
              </button>
            </div>

            {/* ------------------------------------------ Search Button ---------------------------------------------- */}
            <div>
              <button
                className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-[#f69629] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600 rounded w-24"
                onClick={handleShowSearchHeader}
              >
                Search
              </button>

              <button
                className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-[#f69629] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600 rounded w-24"
                onClick={handleWennWorks}
              >
                Alert
              </button>

              {showSearchHeader && (
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
                      <div>Search</div>
                      <div className="text-right">
                        <span
                          onClick={handleShowSearchHeader}
                          className="cursor-pointer"
                        >
                          ❌
                        </span>
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
                              value={searchTerm}
                              onChange={handleSearchForDraft}
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
                              onChange={(e) => setFromDate(e.target.value)}
                            />
                            <p>:&nbsp;</p>
                            <button
                              className="p-1 mt-2 mb-1 mr-2 text-xs bg-[#f69629] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600 rounded w-24"
                              onClick={handleFilter}
                            >
                              Filter
                            </button>
                          </div>
                        </div>

                        <div className="table-container">
                          <table className="w-full">
                            <thead className="tables">
                              <tr>
                                <th>Draft Number</th>
                                <th>Customer Code</th>
                                <th>Customer Name</th>
                                <th>Walk-in Customer Name</th>
                                <th>Document Date</th>
                                <th>Sales Crew</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredSaveDraftData.map(
                                (customer: any, rowIndex) => (
                                  <tr key={rowIndex} className="tdcus">
                                    <td
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.DraftNum}
                                    </td>
                                    <td
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.CustomerCode}
                                    </td>
                                    <td
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.CustomerName}
                                    </td>
                                    <td
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.WalkInName}
                                    </td>
                                    <td
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.DocDate}
                                    </td>
                                    <td
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.CreatedBy}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </Draggable>
              )}
            </div>

            {/* End of Search Button */}
          </div>
        </div>
        <div className="p-2 flex justify-end"></div>
      </div>
    </>
  );
};

export default NotificatonSalesOrder;
