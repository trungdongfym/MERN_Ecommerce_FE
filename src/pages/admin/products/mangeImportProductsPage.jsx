import { Avatar, Button, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { GrFormAdd } from "react-icons/gr";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { getProductsApi, searchProductsApi } from "../../../apis/productsApi";
import MoreMenuTable from "../../../components/admin/moreMenuTable";
import { Page } from "../../../components/base";
import { SearchStyle } from "../../../components/base/searchInput";
import { TableHeadComponent } from "../../../components/base/tableComponents";
import { priceFormat } from "../../../helpers/formats/priceFormat";
import { adminLink } from "../../../helpers/linkConstants";
import {paymenTypeEnum, importProductStatusEnum} from '../../../helpers/constants/productsConst';
import './styles/commonProducts.scss';

const tableImportProductsHead = [
   { id: 'titleImport', label: 'Tiêu đề nhập', alignRight: false },
   { id: 'supplierName', label: 'Tên nhà cung cấp', alignRight: false },
   { id: 'payment', label: 'Phương thức thanh toán', alignRight: false },
   { id: 'totalMoney', label: 'Giá bán (VNĐ)', alignRight: false },
   { id: 'status', label: 'Trạng thái', alignRight: false },
   { id: 'manipulation', label: 'Thao tác', alignRight: true }
]

const fakeImportProducts = [
   {
      _id:"sakjdf8932146123",
      titleImport:"Đơn nhập áo",
      supplierName:"Đông trung",
      note:"haizzz",
      payment:"cash",
      status:"Cancelled",
      user:"926542h2j345283645j2",
      totalMoney: 10000000
   },
   {
      _id:"sakjdf8932146123adfajhafsdhf",
      titleImport:"Đơn nhập áo",
      supplierName:"Đông trung",
      note:"haizzz",
      payment:"paypal",
      status:"Pending",
      user:"926542h2j345283645j2",
      totalMoney: 10000000
   },
   {
      _id:"sakjdf8932146123dfmnab7631",
      titleImport:"Đơn nhập áo",
      supplierName:"Đông trung",
      note:"haizzz",
      payment:"cash",
      status:"Completed",
      user:"926542h2j345283645j2",
      totalMoney: 10000000
   }
]

const paymentMap = {
   [paymenTypeEnum.cash]: 'Thanh toán tiền mặt',
   [paymenTypeEnum.paypal]: 'Thanh toán qua paypal'
}

const statusMap = {
   [importProductStatusEnum.Pending]:{
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

export default function ManageImportProductsPage() {
   const [importProducts, setImportProducts] = useState([...fakeImportProducts]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [filterName, setFilterName] = useState('');
   const [totalImportProducts, setTotalImportProducts] = useState(0);
   const [filterImportProductsArr, setFilterImportProductsArr] = useState([]);
   const isCallApi = useRef(false);

   useEffect(() => {
      async function getProducts(){
         const limit = (page + 1)*rowsPerPage - importProducts.length;
         const skip = importProducts.length;
         // enough category
         if(limit <= 0 || isCallApi.current ) return;
         try{
            isCallApi.current = true;
            const {importProducts:importProductsRetrieved, amount} = await getProductsApi(limit, skip);
            setImportProducts(prev =>{
               const tmp = structuredClone(prev.concat(importProductsRetrieved));
               if(amount >  tmp.length ) isCallApi.current = false;
               return tmp;
            });
            setTotalImportProducts(amount);
         }catch(error){
            console.log(error);
         }
      } 
      // getProducts();
   },[page, rowsPerPage]);

   useEffect(() => {
      let timeID = null;
      if(filterName === '') return;
      async function searchProducts(){
         try{
            const importProducts = await searchProductsApi(filterName);
            setFilterCateArr(importProducts);
         }catch(error){
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
   },[filterName]);

   const importProductsFilter = useMemo(() => {
      if(filterName === '') return importProducts;
      return filterImportProductsArr;
   }, [filterImportProductsArr, importProducts, filterName]);

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
      const tmp = (page + 1) * rowsPerPage - importProductsFilter.length;
      return tmp > 0 ? tmp : 0;
   },[rowsPerPage, importProductsFilter, page]);

   return (
      <Page title='Sản phẩm'>
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
                  <Tooltip title="Filter list">
                     <IconButton>
                        <BiFilter />
                     </IconButton>
                  </Tooltip>
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
                                    style={{color:`${statusMap[status].color}`, fontWeight:500}}
                                 >
                                    {statusMap[status].label}
                                 </TableCell>
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
                              <TableCell height={emptyRows*73} colSpan={tableImportProductsHead.length}>
                              </TableCell>
                           </TableRow>
                        ):null}
                     </TableBody>
                  </Table>
               </TableContainer>
               <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalImportProducts}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage='Hàng trên trang'
                  showFirstButton = {true}
                  showLastButton = {true}
               />
            </div>
         </div>
      </Page>
   );
}