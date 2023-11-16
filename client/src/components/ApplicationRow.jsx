import { useContext } from "react";
import { Chip, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import { NavLink } from "react-router-dom";
import FileOpenIcon from "@mui/icons-material/FileOpen";

function ApplicationRow(props) {
  const { application, proposal } = props;
  const user = useContext(UserContext);

  return (
    <>
      <TableRow>
        <TableCell>
          <Tooltip title="View application">
            <IconButton
              component={NavLink}
              to={
                "/applications/" +
                application.student_id +
                "-" +
                application.proposal_id
              } // To be changed
              state={{ application: application, proposal: proposal }}
            >
              <FileOpenIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        {user?.role === "teacher" && (
          <TableCell>{application.student_id}</TableCell>
        )}
        {user?.role === "student" && (
          <TableCell>
            {`${application.teacher_name.charAt(0)}. ${
              application.teacher_surname
            }`}
          </TableCell>
        )}
        <TableCell
          sx={{
            maxWidth: "500px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {proposal?.title}
        </TableCell>
        <TableCell align="center">
          {application.state === "rejected" && (
            <Chip label="Rejected" size="small" color="error" />
          )}
          {application.state === "accepted" && (
            <Chip label="Accepted" size="small" color="success" />
          )}
          {application.state === "pending" && (
            <Chip label="Pending" size="small" />
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

export default ApplicationRow;
