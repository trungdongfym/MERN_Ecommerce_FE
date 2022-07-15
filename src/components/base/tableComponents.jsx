import { Checkbox, TableCell, TableHead, TableRow } from "@mui/material";

function TableHeadComponent(props) {
   const { children, tableHeadList, checkboxProps, ...otherProps } = props;
   const { numSelected, rowCount, onSelectAllClick } = checkboxProps || {};
   return (
      <TableHead {...otherProps}>
         <TableRow>
            {tableHeadList.map((headCell) => {
               if (headCell?.id === 'checkbox') {
                  return (
                     <TableCell key={headCell?.id} padding="checkbox">
                        <Checkbox
                           indeterminate={numSelected > 0 && numSelected < rowCount}
                           checked={rowCount > 0 && numSelected === rowCount}
                           onChange={onSelectAllClick}
                        />
                     </TableCell>
                  );
               }
               return (
                  <TableCell
                     key={headCell.id}
                     align={headCell.alignRight ? 'right' : 'left'}
                     className={headCell?.className}
                     sx={headCell?.styles}
                  >
                     {headCell.label}
                  </TableCell>
               );
            })}
         </TableRow>
      </TableHead>
   );
}

export {
   TableHeadComponent
}