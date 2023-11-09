import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import SendIcon from '@mui/icons-material/Send';

function Proposal(props) {
  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <CardContent>
        <Typography variant="h5">
          { props.title } empty
        </Typography>
        <Stack direction="row" spacing={10} flexWrap="wrap">
            <Typography variant="subtitle1">
                Degree : { props.proposal.cds.title_degree }
            </Typography>
            <Typography variant="subtitle1">
                Teacher : { props.proposal.teacher_id.name } { props.proposal.teacher_id.surname }
            </Typography>
            <Typography variant="subtitle1">
                Department : { props.proposal.groups.department_id.name }
            </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 5 }}>
        <Button variant="contained" endIcon={<SendIcon />}>Learn more</Button>
      </CardActions>
    </Card>
  );
}

export default Proposal;
