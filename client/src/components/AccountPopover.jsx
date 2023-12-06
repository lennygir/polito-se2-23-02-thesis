import { useContext } from "react";
import { Avatar, Chip, Stack, Typography } from "@mui/material";
import UserContext from "../contexts/UserContext";
import PersonIcon from "@mui/icons-material/Person";

function AccountPopover() {
  const user = useContext(UserContext);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
          <Typography fontSize={15} variant="subtitle2">
            {`${user.surname.charAt(0)}. ${user.name}`}
          </Typography>
          <Typography fontSize={11} variant="caption">
            {capitalizeFirstLetter(user.role)}
          </Typography>
        </Stack>
      }
    />
  );
}

export default AccountPopover;
