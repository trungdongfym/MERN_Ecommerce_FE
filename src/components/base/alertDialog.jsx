import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './styles/alertDialog.scss';

export default function AlertDialog(props) {
   const { title, children, open, handleClose } = props;
   return (
      <div>
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{ zIndex: 100000 }}
            className='dialogWapper'
         >
            {title &&
               <DialogTitle className='dialogWapper__header' id="alert-dialog-title">
                  <span className='title'>{title}</span>
                  {handleClose ? (
                     <IconButton
                        aria-label="close"
                        onClick={handleClose}
                     >
                        <CloseIcon />
                     </IconButton>
                  ) : null}
               </DialogTitle>
            }
            <DialogContent>
               {children}
            </DialogContent>
            <DialogActions className='dialogWapper__footer'>
               <Button data-click='cancel' onClick={handleClose}>Hủy</Button>
               <Button data-click='confirm' onClick={handleClose} >
                  Xác nhận
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
