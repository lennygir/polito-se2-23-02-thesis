import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ProposalRow from "./ProposalRow";

const headers = ["Id", "Title", "Expiration Date", ""];

function ProposalTable(props) {
  return (
    <Card
      sx={{
        marginTop: { md: 1, sm: 0 },
        marginX: { md: 4, sm: 0 },
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
              <ProposalRow key={proposal.id} proposal={proposal} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default ProposalTable;
