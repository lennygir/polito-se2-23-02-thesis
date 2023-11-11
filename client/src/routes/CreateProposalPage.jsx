import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProposalForm from "../components/ProposalForm";

function CreateProposalPage(props) {
  return (
    <div id="crete-proposal-page">
      <Paper elevation={1} sx={{ mb: 5 }}>
        <Stack
          paddingTop={4}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button
            component={Link}
            to="/proposals"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{ ml: 4 }}
          >
            Back
          </Button>
        </Stack>
        <Typography variant="h4" padding={4}>
          New Thesis Proposal
        </Typography>
        <Box paddingX={5} paddingBottom={3}>
          <ProposalForm
            teachers={props.teachers}
            groups={props.groups}
            cds={props.cds}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

export default CreateProposalPage;
