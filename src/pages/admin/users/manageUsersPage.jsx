import { Avatar, Button, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { GrFormAdd } from "react-icons/gr";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { searchProductsApi } from "../../../apis/productsApi";
import { getUsersApi } from "../../../apis/userApi";
import MoreMenuTable from "../../../components/admin/moreMenuTable";
import { Page } from "../../../components/base";
import { SearchStyle } from "../../../components/base/searchInput";
import { TableHeadComponent } from "../../../components/base/tableComponents";
import { adminLink } from "../../../helpers/linkConstants";

const tableProductsHead = [
   { id: 'name', label: 'Tên người dùng', alignRight: false },
   { id: 'email', label: 'Email', alignRight: false },
   { id: 'gender', label: 'Giới tính', alignRight: false },
   { id: 'methodLogin', label: 'Đăng nhập', alignRight: false },
   { id: 'role', label: 'Vai trò', alignRight: false },
   { id: 'manipulation', label: 'Thao tác', alignRight: true }
]

export default function ManageUsersPage() {
   const [users, setUsers] = useState([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [filterName, setFilterName] = useState('');
   const [totalUsers, setTotalUsers] = useState(0);
   const [filterUsersArr, setFilterUsersArr] = useState([]);
   const isCallApi = useRef(false);

   useEffect(() => {
      async function getProducts() {
         const limit = (page + 1) * rowsPerPage - users.length;
         const skip = users.length;
         // enough category
         if (limit <= 0 || isCallApi.current) return;
         try {
            isCallApi.current = true;
            const { users: usersRetrieved, amount } = await getUsersApi({ limit, skip });
            setUsers(prev => {
               const tmp = structuredClone(prev.concat(usersRetrieved));
               if (amount > tmp.length) isCallApi.current = false;
               return tmp;
            });
            setTotalUsers(amount);
         } catch (error) {
            console.log(error);
         }
      }
      getProducts();
   }, [page, rowsPerPage]);

   useEffect(() => {
      let timeID = null;
      if (filterName === '') return;
      async function searchProducts() {
         try {
            const users = await searchProductsApi(filterName);
            setFilterUsersArr(users);
         } catch (error) {
            console.log(error);
         }
      }
      // Call api after 2 seconds
      timeID = setTimeout(() => {
         searchProducts();
      }, 1000);

      return () => {
         timeID && clearTimeout(timeID);
      }
   }, [filterName]);

   const usersFilter = useMemo(() => {
      if (filterName === '') return users;
      return filterUsersArr;
   }, [filterUsersArr, users, filterName]);

   const onFilterName = (e) => {
      setFilterName(e.target.value);
   }

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const emptyRows = useMemo(() => {
      const tmp = (page + 1) * rowsPerPage - usersFilter.length;
      return tmp > 0 ? tmp : 0;
   }, [rowsPerPage, usersFilter, page]);

   return (
      <Page title='Quản lý người dùng'>
         <div className="container">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
               <Typography className="title" variant="h5" gutterBottom>
                  Người dùng
               </Typography>
               <Button variant="contained"
                  component={Link} to={adminLink.addProductsLink}
                  startIcon={<GrFormAdd className="icon" />}
               >
                  Thêm người dùng
               </Button>
            </Stack>
            <div className="tableContainer">
               <div className="tableContainer__toolbar">
                  <SearchStyle
                     value={filterName}
                     onChange={onFilterName}
                     placeholder="Tìm kiếm người dùng..."
                     startAdornment={
                        <InputAdornment position="start">
                           <MdSearch fontSize={'20px'} />
                        </InputAdornment>
                     }
                  />
                  <Tooltip title="Filter list">
                     <IconButton>
                        <BiFilter />
                     </IconButton>
                  </Tooltip>
               </div>
               <TableContainer>
                  <Table>
                     <TableHeadComponent tableHeadList={tableProductsHead} />
                     <TableBody>
                        {usersFilter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                           .map((user) => {
                              const { _id, name, email, gender, methodLogin, role, avatar } = user;
                              return (
                                 <TableRow
                                    hover
                                    key={_id}
                                    tabIndex={-1}
                                 >
                                    <TableCell component="th" scope="row" padding="normal">
                                       <Stack direction="row" alignItems="center" spacing={2}>
                                          <Avatar alt={name} src={avatar} />
                                          <Typography variant="subtitle2" noWrap>
                                             {name}
                                          </Typography>
                                       </Stack>
                                    </TableCell>
                                    <TableCell align="left">{email}</TableCell>
                                    <TableCell align="left">{gender}</TableCell>
                                    <TableCell align="left">{methodLogin}</TableCell>
                                    <TableCell align="left">{role}</TableCell>
                                    <TableCell align="right">
                                       <MoreMenuTable
                                          linkDelete='/'
                                          linkDetail='/'
                                       />
                                    </TableCell>
                                 </TableRow>
                              );
                           })}
                        {emptyRows > 0 ? (
                           <TableRow>
                              <TableCell height={emptyRows * 73} colSpan={tableProductsHead.length}>
                              </TableCell>
                           </TableRow>
                        ) : null}
                     </TableBody>
                  </Table>
               </TableContainer>
               <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalUsers}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage='Hàng trên trang'
                  showFirstButton={true}
                  showLastButton={true}
               />
            </div>
         </div>
      </Page>
   );
}