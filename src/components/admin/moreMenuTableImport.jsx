import { IconButton, Tooltip } from '@mui/material';
import { GrUpdate } from 'react-icons/gr';
import { RiDeleteBin6Line } from 'react-icons/ri';
import './adminStyles.scss';

export default function MoreMenuTableImport(props){
   const {handleClickDeleteProductImport, handleClickUpdateProductImport} = props;
   return(
      <div className="moreMenuTableImport">
         <Tooltip title="Cập nhập"
            onClick={handleClickUpdateProductImport}
         >
            <IconButton>
               <GrUpdate className='moreMenuTableImport__update' />
            </IconButton>
         </Tooltip>
         <Tooltip title="Xóa"
            onClick={handleClickDeleteProductImport}
         >
            <IconButton>
               <RiDeleteBin6Line className='moreMenuTableImport__delete' />
            </IconButton>
         </Tooltip>
      </div>
   );
}