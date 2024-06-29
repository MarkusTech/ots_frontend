import sqlConn from "../../config/db.js";

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
    const result = await sqlConn.query(
      `INSERT INTO [dbo].[SO_Details]
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
             (${DraftNum}
             ,${ItemCode}
             ,${ItemName}
             ,${Quantity}
             ,${Uom}
             ,${UomConv}
             ,${Whse}
             ,${InvStat}
             ,${SellPriceBefDisc}
             ,${DiscRate}
             ,${SellPriceAftDisc}
             ,${LowerBound}
             ,${TaxCode}
             ,${TaxCodePerc}
             ,${TaxAmt}
             ,${PriceDisc}
             ,${BelPriceDisc}
             ,${Cost}
             ,${BelCost}
             ,${ModeReleasing}
             ,${SCPWDdisc}
             ,${GrossTotal}
             ,${TruckerForDropShipOrBackOrder}
             ,${PickUpLocation})`
    );

    if (!result) {
      console.log(error);
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
