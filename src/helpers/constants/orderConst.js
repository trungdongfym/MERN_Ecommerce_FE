const statusOrderEnum = {
   PENDING: 'Pending',
   CANCELED: 'Canceled',
   APPROVED: 'Approved',
   COMPLETE: 'Completed',
   DELIVERY: 'Delivery'
}

const statusOrderArray = Object.values(statusOrderEnum);

export {
   statusOrderEnum,
   statusOrderArray
}