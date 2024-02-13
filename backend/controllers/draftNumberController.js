import DraftNumber from "../models/numberMoldel.js";

const draftNumber = async (req, res) => {
  try {
    let draftNumber = await DraftNumber.findOne();
    if (!draftNumber) {
      draftNumber = new DraftNumber({ number: 1 });
    } else {
      draftNumber.number += 1;
    }
    await draftNumber.save();
    res.json({ draftNumber: draftNumber.number });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDraftNumber = async (req, res) => {
  try {
    const draftNumber = await DraftNumber.findOne();
    res.json({ draftNumber: draftNumber ? draftNumber.number : 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { draftNumber, getDraftNumber };
