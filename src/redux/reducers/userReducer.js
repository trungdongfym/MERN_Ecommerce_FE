import {
   ADD_USER,
   DELETE_USER,
   UPDATE_USER
} from '../constants';

const intialState = {
   user: null,
}

function userReducer(state = intialState, action) {
   switch (action.type) {
      case ADD_USER:
         return {
            user: action.payload
         }
      case DELETE_USER:
         return {
            user: action.payload
         }
      case UPDATE_USER:
         return {
            ...state,
            ...action.payload
         }
      default:
         return state;
   }
}

export default userReducer;