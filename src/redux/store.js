import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import userReducer from './reducers/userReducer';
import cartReducer from './reducers/cartReducer';

const rootReducer = combineReducers({
   userStore: userReducer,
   cartStore: cartReducer
});

const middleware = [thunk];

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

export default store;

