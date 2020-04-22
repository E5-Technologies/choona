import { combineReducers } from 'redux';
import TokenReducer from '../reducers/TokenReducer';

const allReducers = combineReducers({
    TokenReducer: TokenReducer
});


const RootReducer = (state, action) => {
    return allReducers(state, action)
};

export default RootReducer