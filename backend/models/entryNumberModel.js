import mongoose from "mongoose";

const entryNumberSchema = new mongoose.Schema({
  number: {
    type: Number,
    require: true,
  },
});

export default mongoose.model("EntryNumber", entryNumberSchema);
