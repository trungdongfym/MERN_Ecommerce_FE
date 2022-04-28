import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import './base.scss';

export default function Spinner() {
   return (
      <div className="spinner">
         <Box className='spinner__container'>
            <CircularProgress className="loading" />
         </Box>
      </div>
   );
}