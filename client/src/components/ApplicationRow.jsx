import { useContext } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import UserContext from "../contexts/UserContext";

function ApplicationRow(props) {
  const { application } = props;
  const user = useContext(UserContext);

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      {user.role === "teacher" && <TableCell sx={{ minWidth: 150 }}>{application.student_id}</TableCell>}
      {user.role === "student" && (
        <TableCell sx={{ minWidth: 150 }}>{`${application.teacher_name.charAt(0)}. ${
          application.teacher_surname
        }`}</TableCell>
      )}
      <TableCell
        sx={{
          maxWidth: 350,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        <Tooltip title={application.title}>
          <Link color="inherit" underline="none">
            {application.title}
          </Link>
        </Tooltip>
      </TableCell>
      <TableCell align="center">
        {application.state === "rejected" && <Chip label="REJECTED" size="small" color="error" />}
        {application.state === "accepted" && <Chip label="ACCEPTED" size="small" color="success" />}
        {application.state === "pending" && <Chip label="PENDING" size="small" color="info" />}
        {application.state === "canceled" && <Chip label="CANCELED" size="small" color="warning" />}
      </TableCell>
      <TableCell align="center">
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
