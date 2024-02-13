import mongoose from "mongoose";

const draftNumberSchema = new mongoose.Schema({
  number: { type: Number, required: true },
});

export default mongoose.model("DraftNumber", draftNumberSchema);
