import dayjs from "dayjs";
import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BiotechIcon from "@mui/icons-material/Biotech";
import BusinessIcon from "@mui/icons-material/Business";
import PublicIcon from "@mui/icons-material/Public";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ScienceIcon from "@mui/icons-material/Science";
import UserContext from "../contexts/UserContext";
import { useThemeContext } from "../theme/ThemeContextProvider";
import ConfirmationDialog from "./ConfirmationDialog";

const dialogMessage =
  "Are you sure you want to submit your application for this thesis proposal? This action is irreversible, and your application will be sent to the supervisor for consideration.";

function ProposalDetails(props) {
  const { theme } = useThemeContext();
  const { proposal, applications, getTeacherById, getDegreeById } = props;
  const supervisorTeacher = getTeacherById(proposal.supervisor);
  const degree = getDegreeById(proposal.cds);
  const user = useContext(UserContext);

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    setOpenDialog(false);
    const application = {
      proposal: proposal.id,
      student: user.id
    };
    props.createApplication(application);
  };

  const isApplicationAccepted = () => {
    return applications.some((application) => application.state === "accepted");
  };

  const isWaitingOnDecision = () => {
    return applications.some((application) => application.state === "pending");
  };

  const isApplicationSent = () => {
    return applications.some((application) => application.proposal_id === proposal.id);
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

  const renderKeyword = (keyword) => {
    return <Chip key={keyword} label={keyword} color="default" size="small" />;
  };

  const renderActionButton = () => {
    if (isApplicationAccepted()) {
      return null;
    }
    if (isWaitingOnDecision()) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <AccessTimeIcon color="info" />
          <Typography variant="h6" fontWeight={700} style={{ color: theme.palette.info.main }}>
            APPLICATION PENDING
          </Typography>
        </Box>
      );
    }
    if (isApplicationSent()) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <RemoveCircleOutlineIcon color="info" />
          <Typography variant="h6" fontWeight={700} style={{ color: theme.palette.info.main }}>
            APPLICATION ALREADY SENT
          </Typography>
        </Box>
      );
    } else {
      return (
        <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleOpenDialog}>
          SEND APPLICATION
        </Button>
      );
    }
  };

  return (
    <>
      {user.role === "student" && (
        <ConfirmationDialog
          message={dialogMessage}
          open={openDialog}
          handleClose={handleCloseDialog}
          handleSubmit={handleSubmit}
        />
      )}
      <Typography variant="h5" gutterBottom paddingTop={2}>
        {proposal.title}
      </Typography>
      <Divider variant="middle" />
      <Typography variant="body1" gutterBottom paddingTop={1}>
        <span style={{ fontWeight: "bold" }}>Supervisor: </span>
        {supervisorTeacher.surname + " " + supervisorTeacher.name + " (" + supervisorTeacher.email + ")"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Co-supervisors: </span>
        {proposal.co_supervisors}
      </Typography>
      {proposal.keywords && proposal.keywords !== "" && (
        <Stack direction="row" spacing={1} alignItems={{ md: "center", xs: "flex-start" }} sx={{ mb: 1 }}>
          <Typography variant="body1" fontWeight={700} gutterBottom>
            Keywords:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} useFlexGap flexWrap="wrap">
            {proposal.keywords.split(",").map((keyword) => renderKeyword(keyword.trim()))}
          </Stack>
        </Stack>
      )}
      <Typography variant="body1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Groups: </span>
        {proposal.groups}
      </Typography>
      <Stack direction="row" spacing={1} alignItems={{ md: "center", xs: "flex-start" }} sx={{ mb: 1 }}>
        <Typography variant="body1" fontWeight={700} gutterBottom>
          Type:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }} useFlexGap flexWrap="wrap">
          {proposal.type.split(",").map((type) => renderType(type.trim()))}
        </Stack>
      </Stack>
      <Typography variant="body1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Description: </span>
        {proposal.description}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Required knowledge: </span>
        {proposal.required_knowledge}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Expiration date: </span>
        {dayjs(proposal.expiration_date).format("DD MMMM YYYY")}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Level: </span>
        {proposal.level === "MSC" ? "Master Degree" : "Bachelor Degree"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>CDS: </span>
        {degree.cod_degree + " " + degree.title_degree}
      </Typography>
      {proposal.notes && proposal.notes !== "" && (
        <Typography variant="body1" gutterBottom>
          <span style={{ fontWeight: "bold" }}>Notes: </span>
          {proposal.notes}
        </Typography>
      )}
      {user.role === "student" && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {renderActionButton()}
        </Box>
      )}
    </>
  );
}

export default ProposalDetails;
