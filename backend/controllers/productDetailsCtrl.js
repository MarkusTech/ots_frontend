import detailModel from "../models/detailModel.js";

const productDetailsSave = async (req, res) => {
  const {
    LineID,
    EntryNum,
    ItemCode,
    ItemName,
    Quantity,
    Uom,
    UoMConv,
    Whse,
    InvStat,
    SellPriceBeDisc,
    DiscRate,
    SellPriceAftDisc,
    LowerBound,
    TaxCode,
    TaxCodePerc,
    TaxAmt,
    BelPriceDisc,
    Cost,
    BelCost,
    ModeReleasing,
    SCPWDdisc,
    GrossTotal,
  } = req.body;
  req.send("Save Product Details Successfully");
};

const getProductDetails = async (req, res) => {
  try {
    const data = await detailModel.find();
    res.status(200).json({
      success: true,
      message: "Product Detail Fetched",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export { productDetailsSave, getProductDetails };
