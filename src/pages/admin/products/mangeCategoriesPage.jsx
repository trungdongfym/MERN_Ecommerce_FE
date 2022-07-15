import { Avatar, Button, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { GrFormAdd } from "react-icons/gr";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { deleteCategoryApi, getCategoriesApi, searchCategoriesApi } from "../../../apis/categoriesApi";
import MoreMenuTable from "../../../components/admin/moreMenuTable";
import { Page } from "../../../components/base";
import ConfirmDialog from "../../../components/base/conFirmDialog";
import ModalNotify from "../../../components/base/modalNotify";
import { SearchStyle } from "../../../components/base/searchInput";
import { TableHeadComponent } from "../../../components/base/tableComponents";
import { adminLink } from "../../../helpers/linkConstants";
import useCloseModal from "../../../hooks/autoCloseModal";
import './styles/commonProducts.scss';

const tableCateHead = [
   { id: 'name', label: 'Loại sản phẩm', alignRight: false },
   { id: 'amountProducts', label: 'Số lượng sản phẩm', alignRight: false },
   { id: 'note', label: 'Ghi chú', alignRight: false },
   { id: 'manipulation', label: 'Thao tác', alignRight: true }
]

function stringAvatar(name) {
   return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
   };
}

export default function ManageCategoriesPage() {
   const [categories, setCategories] = useState([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [filterName, setFilterName] = useState('');
   const [totalCate, setTotalCate] = useState(0);
   const [filterCateArr, setFilterCateArr] = useState([]);
   const [modalAlert, setModalAlert] = useState({
      open: false,
      category: null,
      title: 'Xác nhận xóa',
      message: ''
   });
   const [modalNotify, setModalNotify] = useState({ open: false, type: 'success', message: '' });
   const isCallApi = useRef(false);

   useEffect(() => {
      async function getCategories() {
         const limit = (page + 1) * rowsPerPage - categories.length;
         const skip = categories.length;
         // enough category
         if (limit <= 0 || isCallApi.current) return;
         try {
            isCallApi.current = true;
            const { categories: categoriesRetrieved, amount } = await getCategoriesApi({limit, skip});
            setCategories(prev => {
               const tmp = structuredClone(prev.concat(categoriesRetrieved));
               if (amount > tmp.length) isCallApi.current = false;
               return tmp;
            });
            setTotalCate(amount);
         } catch (error) {
            console.log(error);
         }
      }
      getCategories();
   }, [page, rowsPerPage, categories]);

   useEffect(() => {
      let timeID = null;
      if (filterName === '') return;
      async function searchCategories() {
         try {
            const categories = await searchCategoriesApi(filterName);
            setPage(0);
            setFilterCateArr(categories);
         } catch (error) {
            console.log(error);
         }
      }
      // Call api after 2 seconds
      timeID = setTimeout(() => {
         searchCategories();
      }, 1000);

      return () => {
         timeID && clearTimeout(timeID);
      }
   }, [filterName]);

   // delete cate
   const handleDeleteCategory = async (categoryID) => {
      try {
         const res = await deleteCategoryApi(categoryID);
         if (res?.status) {   
            if (filterName !== '') {
               console.log('ok');
               setFilterCateArr((prevCate) => {
                  const index = prevCate.indexOf(modalAlert.category);
                  if(index !== -1)
                     prevCate.splice(prevCate.indexOf(modalAlert.category), 1);
                  return [...prevCate];
               });
            } 
            setCategories((prevCate) => {
               const index = prevCate.indexOf(modalAlert.category);
               if(index !== -1)
                  prevCate.splice(prevCate.indexOf(modalAlert.category), 1);
               return [...prevCate];
            });
            setModalNotify({ open: true, type: 'success', message: 'Xóa thành công!' });
         } else {
            setModalNotify({ open: true, type: 'error', message: 'Xóa thất bại!' });
         }
      } catch (error) {
         setModalNotify({ open: true, type: 'error', message: error.message });
      }
   }

   const handleCloseModalAlert = (e) => {
      const { click } = e.target.dataset;
      if (click === 'confirm') {
         const { _id: cateID } = modalAlert.category || {};
         if (cateID) {
            handleDeleteCategory(cateID);
         } else {
            setModalNotify({ open: true, type: 'error', message: 'Xóa thất bại!' });
         }
      }
      setModalAlert(prev => ({ ...prev, open: false }));
   }
   //end delete cate

   const cateFilter = useMemo(() => {
      if (filterName === '') return categories;
      return filterCateArr;
   }, [filterCateArr, categories, filterName]);

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

   const handleCloseModalNotify = () => {
      setModalNotify(prev => ({ ...prev, open: false }));
   }
   useCloseModal(handleCloseModalNotify, modalNotify, 1500);

   const emptyRows = useMemo(() => {
      const tmp = (page + 1) * rowsPerPage - cateFilter.length;
      return tmp > 0 ? tmp : 0;
   }, [rowsPerPage, cateFilter, page]);

   return (
      <Page title='Thể loại sản phẩm'>
         {modalAlert.open &&
            <ConfirmDialog
               {...modalAlert}
               handleClose={handleCloseModalAlert}
            />
         }
         {modalNotify.open &&
            <ModalNotify
               {...modalNotify}
               handleClose={handleCloseModalNotify}
            />
         }
         <div className="container">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
               <Typography className="title" variant="h5" gutterBottom>
                  Loại sản phẩm
               </Typography>
               <Button variant="contained"
                  component={Link} to={adminLink.addCategoriesLink}
                  startIcon={<GrFormAdd className="icon" />}
               >
                  Thêm loại sản phẩm
               </Button>
            </Stack>
            <div className="tableContainer">
               <div className="tableContainer__toolbar">
                  <SearchStyle
                     value={filterName}
                     onChange={onFilterName}
                     placeholder="Tìm kiếm loại sản phẩm..."
                     startAdornment={
                        <InputAdornment position="start">
                           <MdSearch fontSize={'20px'} />
                        </InputAdornment>
                     }
                  />
               </div>
               <TableContainer>
                  <Table>
                     <TableHeadComponent tableHeadList={tableCateHead} />
                     <TableBody>
                        {cateFilter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                           .map((category) => {
                              const { _id: idCate, name: nameCate, 
                                 totalProducts, note, avatarOfCate = '' 
                              } = category;
                              return (
                                 <TableRow
                                    hover
                                    key={idCate}   
                                    tabIndex={-1}
                                 >
                                    <TableCell component="th" scope="row" padding="normal">
                                       <Stack direction="row" alignItems="center" spacing={2}>
                                          <Avatar 
                                             {...stringAvatar(nameCate)}  
                                             alt={nameCate} src={avatarOfCate} 
                                          />
                                          <Typography variant="subtitle2" noWrap>
                                             {nameCate}
                                          </Typography>
                                       </Stack>
                                    </TableCell>
                                    <TableCell align="left">{totalProducts}</TableCell>
                                    <TableCell align="left">{note}</TableCell>
                                    <TableCell align="right">
                                       <MoreMenuTable
                                          linkDetail={`${adminLink.detailCategoriesLink}/${idCate}`}
                                          onClickDelete={
                                             () => {
                                                setModalAlert(prev => ({
                                                   ...prev,
                                                   open: true,
                                                   category: category,
                                                   message: `Bạn có chắc chắn muốn xóa: ${nameCate}`
                                                }));
                                             }
                                          }
                                       />
                                    </TableCell>
                                 </TableRow>
                              );
                           })}
                        {emptyRows > 0 ? (
                           <TableRow>
                              <TableCell height={emptyRows * 73} colSpan={tableCateHead.length}>
                              </TableCell>
                           </TableRow>
                        ) : null}
                     </TableBody>
                  </Table>
               </TableContainer>

               <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalCate}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage='Hàng trên trang'
               />
            </div>
         </div>
      </Page>
   );
}