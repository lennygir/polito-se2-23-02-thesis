import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import FileOpenIcon from "@mui/icons-material/FileOpen";

function RequestRow(props) {
  const { request } = props;

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

  return (
    <TableRow>
      <TableCell>{request.student_id}</TableCell>
      <TableCell>{request.supervisor}</TableCell>
      <TableCell
        sx={{
          maxWidth: "500px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        {request.title}
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
  request: PropTypes.object
};

export default RequestRow;
