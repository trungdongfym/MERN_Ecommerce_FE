
const importProductStatusEnum = {
   Pending:'Pending', 
   Cancelled:'Cancelled',
   Completed:'Completed'
}

const paymenTypeEnum = {
   cash:'cash', 
   paypal:'paypal'
}

const importProductStatusArray = Object.values(importProductStatusEnum);
const paymenTypeArray = Object.values(paymenTypeEnum);

export{
   importProductStatusEnum,
   importProductStatusArray,
   paymenTypeEnum,
   paymenTypeArray
}