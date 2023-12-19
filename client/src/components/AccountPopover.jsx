import { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import UserContext from "../contexts/UserContext";

function AccountPopover() {
  const user = useContext(UserContext);

  const renderRole = () => {
    let label = "";
    switch (user.role) {
      case "student":
        label = "Student";
        break;
      case "teacher":
        label = "Teacher";
        break;
      case "secretary_clerk":
        label = "Secretary clerk";
        break;
      default:
        break;
    }
    return label;
  };

  return (
    <Chip
      sx={{
        height: "auto",
        padding: 0.5,
        py: 0.7,
        borderRadius: 40,
        borderWidth: 1,
        ".MuiChip-avatar": {
          width: 38,
          height: 38
        }
      }}
      avatar={
        <Avatar>
          <PersonIcon />
        </Avatar>
      }
      variant="outlined"
      color="white"
      label={
        <Stack direction="column" mx={1}>
          <Typography fontSize={15} fontWeight={600} variant="subtitle2">
            {`${user.surname.charAt(0)}. ${user.name}`}
          </Typography>
          <Typography fontSize={12} fontWeight={500} variant="caption">
            {renderRole()}
          </Typography>
        </Stack>
      }
    />
  );
}

export default AccountPopover;
