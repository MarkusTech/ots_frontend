import { useState } from 'react';

const YourComponent = () => {
  const [draftNumber, setDraftNumber] = useState(null);

  const saveCommit = async () => {
    Swal.fire({
      title: "Do you want to Commit?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const draftNum = draftNumber;
        try {
          const response = await axios.put("http://localhost:5000/api/v1/final-commit", {
            DraftNum: draftNum,
          });
          const { success, message, incrementedDraftNum } = response.data;
          if (success) {
            setDraftNumber(incrementedDraftNum); // Update the state with incrementedDraftNum
            Swal.fire("Successfully Commited", "", "success");
          } else {
            Swal.fire("Error!", message || "Failed to update draft", "error");
          }
        } catch (error) {
          console.error("Error updating draft:", error);
          Swal.fire("Error!", "Failed to update draft", "error");
        }
      } else if (result.isDenied) {
        // Show info message
        Swal.fire("Not Commited", "", "info");
      }
    });
  };

  return (
    // Your component JSX
  );
};

export default YourComponent;
