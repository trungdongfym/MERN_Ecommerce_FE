import {RiDeleteBin6Line} from 'react-icons/ri';
import { BiEdit } from 'react-icons/bi';
import { IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import './adminStyles.scss';

export default function MoreMenuTable(props){
   const {linkDetail, linkDelete} = props;
   return(
      <div className="moreMenu">
         <Link to={linkDetail}>
            <Tooltip title="Chi tiết và chỉnh sửa">
               <IconButton>
                  <BiEdit className='moreMenu__detail'/>
               </IconButton>
            </Tooltip>
         </Link>
         <Link to={linkDelete} >
            <Tooltip title="Xóa">
               <IconButton>
                  <RiDeleteBin6Line className='moreMenu__delete' />
               </IconButton>
            </Tooltip>
         </Link>
      </div>
   );
}