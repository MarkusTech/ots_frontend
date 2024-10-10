import { useState, useEffect } from "react";

type NotificationResponse = {
  success: boolean;
  totalRecordCount: number;
};

const useOriginatorNotification = (originatorID: number | null) => {
  const [unseenCountOriginator, setUnseenCountOriginator] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/originator-notification/${originatorID}`
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
  }, [originatorID]);

  return unseenCountOriginator;
};

export default useOriginatorNotification;
