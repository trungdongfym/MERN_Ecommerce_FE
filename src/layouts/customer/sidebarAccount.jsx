import { MdEdit } from 'react-icons/md';
import { Avatar } from '@mui/material';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { sidebarAccountConfig } from './sidebarAccountConfig';
import clsx from 'clsx';
import { customerLink } from '../../helpers/linkConstants';

function ShowListItem({item, isLinkActive}){
   return(
      <div className='listItem__wrapper'>
         {isLinkActive ? (
            <NavLink className='listItem__path' to={item.path}>
               {item.icons ? (
                  <span className='itemIcon'>
                     {item.icons}
                  </span>
               ):null}
               <div className="listItem__title">{item.title}</div>
            </NavLink>
         ):(<Link className='listItem__path' to={item.path}>
               {item.icons ? (
                  <span className='itemIcon'>
                     {item.icons}
                  </span>
               ):null}
               <div className="listItem__title">{item.title}</div>
            </Link>
            )
         }
      </div>
   )
}

export default function SidebarAccount(props) {
   const location = useLocation();
   const {user} = props;
   return (
      <div className="sidebarAccount">
         <div className="sidebarAccount__wrapper">
            <div className="sidebarAccount__wrapper__userProfile">
               <div className="avatar">
                  <Avatar className='img' src={`${user && user.avatar}`} alt='avatar'/>
               </div>
               <div className="name">
                  <span>Trung Dong</span>
                  <Link className="editProfile" to={customerLink.profileLink}>
                     <MdEdit />
                     <span>Sửa hồ sơ</span>
                  </Link>
               </div>
            </div>
            <ul className="sidebarAccount__wrapper__list">
               {sidebarAccountConfig.map((item) => {
                  if(item.sublist){
                     const sublist = item.sublist;
                     // Check path active
                     const isAcctive = sublist.some((subItem) => {
                        return location.pathname === subItem.path;
                     });
                     return(
                        <li key={item.id} className={clsx('listItem', {active:isAcctive} )}>
                           <ShowListItem item={item} />
                           <ul className='sublist'>
                              {sublist.map((subItem) => {
                                 return(
                                    <li key={subItem.id} className='subListItem'>
                                       <ShowListItem isLinkActive={true} item={subItem} />
                                    </li>
                                 );
                              })}
                           </ul>
                        </li>
                     );
                  }
                  const isAcctive = item.path === location.pathname;
                  return(
                     <li key={item.id} className={clsx('listItem', {active:isAcctive} )}>
                        <ShowListItem isLinkActive={true} item={item} />
                     </li>
                  );
               })}
            </ul>
         </div>
      </div>
   );
}