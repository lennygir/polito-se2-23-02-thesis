import { useContext } from "react";
import { Chip, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import { NavLink } from "react-router-dom";
import FileOpenIcon from "@mui/icons-material/FileOpen";

function ApplicationRow(props) {
  const user = useContext(UserContext);
  const proposal = props.proposal;
  const teacher =
    user?.role === "student" ? props.getTeacherById(proposal.supervisor) : null;

  return (
    <>
      <TableRow key={proposal.id}>
        {user?.role === "teacher" && <TableCell>{proposal.id}</TableCell>}
        {user?.role === "student" && teacher && (
          <TableCell>
            {`${teacher.name.charAt(0)}. ${teacher.surname}`}
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
          {proposal.title}
        </TableCell>
        <TableCell align="center">
          {/*<Chip label="Accepted" size="small" color="success" />*/}
          <Chip label="Rejected" size="small" color="error" />
          {/*<Chip label="Pending" size="small" />*/}
        </TableCell>
        <TableCell>
          <Tooltip title="View application">
            <IconButton
              component={NavLink}
              to={"/applications/" + proposal.id} // To be changed
              state={{ proposal: proposal }}
            >
              <FileOpenIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </>
  );
}

export default ApplicationRow;
