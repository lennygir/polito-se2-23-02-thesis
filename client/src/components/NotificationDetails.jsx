import PropTypes from "prop-types";
import { useState } from "react";
import dayjs from "dayjs";
import { Divider, Link, Typography } from "@mui/material";

function NotificationDetails(props) {
  const { notification } = props;
  const [showMore, setShowMore] = useState(false);
  return (
    <div>
      <Typography variant="h5" gutterBottom paddingTop={2} paddingBottom={1}>
        {notification.object}
      </Typography>
      <Divider variant="middle" />
      <Typography variant="body1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>From:</span> thesis@polito.it
      </Typography>
      <Typography variant="body1" gutterBottom paddingBottom={1}>
        <span style={{ fontWeight: "bold" }}>Date: </span>
        {dayjs(notification.date).format("DD MMMM YYYY")}
      </Typography>
      <Divider variant="middle" />
      {notification.content.length > 250 ? (
        <Typography variant="body1" gutterBottom paddingTop={2}>
          {showMore ? `${notification.content} ` : `${notification.content.substring(0, 250)}... `}
          <Link component="button" variant="body2" onClick={() => setShowMore(!showMore)}>
            {showMore ? "Show less" : "Show more"}
          </Link>
        </Typography>
      ) : (
        <Typography variant="body1" gutterBottom paddingTop={2} sx={{ whiteSpace: "break-spaces" }}>
          {notification.content}
        </Typography>
      )}
    </div>
  );
}

NotificationDetails.propTypes = {
  notification: PropTypes.object
};

export default NotificationDetails;
