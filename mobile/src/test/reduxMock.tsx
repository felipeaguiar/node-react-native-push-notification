import React from 'react';
import { render } from 'react-native-testing-library';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer } from '../store';
import { initialState as auth } from '../store/ducks/auth/reducer';

const rootState = {
  auth
};

export function renderWithRedux(
  ui,
  {
    initialState = rootState,
    store = createStore(rootReducer, initialState),
    ...renderOptions
  } = {}
) {

  function Wrapper({ children }) {

    return (
      <Provider store={store}>
        {children}
      </Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
