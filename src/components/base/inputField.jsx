import { PhotoCamera, Visibility, VisibilityOff } from '@mui/icons-material';
import {
   FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, InputAdornment, InputLabel,
   OutlinedInput, Radio, RadioGroup, TextField
} from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect } from 'react';
import { useState } from "react";

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

export function FormNormal({children, ...fieldProps}){
   const {label = '', form, field, placeholder, autoComplete} = fieldProps;
   const { errors, touched } = form;
   const { name } = field;
   const isShowError = errors && errors[name] && touched && touched[name];
   return(
      <FormControl sx={{width:'100%'}}>
         <div className="fieldWapper">
            <FormLabel className="fieldWapper__label" id="radioLabelId">{label}</FormLabel>
            <OutlinedInput
               className="formCustom"
               error={isShowError ? true : false}
               {...field}
               placeholder={placeholder}
               autoComplete={autoComplete}
            />
         </div>
         {isShowError && 
            <FormHelperText sx={{color:'red', marginLeft:'120px'}}>
               {errors[name]}
            </FormHelperText>
         }
      </FormControl>
   );
}

export function RadioButtonGroup(props){
   const { radioList, field, label } = props;
   return(
      <FormControl fullWidth sx={{ m: 1 }}>
         <div className="fieldWapper">
            <FormLabel className="fieldWapper__label" id="radioLabelId">{label}</FormLabel>
            <RadioGroup
               row
               aria-labelledby="radioLabelId"
               {...field}
               sx={{width:'100%'}}
            >
               {radioList.map((radioEl)=>{
                  return(
                     <FormControlLabel 
                        key={radioEl.id} 
                        value={radioEl.value} 
                        control={<Radio />} 
                        label={radioEl.label} 
                     />
                  );
               })}
            </RadioGroup>
         </div>
      </FormControl>
   )
}

export function DateField(props){
   const { field, setFieldValue, label } = props;
   const { name, value } = field;
   const [valueChange, setValueChange] = useState(null);
   useEffect(()=>{
      setValueChange(value);
   },[value]);
   return(
      <FormControl>
         <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="fieldWapper">
               <FormLabel className="fieldWapper__label" id="radioLabelId">{label}</FormLabel>
               <DatePicker
                  value={valueChange}
                  onChange={(newValue) => {
                     const date = new Date(newValue);
                     if(date instanceof Date && !isNaN(date))
                        setFieldValue(name,date.toISOString());
                     setValueChange(newValue);
                  }
               }
                  renderInput={(params) => {
                     return(
                        <TextField className="formCustom" {...params} />   
                     )
                  }}
               />
            </div>
         </LocalizationProvider>
      </FormControl>
   );
}

export function InputFileImage(props){
   const [file, setFile] = useState(null);
   const {label, field, setFieldValue, setPreviewAvt = null} = props;
   const {name} = field;

   useEffect(()=>{
      if(!file) return;
      let linkPre = null;
      if(setPreviewAvt){
         linkPre = URL.createObjectURL(file);
         setPreviewAvt(linkPre);
      }
      setFieldValue(name, file);
      return () => {
         linkPre && URL.revokeObjectURL(linkPre);
      }
   },[file])

   const handleChangeFile = (e) => {
      const fileIp = e.target.files[0];
      if(fileIp && (fileIp.type === 'image/png' || fileIp.type === 'image/jpeg')){
         setFile(fileIp)
      }
   }
   return(
      <label htmlFor="iconFileID">
         <label htmlFor="iconFileID" style={{cursor:'pointer'}}>{label}</label>
         <input 
            accept="image/*" 
            name={name} 
            style={{display:'none'}} 
            id="iconFileID" 
            type="file" 
            onChange={handleChangeFile}
         />
         <IconButton color="primary" aria-label="upload picture" component="span">
            <PhotoCamera />
         </IconButton>
      </label>
   );
}