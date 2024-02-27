Swal.fire({
  title: "Do you want to update this Draft?",
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: "Save",
  denyButtonText: `Don't save`,
}).then((result) => {
  if (result.isConfirmed) {
    // delete details upon saving
    deleteDetailsThenSave();

    const draftNum = draftNumber;
    const axiosInstance = axios.create({
      baseURL: "http://172.16.10.217:3002",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const saveOnUpdateHeaderDetails = {
      // ... (your existing header details)
    };

    axiosInstance
      .put(`/so-header/${draftNum}`, saveOnUpdateHeaderDetails)
      .then((response) => {
        console.log("Data sent successfully:", response.data);

        // Show success message
        Swal.fire({
          icon: "success",
          text: "Updated Successfully",
        });
      })
      .catch((error) => {
        console.error("Error sending data:", error);

        // Show error message
        Swal.fire("Internal Server Error, Contact MIS Department", "", "error");
      });
  } else if (result.isDenied) {
    // Show info message
    Swal.fire("Draft is not saved", "", "info");
  }
});
