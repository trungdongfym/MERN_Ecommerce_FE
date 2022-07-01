import { Avatar } from '@mui/material';
import './styles/sidebarAdmin.scss';
import {sidebarAdminConfig} from './config/sidebarAdminConfig';
import { Link, useLocation } from 'react-router-dom';
import {IoIosArrowForward} from 'react-icons/io';
import { useState } from 'react';
import clsx from 'clsx';

function ShowItem({item, children, ...other}){
   const {path, title, icon} = item;
   if(!path){
      return(
         <div {...other}>
            {icon ? icon:null}
            <span className='title'>{title}</span>
            {children}
         </div>
      );
   }
   return(
      <Link to={path} {...other}>
         {icon ? icon:null}
         <span className='title'>{title}</span>
         {children}
      </Link>
   );
}

export default function SidebarAdmin(props){
   const {user} = props;
   const {name, avatar} = user || {};
   const [arrParentActive, setArrPrentActive] = useState([]);
   const location = useLocation();
   const [itemActive, setItemActive] = useState(()=>{
      let itemActiveID = null;
      for(const listItem of sidebarAdminConfig){
         if(itemActiveID) break;
         const {sublist} = listItem;
         if(!sublist) {
            if(listItem.path === location.pathname) {
               itemActiveID = listItem.id;
               break;
            }
         } else {
            for(const subListItem of sublist){
               if(subListItem.path === location.pathname) {
                  itemActiveID = subListItem.id;
                  break;
               }
            }
         }
      }
      return itemActiveID;
   });

   // listItem is a item normal, it dont have subitem
   // parentItem is a item that it have subitem
   const handleClickActive = (parentItem, listItem) => {
      if(listItem && itemActive !== listItem){
         setItemActive(listItem);
      }
      if(parentItem){
         if(!arrParentActive.includes(parentItem)){
            arrParentActive.push(parentItem);
            const newArrParentActive = structuredClone(arrParentActive);
            setArrPrentActive(newArrParentActive);
         } else {
            arrParentActive.splice(arrParentActive.indexOf(parentItem),1);
            const newArrParentActive = structuredClone(arrParentActive);
            setArrPrentActive(newArrParentActive);
         }
      }
   }
   return(
      <div className='sidebarAdmin'>
         <div className='sidebarAdmin__adminInfo'>
            <div className="avatar">
               <Avatar sx={{ width: 30, height: 30 }} alt={name} src={avatar} />
            </div>
            <div className="name">
               {name}
            </div>
         </div>
         <div className='patitition'></div>
         <div className='sidebarAdmin__wapperList'>
            <ul className='sidebarAdmin__wapperList__list'>
               {sidebarAdminConfig.map((sidebarItem) => {
                  const {id ,sublist} = sidebarItem;
                  if(!sublist){
                     return(
                        <li key={id} 
                           className='sidebarAdmin__wapperList__list__listItem' 
                           onClick={() => {handleClickActive(null,id)}}
                        >
                           <ShowItem item={sidebarItem}  
                              className={clsx('listItemWapper', {active: itemActive===id })}
                           />
                        </li>
                     );
                  }
                  return(
                     <li key={id} 
                        className={
                           clsx('sidebarAdmin__wapperList__list__listItem', 
                           {active: arrParentActive.includes(id) })
                        }
                     >
                        <div 
                           className={clsx('parentList')}
                           onClick={() => {handleClickActive(id,null)}}
                        >
                           <ShowItem item={sidebarItem} className='listItemWapper' />
                           <IoIosArrowForward className='acctiveArrow'/>
                        </div>
                        <ul className='sublist'>
                           {sublist.map((sublistItem) => {
                              const {id} = sublistItem;
                              return(
                                 <li 
                                    key={id} 
                                    className='sublist__sublistItem'
                                    onClick={() => {handleClickActive(null,id)}}
                                 >
                                    <ShowItem item={sublistItem} 
                                       className={clsx('listItemWapper', {active: itemActive===id })}
                                    />
                                 </li>
                              );
                           })}
                        </ul>
                     </li>
                  );
               })}
            </ul>
         </div>
      </div>
   );
}