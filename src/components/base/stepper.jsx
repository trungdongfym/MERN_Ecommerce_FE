import { Check } from '@mui/icons-material';
import { StepConnector, StepLabel, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import { stepConnectorClasses } from '@mui/material/StepConnector';
import Stepper from '@mui/material/Stepper';
import { useState } from 'react';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
   [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
   },
   [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
         borderColor: '#008000',
      },
   },
   [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
         borderColor: '#008000',
      },
   },
   [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1,
   },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
   display: 'flex',
   height: 22,
   width: 22,
   alignItems: 'center',
   justifyContent: 'center',
   ...(ownerState.active && {
      color: '#008000',
   }),
   '& .QontoStepIcon-completedIcon': {
      backgroundColor: '#008000',
      color: '#fff',
      borderRadius: '50%',
      zIndex: 1,
      fontSize: 18,
   },
   '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
   },
}));

function QontoStepIcon(props) {
   const { active, completed, className } = props;

   return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
         {completed ? (
            <Check className="QontoStepIcon-completedIcon" />
         ) : (
            <div className="QontoStepIcon-circle" />
         )}
      </QontoStepIconRoot>
   );
}

export default function StepperCustom(props) {

   const { activeStep, steps } = props;

   return (
      <Box sx={{ width: '100%' }}>
         <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
            {steps.map((label, index) => (
               <Step key={index} completed={index < activeStep}>
                  <StepLabel StepIconComponent={QontoStepIcon}>
                     {label}
                  </StepLabel>
               </Step>
            ))}
         </Stepper>
      </Box>
   );
}
