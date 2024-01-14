import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ApplicationDetails from "../components/ApplicationDetails";
import ErrorContext from "../contexts/ErrorContext";
import UserContext from "../contexts/UserContext";
import API from "../utils/API";

const fakeProposal = {
  id: 1,
  title: "Analisi empirica dei difetti in R Markdown",
  supervisor: "s123456",
  co_supervisors: "angelo.bonfitto@teacher.it, marcello.romano@teacher.it",
  keywords: "MARKDOWN, DEVELOP",
  type: "RESEARCH",
  groups: "SOFTENG",
  description:
    "I file R Markdown sono adottati ampiamente per lo sviluppo iterativo di workflow di analisi e visualizzazione dei dati. Laffidabilità dei risultati e la possibilità di riutilizzare le analisi dipendono pesantemente dalla correttezza dei file Rmd. Obiettivo della tesi è quello di analizzare file Rmd disponibili in repository pubblici e identificare e classificare i difetti.",
  required_knowledge: "Linguaggio R, Ambiente R Studio",
  notes: null,
  expiration_date: "2024-12-28",
  level: "MSC",
  cds: "LM-32-D",
  archived: false
};

function ViewApplicationPage(props) {
  const location = useLocation();
  const { fetchApplications, fetchNotifications, setAlert, applications } = props;
  const user = useContext(UserContext);
  const handleErrors = useContext(ErrorContext);

  const application = location.state?.application;
  const [proposal, setProposal] = useState(fakeProposal);

  const evaluateApplication = (application) => {
    API.evaluateApplication(application)
      .then(() => {
        setAlert({
          message: "Application evaluated successfully",
          severity: "success"
        });
        fetchApplications();
        fetchNotifications();
      })
      .catch((err) => handleErrors(err));
  };

  useEffect(() => {
    // API.getProposalById(application.proposal_id)
    //   .then((proposal) => setProposal(proposal))
    //   .catch((err) => handleErrors(err));
    setProposal(fakeProposal);
  }, [application]);

  return (
    <div id="view-application-page">
      <Stack
        paddingTop={4}
        sx={{ pt: { md: 4, xs: 0 } }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          component={Link}
          to="/applications"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ ml: { md: 4, xs: 0 } }}
        >
          Back
        </Button>
        {user.role === "student" && application.state === "accepted" && (
          <Button
            component={Link}
            to="/add-request"
            state={{ proposal: proposal }}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: { md: 4, xs: 0 } }}
          >
            Start request
          </Button>
        )}
      </Stack>
      <Typography variant="h4" sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}>
        Application Details
      </Typography>
      <Paper elevation={1} sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <ApplicationDetails
            application={application}
            evaluateApplication={evaluateApplication}
            applications={applications}
            proposal={proposal}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

ViewApplicationPage.propTypes = {
  fetchApplications: PropTypes.func,
  fetchNotifications: PropTypes.func,
  setAlert: PropTypes.func,
  applications: PropTypes.array
};

export default ViewApplicationPage;
