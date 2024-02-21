import { useEffect } from "react";
import axios from "axios";

function YourComponent() {
  // Assuming you have these states defined in your component
  const [formData, setFormData] = useState({
    DraftNum: "",
    // other form fields...
  });

  const [draftNumber, setDraftNumber] = useState(null);

  useEffect(() => {
    const fetchDraftNumber = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/generateUniqueId"
        );
        const draftNumber = response.data.draftNumber;

        // Update DraftNum in the formData state
        setFormData((prevFormData) => ({
          ...prevFormData,
          DraftNum: draftNumber.toString(),
        }));

        // Update DraftNumber in a separate state
        setDraftNumber(draftNumber);
      } catch (error) {
        console.error("Error fetching draft number:", error);
        // Handle errors if needed
      }
    };

    // Call the function to fetch the draft number
    fetchDraftNumber();
  }, []); // Empty dependency array ensures the effect runs only once

  // Your JSX and component content...

  return (
    <div>
      Entry Number: {draftNumber}
      {/* Your component content */}
    </div>
  );
}

export default YourComponent;
