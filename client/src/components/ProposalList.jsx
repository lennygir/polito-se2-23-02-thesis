import {
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const headers = ["Id", "Title", "Expiration Date", ""];

function ProposalList(props) {
  return (
    <Card
      sx={{
        marginTop: { md: 1, sm: 0 },
        marginX: { md: 4, sm: 0 },
        maxHeight: "70vh",
        overflowY: "auto",
        borderRadius: 4,
      }}
    >
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((headCell) => (
                <TableCell
                  key={headCell}
                  align={headCell === "Expiration Date" ? "center" : "inherit"}
                >
                  {headCell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell>{proposal.id}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: "500px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {proposal.title}
                </TableCell>
                <TableCell align="center">{proposal.expirationDate}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default ProposalList;
