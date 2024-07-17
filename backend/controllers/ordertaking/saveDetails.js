import sqlConn from "../../config/db.js";
import sql from "mssql";

// const saveDetails = async (req, res) => {
//   const details = req.body; // Assuming req.body is an array of objects

//   try {
//     const pool = await sqlConn;
//     const transaction = new sql.Transaction(pool);
//     await transaction.begin();

//     try {
//       for (let i = 0; i < details.length; i++) {
//         const {
//           DraftNum,
//           ItemCode,
//           ItemName,
//           Quantity,
//           UoM,
//           UoMConv,
//           Whse,
//           InvStat,
//           SellPriceBefDisc,
//           DiscRate,
//           SellPriceAftDisc,
//           LowerBound,
//           TaxCode,
//           TaxCodePerc,
//           TaxAmt,
//           PriceDisc, //recently added
//           BelPriceDisc,
//           Cost,
//           BelCost,
//           ModeReleasing,
//           SCPWDdisc,
//           GrossTotal,
//           TruckerForDropShipOrBackOrder,
//           PickUpLocation,
//         } = details[i];

//         const request = new sql.Request(transaction);

//         request.input("DraftNum", sql.NVarChar, DraftNum);
//         request.input("ItemCode", sql.NVarChar, ItemCode);
//         request.input("ItemName", sql.NVarChar, ItemName);
//         request.input("Quantity", sql.Int, Quantity);
//         request.input("UoM", sql.NVarChar, UoM);
//         request.input("UoMConv", sql.Int, UoMConv);
//         request.input("Whse", sql.NVarChar, Whse);
//         request.input("InvStat", sql.NVarChar, InvStat);
//         request.input("SellPriceBefDisc", sql.Decimal, SellPriceBefDisc);
//         request.input("DiscRate", sql.Decimal, DiscRate);
//         request.input("SellPriceAftDisc", sql.Decimal, SellPriceAftDisc);
//         request.input("LowerBound", sql.Decimal, LowerBound);
//         request.input("TaxCode", sql.NVarChar, TaxCode);
//         request.input("TaxCodePerc", sql.Decimal, TaxCodePerc);
//         request.input("TaxAmt", sql.Decimal, TaxAmt);
//         request.input("PriceDisc", sql.Decimal, PriceDisc);
//         request.input("BelPriceDisc", sql.NVarChar, BelPriceDisc);
//         request.input("Cost", sql.Decimal, Cost);
//         request.input("BelCost", sql.NVarChar, BelCost);
//         request.input("ModeReleasing", sql.NVarChar, ModeReleasing);
//         request.input("SCPWDdisc", sql.NVarChar, SCPWDdisc);
//         request.input("GrossTotal", sql.Decimal, GrossTotal);
//         request.input(
//           "TruckerForDropShipOrBackOrder",
//           sql.NVarChar,
//           TruckerForDropShipOrBackOrder
//         );
//         request.input("PickUpLocation", sql.NVarChar, PickUpLocation);

//         await request.query(`
//           INSERT INTO [dbo].[SO_Details]
//                  ([DraftNum]
//                  ,[ItemCode]
//                  ,[ItemName]
//                  ,[Quantity]
//                  ,[UoM]
//                  ,[UoMConv]
//                  ,[Whse]
//                  ,[InvStat]
//                  ,[SellPriceBefDisc]
//                  ,[DiscRate]
//                  ,[SellPriceAftDisc]
//                  ,[LowerBound]
//                  ,[TaxCode]
//                  ,[TaxCodePerc]
//                  ,[TaxAmt]
//                  ,[PriceDisc]
//                  ,[BelPriceDisc]
//                  ,[Cost]
//                  ,[BelCost]
//                  ,[ModeReleasing]
//                  ,[SCPWDdisc]
//                  ,[GrossTotal]
//                  ,[TruckerForDropShipOrBackOrder]
//                  ,[PickUpLocation])
//            VALUES
//                  (@DraftNum
//                  ,@ItemCode
//                  ,@ItemName
//                  ,@Quantity
//                  ,@UoM
//                  ,@UoMConv
//                  ,@Whse
//                  ,@InvStat
//                  ,@SellPriceBefDisc
//                  ,@DiscRate
//                  ,@SellPriceAftDisc
//                  ,@LowerBound
//                  ,@TaxCode
//                  ,@TaxCodePerc
//                  ,@TaxAmt
//                  ,@PriceDisc
//                  ,@BelPriceDisc
//                  ,@Cost
//                  ,@BelCost
//                  ,@ModeReleasing
//                  ,@SCPWDdisc
//                  ,@GrossTotal
//                  ,@TruckerForDropShipOrBackOrder
//                  ,@PickUpLocation)
//         `);
//       }

//       await transaction.commit();

//       res.status(200).json({
//         success: true,
//         message: "Data Saved Successfully",
//       });
//     } catch (error) {
//       await transaction.rollback();
//       throw error; // Rethrow the error to be caught by the outer catch block
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const saveDetails = async (req, res) => {
  const details = req.body;

  if (!Array.isArray(details)) {
    return res.status(400).json({
      success: false,
      message: "Request body must be an array of objects",
    });
  }

  try {
    const pool = await sqlConn;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      for (let i = 0; i < details.length; i++) {
        const {
          DraftNum,
          ItemCode,
          ItemName,
          Quantity,
          UoM,
          UoMConv,
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
        } = details[i];

        const request = new sql.Request(transaction);

        request.input("DraftNum", sql.NVarChar, DraftNum);
        request.input("ItemCode", sql.NVarChar, ItemCode);
        request.input("ItemName", sql.NVarChar, ItemName);
        request.input("Quantity", sql.Int, Quantity);
        request.input("UoM", sql.NVarChar, UoM);
        request.input("UoMConv", sql.Int, UoMConv);
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

        await request.query(`
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
      }

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Data Saved Successfully",
      });
    } catch (error) {
      await transaction.rollback();
      throw error; // Rethrow the error to be caught by the outer catch block
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteDetails = async (req, res) => {
  const { DraftNum } = req.params;

  try {
    const result = await sqlConn.query(
      `DELETE FROM [OTS_DB].[dbo].[SO_Details] WHERE DraftNum = '${DraftNum}';`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Cannot Find Data",
      });
    }

    const data = result.recordset;
    res.status(200).json({
      success: true,
      message: "Data successfully deleted",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { saveDetails, deleteDetails };
