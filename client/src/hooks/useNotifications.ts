import { useState, useEffect } from "react";

type NotificationResponse = {
  success: boolean;
  approverCount: number;
};

const useNotifications = (approverIDD: number | null) => {
  const [unseenCount, setUnseenCount] = useState<number>(0); // default to 0

  useEffect(() => {
    if (approverIDD !== 0) {
      // Check for valid approverIDD
      const fetchNotifications = async () => {
        try {
          const response = await fetch(
            `http://172.16.10.169:5000/api/v1/approver-notification/${approverIDD}`
          );
          const data: NotificationResponse = await response.json();

          if (data.success) {
            setUnseenCount(data.approverCount);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [approverIDD]);

  return unseenCount;
};

export default useNotifications;
