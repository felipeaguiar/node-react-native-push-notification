import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import Router from './src/Router';
import SplashScreen from 'react-native-splash-screen';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';

function App() {

  function init() {
    SplashScreen.hide();

    OneSignal.setLogLevel(6, 0);

    OneSignal.init('4be43d8f-7f07-4c37-a20f-f44a1fa5d354', {kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
    OneSignal.inFocusDisplaying(2);

    OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);
  }

  function cleanup() {
    OneSignal.removeEventListener('received', onReceived);
    OneSignal.removeEventListener('opened', onOpened);
    OneSignal.removeEventListener('ids', onIds);
  }

  function onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  function onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  async function onIds(device) {
    await AsyncStorage.setItem('player', device.userId);
  }

  function myiOSPromptCallback(permission){
    console.log('Permission: ', permission);
  }

  useEffect(() => {
    init();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
