import { Link } from 'react-router-dom';
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import clsx from 'clsx';
import { customerLink } from "../../helpers/linkConstants";
import { navbarAdminConfig } from './config/navbarAdminConfig';
import {Logo} from '../../components/base'

function ShowListItem({ listItem }) {
   return (
      <li className="listItem">
         {!listItem.path ?
            (<div className="item box">
               <span className="listItem__icon">
                  {listItem.icon}
               </span>
               <div className="listItem__title">{listItem.title}</div>
            </div>) :
            !listItem.pathAbs ?
               (<Link className="item link" to={listItem.path} >
                  <span className="listItem__icon">
                     {listItem.icon}
                  </span>
                  <div className="listItem__title">{listItem.title}</div>
               </Link>) :
               (<a className="item link" href={listItem.path}>
                  <span className="listItem__icon">
                     {listItem.icon}
                  </span>
                  <div className="listItem__title">{listItem.title}</div>
               </a>)
         }
      </li>
   );
}

const listUserActions = [
   {
      id: 'profile',
      title: 'Tài khoản của tôi',
      path: customerLink.profileAdminLink
   },
   {
      id: 'logout',
      title: 'Đăng xuất',
      path: null,
      event: null
   }
]

export default function NavbarAdmin(props) {
   const { user, handleLogout } = props;
   const [showPopupUser, setShowPopupUser] = useState(false);
   useEffect(() => {
      function handleShowPopupUser(e) {
         if (e.target.closest('.navbar_linklist__userActive__userWrapper')) {
            setShowPopupUser((prev) => !prev);
         } else setShowPopupUser(false);
      }
      document.addEventListener('click', handleShowPopupUser);

      return () => {
         document.removeEventListener('click', handleShowPopupUser);
      }
   }, []);

   return (
      <header className="navbarAdmin admin">
         <div className='navbar__logo'>
            <Logo path={'/admin'} className='navbar__logoWapper'>
               <div className='roleText'>ADMIN</div>
            </Logo>
         </div>
         <div className="navbar__wrapperList">
            <ul className="navbar_linklist right">
               {navbarAdminConfig.map((listItem) => {
                  if (user && listItem.id === 'auth') {
                     const { name, avatar } = user;
                     return (
                        <li key={listItem.id} className="navbar_linklist__userActive">
                           <div
                              className={
                                 clsx('navbar_linklist__userActive__userWrapper')
                              }
                           >
                              <div className="avatar">
                                 <Avatar sx={{ width: 30, height: 30 }} alt={name} src={avatar} />
                              </div>
                              <div className="name">
                                 {name}
                              </div>
                           </div>
                           <ul className={clsx("navbar_linklist__userActive__acction", { 'active': showPopupUser })}>
                              {listUserActions.map(userAcction => {
                                 if (userAcction.id === 'logout') userAcction.event = handleLogout;
                                 if (userAcction.path) {
                                    return (
                                       <li key={userAcction.id} className="acctionUnit" onClick={userAcction.event}>
                                          <Link className="link" to={`${userAcction.path}`}>
                                             {userAcction.title}
                                          </Link>
                                       </li>
                                    );
                                 }
                                 return (
                                    <li key={userAcction.id}
                                       className="acctionUnit normal"
                                       onClick={userAcction.event}
                                    >
                                       {userAcction.title}
                                    </li>
                                 );
                              })}
                           </ul>
                        </li>
                     );
                  }
                  // See navbar config of customer
                  if (listItem.subList) {
                     const subList = listItem.children;
                     return (
                        <li className="listItem" key={listItem.id}>
                           <ul className="subList">
                              {subList.map((subListItem) => {
                                 return (
                                    <ShowListItem key={subListItem.id} listItem={subListItem} />
                                 );
                              })}
                           </ul>
                        </li>
                     );
                  }
                  return (
                     <ShowListItem key={listItem.id} listItem={listItem} />
                  );
               })}
            </ul>
         </div>
      </header>
   );
}