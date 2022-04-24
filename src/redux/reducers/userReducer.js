import {
   ADD_USER,
   DELETE_USER,
   UPDATE_USER
} from '../constants';

function userReducer(state, action) {
   switch (action.type) {
      case ADD_USER:
         break;
      case DELETE_USER:
         break;
      case UPDATE_USER:
         break;
      default:
         return state;
   }
}

export default userReducer;