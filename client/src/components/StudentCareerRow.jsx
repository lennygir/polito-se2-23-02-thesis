import PropTypes from "prop-types";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";

function StudentCareerRow(props) {
  const { course } = props;

  return (
    <>
      <TableRow>
        <TableCell>{course.cod_course}</TableCell>
        <TableCell>{course.title_course}</TableCell>
        <TableCell align="center">{course.grade}</TableCell>
        <TableCell align="center">{course.cfu}</TableCell>
        <TableCell align="center">{dayjs(course.date).format("DD MMM YYYY")}</TableCell>
      </TableRow>
    </>
  );
}

StudentCareerRow.propTypes = {
  course: PropTypes.object
};

export default StudentCareerRow;
