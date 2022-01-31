import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import RootReducer from '../reducers/RootReducer';
import RootSaga from '../saga/RootSaga';

const sagaMiddleware = createSagaMiddleware();

// const store = createStore(RootReducer, applyMiddleware(sagaMiddleware, logger)); //
const store = createStore(RootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(RootSaga);

export default store;
