import EntryNumber from "../models/entryNumberModel.js";

const entryNumber = async (req, res) => {
  try {
    let entryNumber = await EntryNumber.findOne();
    if (!entryNumber) {
      entryNumber = new EntryNumber({ number: 1 });
    } else {
      entryNumber.number += 1;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEntryNumber = async (req, res) => {
  try {
    const entryNumber = await EntryNumber.findOne();
    res.status(200).json({
      entryNumber: entryNumber ? entryNumber.number : 1,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { entryNumber, getEntryNumber };
