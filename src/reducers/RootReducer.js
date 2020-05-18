import { combineReducers } from 'redux';
import TokenReducer from '../reducers/TokenReducer';
import UserReducer from '../reducers/UserReducer'

const allReducers = combineReducers({
    TokenReducer: TokenReducer,
    UserReducer: UserReducer,
});


const RootReducer = (state, action) => {
    return allReducers(state, action)
};

export default RootReducer