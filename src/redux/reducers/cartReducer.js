import { getCartFromLocalStorage } from '../../helpers/cartHelper';
import * as cartConst from '../constants';

const defaultState = [];

const intialState = getCartFromLocalStorage() || defaultState;

function cartReducer(state = intialState, action) {
   let newState = state;
   switch (action.type) {
      case cartConst.ADD_TO_CART:
         newState = [
            ...newState,
            action.payload
         ]
         break;
      case cartConst.UPDATE_CART:
         newState = action.payload;
         break;
      case cartConst.DELETE_CART:
         newState = action.payload;
         break;
      default:
         break;
   }
   localStorage.setItem('cart', JSON.stringify(newState));
   return newState;
}

export default cartReducer;