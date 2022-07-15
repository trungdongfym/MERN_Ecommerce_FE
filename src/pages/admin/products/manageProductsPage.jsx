import { Avatar, Button, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { GrFormAdd } from "react-icons/gr";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { deleteProductApi, getProductsApi, searchProductsApi } from "../../../apis/productsApi";
import MoreMenuTable from "../../../components/admin/moreMenuTable";
import { Page } from "../../../components/base";
import ConfirmDialog from "../../../components/base/conFirmDialog";
import ModalNotify from "../../../components/base/modalNotify";
import { SearchStyle } from "../../../components/base/searchInput";
import { TableHeadComponent } from "../../../components/base/tableComponents";
import { priceFormat } from "../../../helpers/formats/priceFormat";
import { adminLink } from "../../../helpers/linkConstants";
import useCloseModal from "../../../hooks/autoCloseModal";
import './styles/commonProducts.scss';

const tableProductsHead = [
   { id: 'name', label: 'Tên sản phẩm', alignRight: false },
   { id: 'category', label: 'Loại sản phẩm', alignRight: false },
   { id: 'price', label: 'Giá bán (VNĐ)', alignRight: false },
   { id: 'sale', label: 'Giảm giá (%)', alignRight: false },
   { id: 'manipulation', label: 'Thao tác', alignRight: true }
]

export default function ManageProductsPage() {
   const [products, setProducts] = useState([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [filterName, setFilterName] = useState('');
   const [totalProducts, setTotalProducts] = useState(0);
   const [filterProductsArr, setFilterProducts] = useState([]);
   const isCallApi = useRef(false);
   const [modalAlert, setModalAlert] = useState({
      open: false,
      product: null,
      title: 'Xác nhận xóa',
      message: ''
   });
   const [modalNotify, setModalNotify] = useState({ open: false, type: 'success', message: '' });

   useEffect(() => {
      async function getProducts(){
         const limit = (page + 1)*rowsPerPage - products.length;
         const skip = products.length;
         // enough category
         if(limit <= 0 || isCallApi.current ) return;
         try{
            isCallApi.current = true;
            const objectQuery = {limit, skip, requireCate: true};
            const {products:productsRetrieved, amount} = await getProductsApi(objectQuery);
            setProducts(prev =>{
               const tmp = structuredClone(prev.concat(productsRetrieved));
               if(amount >  tmp.length ) isCallApi.current = false;
               return tmp;
            });
            setTotalProducts(amount);
         }catch(error){
            console.log(error);
         }
      } 
      getProducts();
   },[page, rowsPerPage, products]);

   useEffect(() => {
      let timeID = null;
      if(filterName === '') return;
      async function searchProducts(){
         try{
            const products = await searchProductsApi(filterName);
            setFilterProducts(products);
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

   // delete cate
   const handleDeleteProduct = async (productID) => {
      try {
         const res = await deleteProductApi(productID);
         if (res?.status) {
            if (filterName !== '') {
               setFilterProducts((prevProduct) => {
                  const index = prevProduct.indexOf(modalAlert.product);
                  if(index !== -1)
                     prevProduct.splice(prevProduct.indexOf(modalAlert.product), 1);
                  return [...prevProduct];
               });
            } 
            setProducts((prevProduct) => {
               const index = prevProduct.indexOf(modalAlert.product);
               if(index !== -1)
                  prevProduct.splice(prevProduct.indexOf(modalAlert.product), 1);
               return [...prevProduct];
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
         const { _id: productID } = modalAlert.product || {};
         if (productID) {
            handleDeleteProduct(productID);
         } else {
            setModalNotify({ open: true, type: 'error', message: 'Xóa thất bại!' });
         }
      }
      setModalAlert(prev => ({ ...prev, open: false }));
   }
   //end delete cate
   const handleCloseModalNotify = () => {
      setModalNotify(prev => ({ ...prev, open: false }));
   }
   useCloseModal(handleCloseModalNotify, modalNotify, 1500);

   const productsFilter = useMemo(() => {
      if(filterName === '') return products;
      return filterProductsArr;
   }, [filterProductsArr, products, filterName]);

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
      const tmp = (page + 1) * rowsPerPage - productsFilter.length;
      return tmp > 0 ? tmp : 0;
   },[rowsPerPage, productsFilter, page]);

   return (
      <Page title='Sản phẩm'>
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
                  Sản phẩm
               </Typography>
               <Button variant="contained"
                  component={Link} to={adminLink.addProductsLink}
                  startIcon={<GrFormAdd className="icon" />}
               >
                  Thêm sản phẩm
               </Button>
            </Stack>
            <div className="tableContainer">
               <div className="tableContainer__toolbar">
                  <SearchStyle
                     value={filterName}
                     onChange={onFilterName}
                     placeholder="Tìm kiếm sản phẩm..."
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
                        {productsFilter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((product) => {
                           const { _id: idProduct, name: nameProduct, 
                              image, price, category, sale 
                           } = product;
                           const { name: nameCate } = category || {};

                           return (
                              <TableRow
                                 hover
                                 key={idProduct}
                                 tabIndex={-1}
                              >
                                 <TableCell component="th" scope="row" padding="normal">
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                       <Avatar alt={nameProduct} src={image} />
                                       <Typography variant="subtitle2" noWrap>
                                          {nameProduct}
                                       </Typography>
                                    </Stack>
                                 </TableCell>
                                 <TableCell align="left">{nameCate}</TableCell>
                                 <TableCell align="left">{priceFormat(price)}</TableCell>
                                 <TableCell align="left">{sale}</TableCell>
                                 <TableCell align="right">
                                    <MoreMenuTable
                                       onClickDelete={
                                          () => {
                                             setModalAlert(prev => ({
                                                ...prev,
                                                open: true,
                                                product: product,
                                                message: `Bạn có chắc chắn muốn xóa: ${nameProduct}`
                                             }));
                                          }
                                       }
                                       linkDetail={`${adminLink.detailProductsLink}/${idProduct}`}
                                    />
                                 </TableCell>
                              </TableRow>
                           );
                        })}
                        {emptyRows > 0 ? (
                           <TableRow>
                              <TableCell height={emptyRows*73} colSpan={tableProductsHead.length}>
                              </TableCell>
                           </TableRow>
                        ):null}
                     </TableBody>
                  </Table>
               </TableContainer>
               <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalProducts}
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