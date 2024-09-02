// hooks/useNotifications.ts
import { useState, useEffect } from "react";

type Notification = {
  id: string;
  message: string;
  seen: boolean;
};

const useNotifications = () => {
  const [unseenCount, setUnseenCount] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      // Replace with your API endpoint
      const response = await fetch("/api/notifications");
      const data: Notification[] = await response.json();

      const unseenNotifications = data.filter(
        (notification) => !notification.seen
      );
      setUnseenCount(unseenNotifications.length);
    };

    fetchNotifications();
  }, []);

  return unseenCount;
};

export default useNotifications;
