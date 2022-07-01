import CloseIcon from '@mui/icons-material/Close';
import {AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography} from '@mui/material';
import { forwardRef, useState } from 'react';

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
   const { title, children } = props;
   const [open, setOpen] = useState(false);
   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   return (
      <div>
         <Button variant="outlined" onClick={handleClickOpen}>
            Open full-screen dialog
         </Button>
         <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            sx={{zIndex:100000}}
         >
            <AppBar sx={{ position: 'relative' }}>
               <Toolbar>
                  <IconButton
                     edge="start"
                     color="inherit"
                     onClick={handleClose}
                     aria-label="close"
                  >
                     <CloseIcon />
                  </IconButton>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                     {title}
                  </Typography>
                  <Button autoFocus color="inherit" onClick={handleClose}>
                     Xác nhận
                  </Button>
               </Toolbar>
            </AppBar>
            {children}
         </Dialog>
      </div>
   );
}
