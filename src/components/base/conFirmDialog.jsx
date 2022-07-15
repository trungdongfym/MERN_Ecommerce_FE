import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmDialog(props) {
   const { title, children, open, message, handleClose, ...other } = props;

   return (
      <div>
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{zIndex: 100000}}
            {...other}
         >
            <DialogTitle id="alert-dialog-title" sx={{color: 'red'}}>
               {title}
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  {message}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button data-click = 'cancel' onClick={handleClose}>Hủy</Button>
               <Button data-click = 'confirm' onClick={handleClose} >
                  Xác nhận
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
