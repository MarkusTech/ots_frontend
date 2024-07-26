import sqlConn2 from "../config/db.js";

class RetrievalController {
  // Cost
  static async cost(req, res) {
    const { itemCode, warehouseCode } = req.params;
    try {
      const result = await sqlConn2.query(
        `SELECT [BCD_TEST_DB].dbo.fn_GetCost ('${itemCode}', '${warehouseCode}') AS Cost`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find cost",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "Cost found",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  //Discount Price
  static async discountPrice(req, res) {
    const {
      brachID,
      beforeDiscount,
      cardCode,
      itemCode,
      Qty,
      UoM,
      lowerBound,
      creditCard,
      debitCard,
      PDC,
      PO,
      taxCode,
    } = req.params;
    try {
      const contextCheck = await sqlConn2.query(
        `SELECT name FROM sys.databases`
      );
      console.log("Databases:", contextCheck.recordset);

      const result =
        await sqlConn2.query(`SELECT [BCD_TEST_DB].dbo.fn_GetDiscPrice (${brachID}, ${beforeDiscount},'${cardCode}', '${itemCode}',${Qty}, '${UoM}', '${lowerBound}','${creditCard}','${debitCard}',
              '${PDC}', '${PO}','${taxCode}') AS DiscPrice`);

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find Discount Price",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "Discount Price Found",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // employee
  static async employee(req, res) {
    try {
      const result =
        await sqlConn2.query(`SELECT CONCAT(lastName, ', ', firstName) AS EmpName,
                T1.name AS Position,
                T4.BPLId,
                T4.BPLName,
                T4.DflWhs,
                (SELECT ListNum FROM [BCD_TEST_DB].dbo.OPLN WHERE ListName= CONCAT(T4.BPLName,'-Retail Price')) AS PriceListNum
         FROM [BCD_TEST_DB].dbo.OHEM T0
         INNER JOIN [BCD_TEST_DB].dbo.OHPS T1 ON T0.position=T1.posID
         INNER JOIN [BCD_TEST_DB].dbo.OUSR T2 ON T0.userId=T2.USERID
         INNER JOIN [BCD_TEST_DB].dbo.USR6 T3 ON T2.USER_CODE=T3.UserCode
         INNER JOIN [BCD_TEST_DB].dbo.OBPL T4 ON T3.BPLId=T4.BPLId 
         WHERE salesPrson > 0 AND T4.U_isDC ='N'`);

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find employee",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "Employee fetched",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // item
  static async getItemList(req, res) {
    const { priceListNum, warehouseCode, cardCode } = req.params;
    try {
      const result = await sqlConn2.query(
        `SELECT * FROM [BCD_TEST_DB].[dbo].[TVF_ITEM_DETAILS] (${priceListNum},'${warehouseCode}','${cardCode}') ORDER BY ItemName`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find Items",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "Item Feched",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Customers
  static async getCustomers(req, res) {
    try {
      const result = await sqlConn2.query(
        `SELECT CardCode, CardName, CardFName, LicTradNum, Address FROM [BCD_TEST_DB].[dbo].[OCRD] WHERE frozenFor='N' AND CardType='C' ORDER BY CardName`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find Customers",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "Customers Found!",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // lowerbound
  static async getLowerBound(req, res) {
    const { PriceListNum, taxCode, itemCode, warehouseCode, UoMQty } =
      req.params;
    try {
      const result = await sqlConn2.query(
        `SELECT [BCD_TEST_DB].dbo.fn_GetLowerBound (${PriceListNum}, '${taxCode}', '${itemCode}','${warehouseCode}', ${UoMQty}) AS LowerBound`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find Lowerbound Data",
        });
      }

      const data = result.recordset;
      res.status(200).json({
        success: true,
        message: "Lowerbound Found",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // pick up location
  static async pickUpLocation(req, res) {
    const { ItemCode, Qty, Whs } = req.params;
    try {
      const result = await sqlConn2.query(
        `SELECT [BCD_TEST_DB].dbo.fn_GetPickUpLocation('${ItemCode}', ${Qty}, '${Whs}') AS location`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find pickup location",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "Pick-up location found",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // sales crew
  static async salescrew(req, res) {
    try {
      const result = await sqlConn2.query(
        `SELECT DISTINCT T2.SlpName
        FROM [BCD_TEST_DB].dbo.OUSR T0
        INNER JOIN [BCD_TEST_DB].dbo.OUDG T1 ON T0.DfltsGroup = T1.Code
        INNER JOIN [BCD_TEST_DB].dbo.OSLP T2 ON T2.Memo = T1.Warehouse
        WHERE T0.INTERNAL_K =  29
        ORDER BY T2.SLPNAME ASC`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find Sales Crew",
        });
      }

      const data = result.recordset;
      res.status(200).json({
        success: true,
        message: "Sales Crew Fetched",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // sc-discount
  static async getScDiscount(req, res) {
    const { cardCode, itemCode } = req.params;
    try {
      const result = await sqlConn2.query(
        `SELECT [BCD_TEST_DB].dbo.[fn_CheckIfSCPWD] ('${cardCode}','${itemCode}') AS SCDiscount`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find SC-Discount",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "Sc-discount found",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // srp
  static async srp(req, res) {
    const {
      itemCode,
      ItemsPerUnit,
      UoM,
      taxCode,
      lowerbound,
      vendorCode,
      PriceListNum,
    } = req.params;
    try {
      const result = await sqlConn2.query(
        `SELECT [BCD_TEST_DB].dbo.fn_GetSRP ('${itemCode}', ${ItemsPerUnit}, '${UoM}','${taxCode}', ${lowerbound}, '${vendorCode}',${PriceListNum}) AS SRP`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find SRP",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "SRP found",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // stock-availability
  static async stockAvailability(req, res) {
    const { docNum, itemCode, warehouseCode, ordrQty, ExcludeBO } = req.params;
    try {
      const result = await sqlConn2.query(
        `SELECT [BCD_TEST_DB].dbo.fn_GetAvailability (${docNum}, '${itemCode}', '${warehouseCode}', ${ordrQty}, '${ExcludeBO}') AS StockAvailable`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find stocks",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "Stocks Availability fetched",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // tax code
  static async getTaxCode(req, res) {
    const { cardCode, warehouseCode } = req.params;
    try {
      const result = await sqlConn2.query(
        `SELECT [BCD_TEST_DB].dbo.fn_GetTaxCode ('${cardCode}','${warehouseCode}') AS TaxCode`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find Tax-Code",
        });
      }

      const data = result.recordset;
      res.status(200).json({
        success: true,
        message: "Tax-Code Found",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // tax-rate
  static async getTaxRate(req, res) {
    try {
      const { taxCode } = req.params;

      const result = await sqlConn2.query(
        `SELECT Rate FROM [BCD_TEST_DB].[dbo].[OVTG] WHERE Code= '${taxCode}'`
      );

      if (!result) {
        res.status(400).json({
          success: false,
          message: "Unable to find tax rate",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "Tax Rate Found",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // uom
  static async getOum(req, res) {
    const { itemCode } = req.params;
    try {
      const result = await sqlConn2.query(
        `SELECT * FROM [BCD_TEST_DB].[dbo].[TVF_GET_UOM] ('${itemCode}')`
      );

      if (!result) {
        res.status(404).json({
          success: false,
          message: "Unable to find Uom",
        });
      }

      const data = result.recordset;

      res.status(200).json({
        success: true,
        message: "UOM Found",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default RetrievalController;
