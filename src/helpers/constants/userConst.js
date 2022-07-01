
const methodLoginEnum = {
   normal: 'normal',
   google: 'google',
   facebook: 'facebook'
}

const roleEnum = {
   Admin: 'Admin',
   SaleStaff: 'SaleStaff',
   Custommer: 'Custommer'
}

const methodLoginArray = Object.keys(methodLoginEnum);
const roleArray = Object.values(roleEnum);

export {
   methodLoginEnum,
   methodLoginArray,
   roleEnum,
   roleArray
}