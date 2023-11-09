import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Proposal from "../components/Proposal";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
function ProposalsPage() {

  // TODO: replace fake data by API call
  const [proposals, setProposals] = useState([
    {
      proposal_id: 0,
      teacher_id: { name: 'Fulvio', surname: 'Giovanni' },
      expiration_date: new Date(),
      status: 'Available', 
      cds: { title_degree: 'Master Civil engineering' },
      groups: { name: '5th year 2023-2024', department_id: { name: 'Civil engineering' }}
    },
    {
      proposal_id: 1,
      teacher_id: { name: 'Luigi', surname: 'De Russis' },
      expiration_date: new Date(),
      status: 'No more available', 
      cds: { title_degree: 'Master Computer engineering' },
      groups: { name: '4th year 2023-2024', department_id: { name: 'Computer engineering' }}
    },
    {
      proposal_id: 2,
      teacher_id: { name: 'Luigi', surname: 'De Russis' },
      expiration_date: new Date(),
      status: 'Available', 
      cds: { title_degree: 'Master Chimical engineering' },
      groups: { name: '4th year 2023-2024', department_id: { name: 'Chimical engineering' }}
    }
  ])

  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    // TODO: refresh data with api call
  }, [dirty]);

  return <>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h4">
        Thesis
      </Typography>
      <TextField label="Rechercher" variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
    </Stack>
    
    <Stack direction="column" spacing={2}>
      {
        proposals && proposals.map(p => <Proposal key={p.proposal_id} proposal={p} />)
      }
    </Stack>
   
  </>;
}

export default ProposalsPage;
