import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import Router from './src/Router';
import SplashScreen from 'react-native-splash-screen';

function App() {

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
