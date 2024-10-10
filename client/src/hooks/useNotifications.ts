import { useState, useEffect } from "react";

type NotificationResponse = {
  success: boolean;
  approverCount: number;
};

const useNotifications = (approverIDD: number) => {
  const [unseenCount, setUnseenCount] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/approver-notification/${approverIDD}`
          // "http://localhost:5000/api/v1/approval-notification"
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
  }, [approverIDD]);

  return unseenCount;
};

export default useNotifications;
