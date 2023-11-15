import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

function ProposalDetails(props) {
  const { proposal, getTeacherById, getDegreeById } = props;
  const supervisorTeacher = getTeacherById(proposal.supervisor);
  const degree = getDegreeById(proposal.cds);

  return (
    <>
      <Typography variant="h5" gutterBottom paddingTop={2}>
        {proposal.title}
      </Typography>
      <Divider />
      <Typography variant="subtitle1" gutterBottom paddingTop={1}>
        <span style={{ fontWeight: "bold" }}>Supervisor: </span>
        {supervisorTeacher.surname +
          " " +
          supervisorTeacher.name +
          " (" +
          supervisorTeacher.email +
          ")"}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Co-supervisors: </span>
        {proposal.co_supervisors}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Keywords: </span>
        {proposal.keywords}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Type: </span>
        {proposal.type}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Groups: </span>
        {proposal.groups}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Description: </span>
        {proposal.description}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Required knowledge: </span>
        {proposal.required_knowledge}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Expiration date: </span>
        {dayjs(proposal.expiration_date).format("DD MMMM YYYY")}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Level: </span>
        {proposal.level === "MSC" ? "Master Degree" : "Bachelor Degree"}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>CDS: </span>
        {degree.cod_degree + " " + degree.title_degree}
      </Typography>
      {proposal.notes && proposal.notes !== "" && (
        <Typography variant="subtitle1" gutterBottom>
          <span style={{ fontWeight: "bold" }}>Notes: </span>
          {proposal.notes}
        </Typography>
      )}
    </>
  );
}

export default ProposalDetails;
