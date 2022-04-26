import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
   FormControl, FormHelperText, IconButton,
   InputAdornment, InputLabel,
   OutlinedInput, TextField
} from "@mui/material";


export function InputOutline({ children, ...fieldProps }) {
   const { label = '', field, form, placeholder } = fieldProps;
   const { errors, touched } = form;
   const { name } = field;
   const isShowError = errors && errors[name] && touched && touched[name];
   return (
      <FormControl fullWidth sx={{ m: 1 }}>
         <TextField
            error={isShowError ? true : false}
            label={label}
            {...field}
            placeholder={placeholder}
            helperText={isShowError && errors[name]}
         />
      </FormControl>
   );
}

export function InputPassword({ children, ...fieldProps }) {
   const { id, label = '', field, form, showPassword, handleShowPassword, placeholder } = fieldProps;
   const { errors, touched } = form;
   const { name } = field;
   const isShowError = errors && errors[name] && touched && touched[name];

   const handleClickShowPassword = (e) => {
      handleShowPassword(e);
   }
   return (
      <FormControl error={isShowError} fullWidth sx={{ m: 1 }}>
         <InputLabel htmlFor='password'>
            {label}
         </InputLabel>
         <OutlinedInput
            id={id}
            type={
               showPassword ? 'text' : 'password'
            }
            {...field}
            placeholder={placeholder}
            label={label}
            endAdornment={
               <InputAdornment position='end'>
                  <IconButton
                     aria-label='toggle password visibility'
                     onClick={
                        handleClickShowPassword
                     }
                  >
                     {showPassword ? (
                        <VisibilityOff />
                     ) : (
                        <Visibility />
                     )}
                  </IconButton>
               </InputAdornment>
            }
         />
         {isShowError && <FormHelperText>{errors[name]}</FormHelperText>}
      </FormControl>
   );
}