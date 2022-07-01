import { TableCell, TableHead, TableRow } from "@mui/material";

function TableHeadComponent(props){
   const { tableHeadList } = props;
   return(
      <TableHead>
         <TableRow>
            {tableHeadList.map((headCell) => (
               <TableCell
                  key={headCell.id}
                  align={headCell.alignRight ? 'right' : 'left'}
               >
                  {headCell.label}
               </TableCell>
            ))}
         </TableRow>
      </TableHead>
   );
}

export {
   TableHeadComponent
}