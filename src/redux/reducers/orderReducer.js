import { ADD_ORDER_LIST } from '../constants';
import { getOrderListFromLocalStorage } from '../../helpers/cartHelper';

const initalState = getOrderListFromLocalStorage() || [];

export default function orderReducer(state = initalState, action) {
   let newState = state;
   switch (action.type) {
      case ADD_ORDER_LIST:
         newState = action.payload;
         break;

      default:
         break;
   }
   localStorage.setItem('orderList', JSON.stringify(newState));
   return newState;
}