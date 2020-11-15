import { createStore, combineReducers} from 'redux';
import { authReducer } from './ducks/auth/reducer';

export const rootReducer = combineReducers({
  auth: authReducer
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>
export type Store = typeof store;

export default store;
