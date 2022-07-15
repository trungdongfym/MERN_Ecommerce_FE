import { Button, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { GrFormAdd } from "react-icons/gr";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { deleteImportProductApi, getImportProductsApi } from "../../../apis/productsApi";
import MoreMenuTable from "../../../components/admin/moreMenuTable";
import { Page } from "../../../components/base";
import ConfirmDialog from "../../../components/base/conFirmDialog";
import NativeSelectCustom from "../../../components/base/inputField";
import ModalNotify from "../../../components/base/modalNotify";
import { SearchStyle } from "../../../components/base/searchInput";
import { TableHeadComponent } from "../../../components/base/tableComponents";
import { importProductStatusEnum, paymenTypeEnum } from '../../../helpers/constants/productsConst';
import { priceFormat } from "../../../helpers/formats/priceFormat";
import { adminLink } from "../../../helpers/linkConstants";
import useCloseModal from "../../../hooks/autoCloseModal";
import './styles/commonProducts.scss';

const tableImportProductsHead = [
   { id: 'titleImport', label: 'Tiêu đề nhập', alignRight: false },
   { id: 'supplierName', label: 'Tên nhà cung cấp', alignRight: false },
   { id: 'payment', label: 'Phương thức thanh toán', alignRight: false },
   { id: 'totalMoney', label: 'Tổng tiền (VNĐ)', alignRight: false },
   { id: 'status', label: 'Trạng thái', alignRight: false },
   { id: 'manipulation', label: 'Thao tác', alignRight: true }
]

const paymentMap = {
   [paymenTypeEnum.cash]: 'Thanh toán tiền mặt',
   [paymenTypeEnum.paypal]: 'Thanh toán qua paypal'
}

const statusMap = {
   [importProductStatusEnum.Pending]: {
      label: 'Chờ duyệt',
      color: '#fabb05'
   },
   [importProductStatusEnum.Cancelled]: {
      label: 'Đã hủy',
      color: '#e94235'
   },
   [importProductStatusEnum.Completed]: {
      label: 'Hoàn thành',
      color: '#34a853'
   },
}

const statusOptions = [
   {
      id: 'All',
      label: 'Tất cả',
      value: "All",
   },
   {
      id: importProductStatusEnum.Pending,
      label: statusMap[importProductStatusEnum.Pending].label,
      value: importProductStatusEnum.Pending,
   },
   {
      id: importProductStatusEnum.Cancelled,
      label: statusMap[importProductStatusEnum.Cancelled].label,
      value: importProductStatusEnum.Cancelled,
   },
   {
      id: importProductStatusEnum.Completed,
      label: statusMap[importProductStatusEnum.Completed].label,
      value: importProductStatusEnum.Completed,
   },
]

const paymentOptions = [
   {
      id: 'All',
      label: 'Tất cả',
      value: "All",
   },
   {
      id: paymenTypeEnum.cash,
      label: paymentMap[paymenTypeEnum.cash],
      value: paymenTypeEnum.cash,
   },
   {
      id: paymenTypeEnum.paypal,
      label: paymentMap[paymenTypeEnum.paypal],
      value: paymenTypeEnum.paypal,
   },
]

export default function ManageImportProductsPage() {
   const [importProducts, setImportProducts] = useState([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [filterName, setFilterName] = useState('');
   const [totalImportProducts, setTotalImportProducts] = useState(0);
   const [filterImportProductsArr, setFilterImportProductsArr] = useState([]);
   const [filterValue, setFilterValue] = useState({
      status: 'All', payment: 'All'
   });
   const [modalAlert, setModalAlert] = useState({
      open: false,
      importProduct: null,
      title: 'Xác nhận xóa',
      message: ''
   });
   const [modalNotify, setModalNotify] = useState({ open: false, type: 'success', message: '' });
   const isCallApi = useRef(false);
   const isFilterNameChange = useRef(false);
   const isShowFilterArr = useRef(false);

   useEffect(() => {
      async function getImportProducts() {
         const limit = (page + 1) * rowsPerPage - importProducts.length;
         const skip = importProducts.length;
         // enough category
         if (limit <= 0 || isCallApi.current) return;
         try {
            isCallApi.current = true;
            const { 
               importProducts: importProductsRetrieved, 
               amount 
            } = await getImportProductsApi({limit, skip});
            setImportProducts(prev => {
               const tmp = structuredClone(prev.concat(importProductsRetrieved));
               if (amount > tmp.length) isCallApi.current = false;
               return tmp;
            });
            setTotalImportProducts(amount);
         } catch (error) {
            console.log(error);
         }
      }
      getImportProducts();
   }, [page, rowsPerPage, importProducts]);

   // filter import order
   useEffect(() => {
      if(filterName ==='' && filterValue.status === 'All' && filterValue.payment === 'All') {
         setImportProducts((prev) => ([...prev]));
         return;
      }
      let timeID = null;
      const cloneFilterValue = structuredClone(filterValue);
      // Dont send when field = all
      if(cloneFilterValue.status === 'All') 
         delete cloneFilterValue.status;
      if(cloneFilterValue.payment === 'All')
         delete cloneFilterValue.payment;
      if(filterName !== ''){
         cloneFilterValue.textSearch = filterName;
      }
      async function filterImportProducts() {
         try {
            const importProducts = await getImportProductsApi({match: cloneFilterValue});
            isFilterNameChange.current = false; // reset detect FilterName Change
            setFilterImportProductsArr(importProducts);
         } catch (error) {
            console.log(error);
         }
      }
      // console.log(filterName+ ' okok')
      if(isFilterNameChange.current && filterName !==''){
         timeID = setTimeout(() => {
            filterImportProducts();
         }, 1500);
      } else {
         filterImportProducts();
      }

      return () => {
         timeID && clearTimeout(timeID);
      }
   }, [filterValue, filterName]);
   //end filter import order

   const importProductsFilter = useMemo(() => {
      if (filterName === '' && filterValue.status === 'All' && filterValue.payment === 'All') {
         isShowFilterArr.current = false;
         return importProducts;
      }
      isShowFilterArr.current = true;
      return filterImportProductsArr;
   }, [filterImportProductsArr, importProducts, filterName]);

   const onFilterName = (e) => {
      isFilterNameChange.current = true;
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
      const tmp = (page + 1) * rowsPerPage - importProductsFilter.length;
      return tmp > 0 ? tmp : 0;
   }, [rowsPerPage, importProductsFilter, page]);

   // delete import product
   const handleDeleteImportProduct = async (importProductD) => {
      try {
         const res = await deleteImportProductApi(importProductD);
         if (res?.status) {
            if (filterName !== '') {
               setFilterImportProductsArr((prevImport) => {
                  const index = prevImport.indexOf(modalAlert.importProduct);
                  if(index !== -1)
                     prevImport.splice(prevImport.indexOf(modalAlert.importProduct), 1);
                  return [...prevImport];
               });
            } 
            setImportProducts((prevImport) => {
               const index = prevImport.indexOf(modalAlert.importProduct);
               if(index !== -1)
                  prevImport.splice(prevImport.indexOf(modalAlert.importProduct), 1);
               return [...prevImport];
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
         const { _id: importProductID } = modalAlert.importProduct || {};
         if (importProductID) {
            handleDeleteImportProduct(importProductID);
         } else {
            setModalNotify({ open: true, type: 'error', message: 'Xóa thất bại!' });
         }
      }
      setModalAlert(prev => ({ ...prev, open: false }));
   }
   //end delete import product
   const handleCloseModalNotify = () => {
      setModalNotify(prev => ({ ...prev, open: false }));
   }
   useCloseModal(handleCloseModalNotify, modalNotify, 1500);

   return (
      <Page title='Đơn nhập sản phẩm'>
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
                  Nhập sản phẩm
               </Typography>
               <Button variant="contained"
                  component={Link} to={adminLink.addImportProductsLink}
                  startIcon={<GrFormAdd className="icon" />}
               >
                  Thêm đơn nhập
               </Button>
            </Stack>
            <div className="tableContainer">
               <div className="tableContainer__toolbar">
                  <SearchStyle
                     value={filterName}
                     onChange={onFilterName}
                     placeholder="Tìm đơn nhập..."
                     startAdornment={
                        <InputAdornment position="start">
                           <MdSearch fontSize={'20px'} />
                        </InputAdornment>
                     }
                  />
                  <div className="tableContainer__toolbar__filter">
                     <p className="tableContainer__toolbar__filter__title">Bộ lọc</p>
                     <div className="tableContainer__toolbar__filter__inputFilter">
                        <NativeSelectCustom
                           optionsList = {paymentOptions}
                           label = 'Phương thức thanh toán'
                           field = {{
                              name:'paymentImport',
                              value: filterValue.payment,
                              onChange: (e) => {
                                 setFilterValue((prev) => ({...prev, payment: e.target.value}));
                              }
                           }}
                        />
                     </div>
                     <div className="tableContainer__toolbar__filter__inputFilter">
                        <NativeSelectCustom
                           optionsList = {statusOptions}
                           label = 'Trạng thái đơn nhập'
                           field = {{
                              name:'statusImport',
                              value: filterValue.status,
                              onChange: (e) => {
                                 setFilterValue((prev) => ({...prev,status: e.target.value}));
                              }
                           }}
                        />
                     </div>
                  </div>
               </div>
               <TableContainer>
                  <Table>
                     <TableHeadComponent tableHeadList={tableImportProductsHead} />
                     <TableBody>
                        {importProductsFilter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                           .map((importProduct) => {
                              const {
                                 _id: idImportProduct,
                                 titleImport,
                                 payment,
                                 status,
                                 supplierName,
                                 totalMoney
                              } = importProduct;
                              return (
                                 <TableRow
                                    hover
                                    key={idImportProduct}
                                    tabIndex={-1}
                                 >
                                    <TableCell component="th" scope="row" padding="normal">
                                       {titleImport}
                                    </TableCell>
                                    <TableCell align="left">{supplierName}</TableCell>
                                    <TableCell align="left">{paymentMap[payment]}</TableCell>
                                    <TableCell align="left">{priceFormat(totalMoney)}</TableCell>
                                    <TableCell align="left"
                                       style={{ color: `${statusMap[status].color}`, fontWeight: 500 }}
                                    >
                                       {statusMap[status].label}
                                    </TableCell>
                                    <TableCell align="right">
                                       <MoreMenuTable
                                          onClickDelete={
                                             () => {
                                                setModalAlert(prev => ({
                                                   ...prev,
                                                   open: true,
                                                   importProduct: importProduct,
                                                   message: `Bạn có chắc chắn muốn xóa: ${titleImport}`
                                                }));
                                             }
                                          }
                                          linkDetail={
                                             `${adminLink.detailImportProductsLink}/${idImportProduct}`
                                          }
                                       />
                                    </TableCell>
                                 </TableRow>
                              );
                           })}
                        {emptyRows > 0 ? (
                           <TableRow>
                              <TableCell height={emptyRows * 73} colSpan={tableImportProductsHead.length}>
                              </TableCell>
                           </TableRow>
                        ) : null}
                     </TableBody>
                  </Table>
               </TableContainer>
               <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={isShowFilterArr.current ?  filterImportProductsArr.length: totalImportProducts}
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