import { useContext } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import UserContext from "../contexts/UserContext";

function ApplicationRow(props) {
  const { application } = props;
  const user = useContext(UserContext);

  return (
    <TableRow>
      {user.role === "teacher" && <TableCell>{application.student_id}</TableCell>}
      {user.role === "student" && (
        <TableCell>{`${application.teacher_name.charAt(0)}. ${application.teacher_surname}`}</TableCell>
      )}
      <TableCell
        sx={{
          maxWidth: "500px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        {application.title}
      </TableCell>
      <TableCell align="center">
        {application.state === "rejected" && <Chip label="REJECTED" size="small" color="error" />}
        {application.state === "accepted" && <Chip label="ACCEPTED" size="small" color="success" />}
        {application.state === "pending" && <Chip label="PENDING" size="small" color="info" />}
        {application.state === "canceled" && (
          <Tooltip
            title={user.role === "student" ? "Another student has been accepted" : "A student has been accepted"}
          >
            <Chip label="CANCELED" size="small" color="warning" />
          </Tooltip>
        )}
      </TableCell>
      <TableCell>
        <Tooltip title="View application">
          <IconButton component={NavLink} to={"/applications/" + application.id} state={{ application: application }}>
            <FileOpenIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

ApplicationRow.propTypes = {
  application: PropTypes.object
};

export default ApplicationRow;
