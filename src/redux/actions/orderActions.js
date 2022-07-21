import { ADD_ORDER_LIST } from '../constants';

const addOrderListAction = (orderList) => {
   return {
      type: ADD_ORDER_LIST,
      payload: orderList
   }
}

export {
   addOrderListAction
}
