import { useContext, useState } from "react";
import {
  IconButton,
  Link,
  MenuItem,
  Popover,
  TableCell,
  TableRow,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import { NavLink } from "react-router-dom";

function ProposalRow(props) {
  const user = useContext(UserContext);
  const proposal = props.proposal;
  const teacher =
    user?.role === "student" ? props.getTeacherById(proposal.supervisor) : null;

  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

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
          <Link
            color="inherit"
            underline="hover"
            component={NavLink}
            to={"/proposals/" + proposal.id}
            state={{ proposal: proposal }}
          >
            {proposal.title}
          </Link>
        </TableCell>
        <TableCell align="center">
          {dayjs(proposal.expiration_date).format("DD/MM/YYYY")}
        </TableCell>
        {user?.role === "teacher" && (
          <TableCell align="right">
            <IconButton onClick={handleOpenMenu}>
              <MoreVertIcon />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <ModeEditIcon sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

export default ProposalRow;
