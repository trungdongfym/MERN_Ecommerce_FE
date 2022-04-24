
import { ADD_USER, DELETE_USER, UPDATE_USER } from './constants';

const addUserAction = (payload) => {
   return {
      type: ADD_USER,
      payload: payload
   }
}

const deleteUserAction = () => {
   return {
      type: DELETE_USER,
      payload: null
   }
}

const updateUserAction = (payload) => {
   return {
      type: UPDATE_USER,
      payload: payload
   }
}

export {
   addUserAction,
   deleteUserAction,
   updateUserAction,
}