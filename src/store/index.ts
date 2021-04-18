import { createStore, Store as ReduxStore } from 'redux';
import { combineReducers } from 'redux';
import { Partition } from './reducer/partitions';
import { Tax } from './reducer/tax';
import { metrics } from './reducer/metrics';
import { Configs } from './reducer/configs';
const reducers = combineReducers({
    Partition,
    Tax,
    metrics,
    Configs
});
export const store: ReduxStore = createStore(reducers);
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
