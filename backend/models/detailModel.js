import mongoose from "mongoose";

const productDetailsSchema = new mongoose.Schema({
    LineID bigint
EntryNum bigint
ItemCode varchar(20)
ItemName varchar(100)
Quantity float
UoM varchar(20)
UoMConv float
Whse varchar(20)
InvStat varchar(20)
SellPriceBefDisc float
DiscRate float
SellPriceAftDisc float
LowerBound float
TaxCode varchar(10)
TaxCodePerc float
TaxAmt float
BelPriceDisc float
Cost float
BelCost float
ModeReleasing varchar(50)
SCPWDdisc char(1)
GrossTotal float
})

export default mongoose.model("ProductDetails", productDetailsSchema)