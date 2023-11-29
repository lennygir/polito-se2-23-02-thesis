import dayjs from "dayjs";
import { useContext, useState } from "react";
import { NavLink, useNavigate} from "react-router-dom";
import { IconButton, Chip, Link, MenuItem, Popover, Stack, TableCell, TableRow } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import BiotechIcon from "@mui/icons-material/Biotech";
import BusinessIcon from "@mui/icons-material/Business";
import PublicIcon from "@mui/icons-material/Public";
import ScienceIcon from "@mui/icons-material/Science";
import UserContext from "../contexts/UserContext";
import ConfirmationDialog from "./ConfirmationDialog"

function ProposalRow(props) {
  const dialogMessage = "Are you sure you want to delete this thesis proposal?"
  const user = useContext(UserContext);
  const proposal = props.proposal;
  const teacher = user?.role === "student" ? props.getTeacherById(proposal.supervisor) : null;

  const [open, setOpen] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = (idProposal) => {
    setOpen(null);
    navigate('/edit-proposal/'+idProposal, { replace: true });
  };

  const handleDelete = (idProposal) => {
    setOpen(null);
    setOpenDialog(true)
  };

  const handleCloseDialog = () => {
    setOpen(null);
    setOpenDialog(false)
  };

  const handleDeleteSubmit = (idProposal) => {
    setOpen(null);
    setOpenDialog(false);
    props.deleteProposal(idProposal)
  };


  const renderType = (type) => {
    switch (type) {
      case "RESEARCH":
        return <Chip key={type} icon={<BiotechIcon />} label={type} color="info" size="small" />;
      case "COMPANY":
        return <Chip key={type} icon={<BusinessIcon />} label={type} color="rose" size="small" />;
      case "EXPERIMENTAL":
        return <Chip key={type} icon={<ScienceIcon />} label={type} color="success" size="small" />;
      case "ABROAD":
        return <Chip key={type} icon={<PublicIcon />} label={type} color="warning" size="small" />;
    }
  };

  return (
    <>
      <TableRow key={proposal.id}>
        {user?.role === "student" && teacher && (
          <TableCell>{`${teacher.name.charAt(0)}. ${teacher.surname}`}</TableCell>
        )}
        <TableCell
          sx={{
            maxWidth: "500px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
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
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {proposal.type.split(",").map((type) => renderType(type.trim()))}
          </Stack>
        </TableCell>
        <TableCell align="center">{dayjs(proposal.expiration_date).format("DD/MM/YYYY")}</TableCell>
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
          sx: { width: 140 }
        }}
      >
        <MenuItem onClick={()=>handleEdit(proposal.id)}>
          <ModeEditIcon sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(proposal.id)} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <ConfirmationDialog
          message={dialogMessage}
          open={openDialog}
          handleClose={handleCloseDialog}
          handleSubmit={()=>handleDeleteSubmit(proposal.id)}
        />
    </>
  );
}

export default ProposalRow;
