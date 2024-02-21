import { useEffect, useState } from "react";

function MyComponent() {
  const [entryNumber, setEntryNumber] = useState(null);

  useEffect(() => {
    // Fetch the unique identifier from the Express server
    fetch("http://localhost:3001/api/generateUniqueId") // Adjust the URL based on your server configuration
      .then((response) => response.json())
      .then((data) => {
        setEntryNumber(data.uniqueId);
      });
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div>
      Entry Number: {entryNumber}
      {/* Your component content */}
    </div>
  );
}
