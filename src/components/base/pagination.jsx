import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { Link, useLocation } from 'react-router-dom';
import useQueryParam from '../../hooks/useQueryParam';

export function PaginationComp(props) {
   const { paginationData, handleChangePage, ...other } = props;
   const { totalPage, page, pageSize } = paginationData;

   return (
      <Pagination
         page={page + 1}
         count={totalPage}
         onChange={handleChangePage}
         {...other}
         renderItem={(item) => <PaginationItem {...item} />}
      />
   );
}
