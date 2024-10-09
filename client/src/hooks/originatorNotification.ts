import { useState, useEffect } from "react";

type NotificationResponse = {
  success: boolean;
  totalRecordCount: number;
};

// This is now a custom hook
const useOriginatorNotification = () => {
  const [unseenCountOriginator, setUnseenCountOriginator] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/originator-notification"
        );
        const data: NotificationResponse = await response.json();

        if (data.success) {
          setUnseenCountOriginator(data.totalRecordCount);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Custom hooks should return the necessary data
  return unseenCountOriginator;
};

export default useOriginatorNotification;
