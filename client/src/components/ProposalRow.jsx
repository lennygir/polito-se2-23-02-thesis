import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import ArchiveIcon from "@mui/icons-material/Archive";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import BiotechIcon from "@mui/icons-material/Biotech";
import BusinessIcon from "@mui/icons-material/Business";
import PublicIcon from "@mui/icons-material/Public";
import ScienceIcon from "@mui/icons-material/Science";
import UserContext from "../contexts/UserContext";
import ConfirmationDialog from "./ConfirmationDialog";

function ProposalRow(props) {
  const { proposal, getTeacherById, deleteProposal, archiveProposal, teacherFilter, applications, currentDate } = props;
  const user = useContext(UserContext);
  const teacher = user.role === "student" ? getTeacherById(proposal.supervisor) : null;

  const [openMenu, setOpenMenu] = useState(null);
  const [action, setAction] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const proposalIsAccepted = applications.some(
    (application) => application.proposal_id === proposal.id && application.state === "accepted"
  );

  const proposalIsExpired = dayjs(proposal.expiration_date).isBefore(currentDate);

  const proposalIsManual = !proposalIsAccepted && !proposalIsExpired && proposal.archived;

  useEffect(() => {
    let message = "";
    if (action === "archive") {
      message = "You are about to archive this proposal. This action is irreversible, do you want to continue?";
    } else if (action === "delete") {
      message = "You are about to delete this proposal. This action is irreversible, do you want to continue?";
    }
    setDialogMessage(message);
  }, [action]);

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    handleCloseMenu();
  };

  const handleSubmit = () => {
    handleCloseDialog();
    if (action === "archive") {
      archiveProposal(proposal.id);
    } else if (action === "delete") {
      deleteProposal(proposal.id);
    }
  };

  const renderType = (type) => {
    switch (type) {
      case "RESEARCH":
        return <Chip key={type} icon={<BiotechIcon />} label={type} color="info" size="small" />;
      case "ABROAD":
        return <Chip key={type} icon={<PublicIcon />} label={type} color="warning" size="small" />;
      case "EXPERIMENTAL":
        return <Chip key={type} icon={<ScienceIcon />} label={type} color="success" size="small" />;
      case "COMPANY":
        return <Chip key={type} icon={<BusinessIcon />} label={type} color="rose" size="small" />;
      default:
        return null;
    }
  };

  const renderReason = () => {
    if (proposalIsAccepted) {
      return <Chip label="ACCEPTED" />;
    }
    if (proposalIsExpired) {
      return <Chip label="EXPIRED" />;
    }
    return <Chip label="MANUAL" />;
  };

  return (
    <>
      <ConfirmationDialog
        message={dialogMessage}
        open={openDialog}
        handleClose={handleCloseDialog}
        handleSubmit={handleSubmit}
      />
      <TableRow key={proposal.id}>
        {user.role === "student" && teacher && <TableCell>{`${teacher.name.charAt(0)}. ${teacher.surname}`}</TableCell>}
        <TableCell
          sx={{
            maxWidth: "500px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          <Tooltip title={proposal.title}>
            <Link
              color="inherit"
              underline="hover"
              component={NavLink}
              to={`/proposals/${proposal.id}`}
              state={{ proposal: proposal }}
            >
              {proposal.title}
            </Link>
          </Tooltip>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {proposal.type.split(",").map((type) => renderType(type.trim()))}
          </Stack>
        </TableCell>
        <TableCell align="center">{dayjs(proposal.expiration_date).format("DD/MM/YYYY")}</TableCell>
        {user.role === "teacher" && teacherFilter === "archive" && (
          <TableCell align="center">{renderReason()}</TableCell>
        )}
        {user.role === "teacher" && (
          <TableCell align="right">
            {!proposalIsAccepted && !proposalIsManual && (
              <IconButton onClick={handleOpenMenu}>
                <MoreVertIcon />
              </IconButton>
            )}
          </TableCell>
        )}
      </TableRow>
      <Popover
        open={!!openMenu}
        anchorEl={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: { borderRadius: 3, width: 165, p: 1 } }
        }}
      >
        <MenuItem
          component={NavLink}
          color="inherit"
          underline="none"
          to={`/edit-proposal/${proposal.id}`}
          state={{ proposal: proposal }}
          onClick={handleCloseMenu}
          sx={{ borderRadius: 2 }}
        >
          <ModeEditIcon sx={{ mr: 3 }} />
          Edit
        </MenuItem>

        {teacherFilter === "active" && (
          <>
            <MenuItem
              color="inherit"
              underline="none"
              onClick={() => {
                setAction("archive");
                setOpenDialog(true);
              }}
              sx={{ borderRadius: 2 }}
            >
              <ArchiveIcon sx={{ mr: 3 }} />
              Archive
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                setAction("delete");
                setOpenDialog(true);
              }}
              sx={{ color: "error.main", borderRadius: 2 }}
            >
              <DeleteIcon sx={{ mr: 3 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
}

ProposalRow.propTypes = {
  proposal: PropTypes.object,
  getTeacherById: PropTypes.func,
  deleteProposal: PropTypes.func,
  archiveProposal: PropTypes.func,
  teacherFilter: PropTypes.string,
  applications: PropTypes.array,
  currentDate: PropTypes.string
};

export default ProposalRow;
