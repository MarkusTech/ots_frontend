// components/NotificationBell.tsx
import React from "react";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled } from "@mui/material/styles";

type NotificationBellProps = {
  unseenCount: number;
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const NotificationBell: React.FC<NotificationBellProps> = ({ unseenCount }) => {
  return (
    <StyledBadge badgeContent={unseenCount} color="error">
      <NotificationsIcon fontSize="large" />
    </StyledBadge>
  );
};

export default NotificationBell;
