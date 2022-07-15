import { Box } from "@mui/material";
import { footerConfig } from "./configs/footerConfig";
import { Link } from 'react-router-dom';
import { AiFillHeart } from 'react-icons/ai';
import clsx from "clsx";
import './styles/footerStyles.scss';

export default function FooterSection() {
   return (
      <footer className="footer">
         <div className="footer__container">
            <div className="footer__container__row">
               {footerConfig.map((footerItem) => {
                  const { id, label, icon, title, path, subList } = footerItem;
                  return (
                     <div key={id} className="groupFooter">
                        <Box
                           component={path ? Link : 'div'}
                           to={path}
                           className={clsx('groupFooter__title', { link: path ? true : false })}
                        >
                           {icon}
                           <div className="groupFooter__title__label">{label}</div>
                        </Box>
                        {subList &&
                           <ul className="groupFooter__subList">
                              {subList.map((subListItem) => {
                                 const { id, label, icon, title, path} = subListItem;
                                 return (
                                    <li key={id} className="groupFooter__subList__item">
                                       <Box
                                          component={path ? Link : 'div'}
                                          className={clsx('itemWapper', { link: path ? true : false })}
                                          to={path}
                                       >
                                          {icon && <span className="itemWapper__icon">{icon}</span>}
                                          <div className="itemWapper__title">{label}</div>
                                       </Box>
                                    </li>
                                 );
                              })}
                           </ul>
                        }
                     </div>
                  );
               })}
            </div>
            <div className="footer__container__footerEnd">
               <div className="copyrightWapper">
                  <div className="copyrightWapper__content">
                     <p className="copyrightWapper__content__text">
                        Copyright ©2021. Tất cả các quyền được bảo lưu.
                     </p>
                     <span className="copyrightWapper__content__author">
                        <span className="icon">
                           <AiFillHeart />
                        </span>
                        <span className="author">bởi Trung Đông</span>
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </footer>
   );
}