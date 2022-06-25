import { Alert, Modal } from "@mui/material";
import { Box } from "@mui/system";

const style = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   outline: 'none' 
};

function ShowAlert({type, message}){
   if(type === 'error')
      return <Alert severity="error" sx={{fontWeight:500}}>{message}</Alert>
   if(type === '')
      return <Alert severity="warning" sx={{fontWeight:500}}>{message}</Alert>
   if(type === '')
      return <Alert severity="info" sx={{fontWeight:500}}>{message}</Alert>
   return  <Alert severity="success" sx={{fontWeight:500}}>{message}</Alert>
}

export default function ModalNotify(props){
   const { type, message, open, handleClose } = props;
   return(
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <ShowAlert type={type} message={message}/>
        </Box>
      </Modal>
   );
}