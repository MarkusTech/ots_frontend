// components/NotificationBell.tsx
import React, { useState, useEffect } from "react";
import styles from "./NotificationBell.module.css";

type NotificationBellProps = {
  unseenCount: number;
};

const NotificationBell: React.FC<NotificationBellProps> = ({ unseenCount }) => {
  return (
    <div className={styles.notificationBell}>
      <i className="fa fa-bell"></i>
      {unseenCount > 0 && <span className={styles.badge}>{unseenCount}</span>}
    </div>
  );
};

export default NotificationBell;
