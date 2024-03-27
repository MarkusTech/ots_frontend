const [docNumber, setDocNumber] = useState("0");

// Check if docNumber is greater than 0
const isDocNumberGreaterThanZero = parseInt(docNumber) > 0;

// Disable the button if docNumber is greater than 0
<button
  className={`p-2 mt-2 mb-1 text-[12px] bg-[#F4D674] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600 rounded w-24 ${
    isDocNumberGreaterThanZero ? "opacity-50 cursor-not-allowed" : ""
  }`}
  onClick={handleUpdate}
  disabled={isDocNumberGreaterThanZero}
>
  Update draft
</button>;
