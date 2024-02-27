import { useState } from 'react';

const YourComponent = () => {
  const [draftNum, setDraftNum] = useState(''); // Initialize with the initial DraftNum

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://172.16.10.217:3002/so-details/${draftNum}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers if needed
        },
        // You can include a body if your API requires it for DELETE requests
        // body: JSON.stringify({}),
      });

      if (response.ok) {
        // Delete successful
        console.log('Data deleted successfully');
      } else {
        // Handle error
        console.error('Failed to delete data');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  return (
    <div>
      {/* Your component JSX */}
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
