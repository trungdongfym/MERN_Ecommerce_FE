import {RiDeleteBin6Line} from 'react-icons/ri';
import { BiEdit } from 'react-icons/bi';
import { IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import './adminStyles.scss';

export default function MoreMenuTable(props){
   const {linkDetail, onClickDelete} = props;
   return(
      <div className="moreMenu">
         <Link to={linkDetail}>
            <Tooltip title="Chi tiết và cập nhập">
               <IconButton>
                  <BiEdit className='moreMenu__detail'/>
               </IconButton>
            </Tooltip>
         </Link>
         <Tooltip title="Xóa" onClick={onClickDelete}>
            <IconButton>
               <RiDeleteBin6Line className='moreMenu__delete' />
            </IconButton>
         </Tooltip>
      </div>
   );
}