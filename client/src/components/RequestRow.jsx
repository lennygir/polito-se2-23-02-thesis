import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import FileOpenIcon from "@mui/icons-material/FileOpen";

function RequestRow(props) {
  const { request, teachers } = props;

  const renderStatus = () => {
    switch (request.status) {
      case "secretary_accepted":
        return <Chip label="APPROVED" size="small" color="info" />;
      case "requested":
        return <Chip label="REQUESTED" size="small" color="default" />;
      case "rejected":
        return <Chip label="REJECTED" size="small" color="error" />;
      case "started":
        return <Chip label="STARTED" size="small" color="success" />;
      default:
        break;
    }
  };

  const renderSupervisor = () => {
    const supervisor = teachers.find((teacher) => teacher.email === request.supervisor);
    return `${supervisor.name.charAt(0)}. ${supervisor.surname}`;
  };

  return (
    <TableRow>
      <TableCell>{request.student_id}</TableCell>
      <TableCell>{renderSupervisor()}</TableCell>
      <TableCell
        sx={{
          maxWidth: "420px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        <Tooltip title={request.title}>
          <Link color="inherit" underline="none">
            {request.title}
          </Link>
        </Tooltip>
      </TableCell>
      <TableCell align="center">{renderStatus()}</TableCell>
      <TableCell align="center">
        <Tooltip title="View request">
          <IconButton component={NavLink} to={"/requests/" + request.id} state={{ request: request }}>
            <FileOpenIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

RequestRow.propTypes = {
  request: PropTypes.object,
  teachers: PropTypes.array
};

export default RequestRow;
