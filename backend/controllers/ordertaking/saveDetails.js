import sqlConn from "../../config/db.js";
import sql from "mssql";

const saveDetails = async (req, res) => {
  const {
    DraftNum,
    ItemCode,
    ItemName,
    Quantity,
    Uom,
    UomConv,
    Whse,
    InvStat,
    SellPriceBefDisc,
    DiscRate,
    SellPriceAftDisc,
    LowerBound,
    TaxCode,
    TaxCodePerc,
    TaxAmt,
    PriceDisc,
    BelPriceDisc,
    Cost,
    BelCost,
    ModeReleasing,
    SCPWDdisc,
    GrossTotal,
    TruckerForDropShipOrBackOrder,
    PickUpLocation,
  } = req.body;

  try {
    const pool = await sqlConn;
    const request = pool.request();

    request.input("DraftNum", sql.NVarChar, DraftNum);
    request.input("ItemCode", sql.NVarChar, ItemCode);
    request.input("ItemName", sql.NVarChar, ItemName);
    request.input("Quantity", sql.Int, Quantity);
    request.input("UoM", sql.NVarChar, Uom);
    request.input("UoMConv", sql.Int, UomConv);
    request.input("Whse", sql.NVarChar, Whse);
    request.input("InvStat", sql.NVarChar, InvStat);
    request.input("SellPriceBefDisc", sql.Decimal, SellPriceBefDisc);
    request.input("DiscRate", sql.Decimal, DiscRate);
    request.input("SellPriceAftDisc", sql.Decimal, SellPriceAftDisc);
    request.input("LowerBound", sql.Decimal, LowerBound);
    request.input("TaxCode", sql.NVarChar, TaxCode);
    request.input("TaxCodePerc", sql.Decimal, TaxCodePerc);
    request.input("TaxAmt", sql.Decimal, TaxAmt);
    request.input("PriceDisc", sql.Decimal, PriceDisc);
    request.input("BelPriceDisc", sql.NVarChar, BelPriceDisc);
    request.input("Cost", sql.Decimal, Cost);
    request.input("BelCost", sql.NVarChar, BelCost);
    request.input("ModeReleasing", sql.NVarChar, ModeReleasing);
    request.input("SCPWDdisc", sql.NVarChar, SCPWDdisc);
    request.input("GrossTotal", sql.Decimal, GrossTotal);
    request.input(
      "TruckerForDropShipOrBackOrder",
      sql.NVarChar,
      TruckerForDropShipOrBackOrder
    );
    request.input("PickUpLocation", sql.NVarChar, PickUpLocation);

    const result = await request.query(`
      INSERT INTO [dbo].[SO_Details]
             ([DraftNum]
             ,[ItemCode]
             ,[ItemName]
             ,[Quantity]
             ,[UoM]
             ,[UoMConv]
             ,[Whse]
             ,[InvStat]
             ,[SellPriceBefDisc]
             ,[DiscRate]
             ,[SellPriceAftDisc]
             ,[LowerBound]
             ,[TaxCode]
             ,[TaxCodePerc]
             ,[TaxAmt]
             ,[PriceDisc]
             ,[BelPriceDisc]
             ,[Cost]
             ,[BelCost]
             ,[ModeReleasing]
             ,[SCPWDdisc]
             ,[GrossTotal]
             ,[TruckerForDropShipOrBackOrder]
             ,[PickUpLocation])
       VALUES
             (@DraftNum
             ,@ItemCode
             ,@ItemName
             ,@Quantity
             ,@UoM
             ,@UoMConv
             ,@Whse
             ,@InvStat
             ,@SellPriceBefDisc
             ,@DiscRate
             ,@SellPriceAftDisc
             ,@LowerBound
             ,@TaxCode
             ,@TaxCodePerc
             ,@TaxAmt
             ,@PriceDisc
             ,@BelPriceDisc
             ,@Cost
             ,@BelCost
             ,@ModeReleasing
             ,@SCPWDdisc
             ,@GrossTotal
             ,@TruckerForDropShipOrBackOrder
             ,@PickUpLocation)
    `);

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({
        success: false,
        message: "Unable to save data",
      });
    } else {
      const data = result.recordset;
      res.status(200).json({
        success: true,
        message: "Data Saved Successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { saveDetails };
