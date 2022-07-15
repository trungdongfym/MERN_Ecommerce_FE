import {
   ADD_USER,
   DELETE_USER,
   LOGIN_USER,
   UPDATE_USER
} from '../constants';

import getUserActived from '../../helpers/getUserActived';
// user format 
/*
user:{
   email(pin):"trungdong1@gmail.com"
   role(pin):"Custommer"
   avatar(pin):""
   _id(pin):"62b6d023284aa38e35797b58"
   methodLogin(pin):"normal"
   name(pin):"Đông Lê"
}
 */
const defaultState = {
   user: null,
   isLoging: false,
}

const intialState = { user: getUserActived(), isLoging: false } || defaultState;

function userReducer(state = intialState, action) {
   switch (action.type) {
      case ADD_USER:
         const { user:userAdd } = action.payload;
         // Save user to store and localStorage
         localStorage.setItem('user', JSON.stringify(userAdd));
         return {
            ...action.payload
         }
      case DELETE_USER:
         localStorage.removeItem('user');
         return {
            user: action.payload,
            isLoging: false
         }
      case UPDATE_USER:
         const userUpdate = {
            ...state.user,
            ...action.payload
         }
         localStorage.setItem('user', JSON.stringify(userUpdate));
         return {
            ...state,
            user:userUpdate
         }
      case LOGIN_USER:
         return {
            ...state,
            ...action.payload
         }
      default:
         return state;
   }
}

export default userReducer;