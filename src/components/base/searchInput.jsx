import { OutlinedInput } from "@mui/material";
import { styled } from "@mui/system";

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
   width: 240,
   '&.Mui-focused': {
      width: 320,
      boxShadow: 'rgb(145 158 171/24%) 0 8px 16px 0',
   },
   transition: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, width 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;',
   '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: 'rgb(145 158 171/50%) !important'
   },
}));

export {
   SearchStyle
}