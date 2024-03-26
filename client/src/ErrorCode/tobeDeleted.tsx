import axios from "axios";

const commitDraft = async (draftNum) => {
  try {
    // Make a PUT request to the backend API endpoint
    const response = await axios.put("http://localhost:3000/commit", {
      DraftNum: draftNum,
    });

    // Check if the request was successful
    if (response.status === 200) {
      console.log("Stored procedure executed successfully");
      console.log("Result:", response.data.data);
      // Handle the response data as needed
    } else {
      console.error("Error:", response.data.erro);
      // Handle the error
    }
  } catch (error) {
    console.error("Error:", error.message);
    // Handle network errors or other exceptions
  }
};

// Call the function to execute the stored procedure
const draftNumber = 10128; // Change this to the draft number you want to commit
commitDraft(draftNumber);

const onAddHeader = async () => {
  const customers = await axios.get(`${fetchAPI}/customer`);
  setCustomerDataList(customers.data);
  // setTodayDate(manilaDate);
};