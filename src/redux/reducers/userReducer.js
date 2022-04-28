import {
   ADD_USER,
   DELETE_USER,
   UPDATE_USER
} from '../constants';

import getUserActived from '../../helpers/getUserActived';

const defaultState = {
   user: null,
   isLoging: false,
}

const intialState = { user: getUserActived(), isLoging: false } || defaultState;

function userReducer(state = intialState, action) {
   switch (action.type) {
      case ADD_USER:
         return {
            ...action.payload
         }
      case DELETE_USER:
         return {
            user: action.payload,
            isLoging: false
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