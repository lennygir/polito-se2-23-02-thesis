import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import StudentCareerRow from "./StudentCareerRow";

const HEADERS = ["Code", "Exam", "Grade", "CFU", "Date"];

function StudentCareerTable(props) {
  const { career } = props;

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            {HEADERS.map((headCell) => (
              <TableCell
                key={headCell}
                variant="head"
                align={headCell === "Grade" || headCell === "CFU" || headCell === "Date" ? "center" : "inherit"}
              >
                <Typography fontWeight={700}>{headCell}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {career.map((course) => (
            <StudentCareerRow key={course.cod_course} course={course} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

StudentCareerTable.propTypes = {
  career: PropTypes.array
};

export default StudentCareerTable;
