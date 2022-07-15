import { Checkbox, InputAdornment, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdSearch } from "react-icons/md";
import { getCategoriesApi, searchCategoriesApi } from "../apis/categoriesApi";
import MoreMenuTable from "../components/admin/moreMenuTable";
import { SearchStyle } from "../components/base/searchInput";
import { TableHeadComponent } from "../components/base/tableComponents";

const tableCateHead = [
   {id:'', note: 'for checkbox'},
   { id: 'name', label: 'Loại sản phẩm', alignRight: false },
   { id: 'note', label: 'Ghi chú', alignRight: false },
   { id: 'manipulation', label: 'Thao tác', alignRight: true }
]

export default function ChooseCategories(props) {
   const { cateSelected, handleClickCheckboxCate } = props;
   const [categories, setCategories] = useState([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [filterName, setFilterName] = useState('');
   const [totalCate, setTotalCate] = useState(0);
   const [filterCateArr, setFilterCateArr] = useState([]);
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
   }, [page, rowsPerPage]);

   useEffect(() => {
      let timeID = null;
      if (filterName === '') return;
      async function searchCategories() {
         try {
            const categories = await searchCategoriesApi(filterName);
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

   const emptyRows = useMemo(() => {
      const tmp = (page + 1) * rowsPerPage - cateFilter.length;
      return tmp > 0 ? tmp : 0;
   }, [rowsPerPage, cateFilter, page]);

   return (
      <div className="container">
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
                           const { _id: idCate, name: nameCate, note } = category;
                           const { _id: idCateSelected = null } = cateSelected || {};
                           const isItemSelected = idCate === idCateSelected;
                           return (
                              <TableRow
                                 hover
                                 key={idCate}
                                 tabIndex={-1}
                                 role="checkbox"
                                 selected={isItemSelected}
                                 aria-checked={isItemSelected}
                              >
                                 <TableCell padding="checkbox">
                                    <Checkbox 
                                       checked={isItemSelected} 
                                       onChange={(event) => handleClickCheckboxCate(event, category)} 
                                    />
                                 </TableCell>
                                 <TableCell align="left">{nameCate}</TableCell>
                                 <TableCell align="left">{note}</TableCell>
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
   );
}