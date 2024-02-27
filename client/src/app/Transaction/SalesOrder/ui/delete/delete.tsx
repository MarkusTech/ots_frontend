import { useState } from "react";
import axios from "axios";

const YourComponent = () => {
  const [draftNum, setDraftNum] = useState("");

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://172.16.10.217:3002/so-details/${draftNum}`,
        {
          // You can include additional configuration options here if needed
        }
      );

      if (response.status === 200) {
        console.log("Data deleted successfully");
      } else {
        console.error("Failed to delete data");
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={draftNum}
        onChange={(e) => setDraftNum(e.target.value)}
        placeholder="Enter DraftNum"
      />
      <button onClick={handleDelete}>Delete Data</button>
    </div>
  );
};

export default YourComponent;
