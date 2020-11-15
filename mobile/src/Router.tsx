import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import Login from './components/Login/Login';
import Grupo from './components/Grupo/Grupo';
import { RootState } from './store';
import { savaTokenAction, logoutAction } from './store/ducks/auth/actions';
import { jwtUtil } from './util/jwt';
import Register from './components/Register/Register';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.'
]);

const Stack = createStackNavigator();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Grupo} />
    </Stack.Navigator>
  );
}

function Auth() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

export default function Routes() {

  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  async function recuperarToken() {
    try {
      const token = await AsyncStorage.getItem('token') as string;
      const jwt = jwtUtil.decode(token);

      if (!jwt) {
        throw new Error();
      }

      dispatch(savaTokenAction(token, jwt));
    } catch (e) {
      dispatch(logoutAction());
    }
  }

  useEffect(() => {
    recuperarToken();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        { auth.logado ?
          <Stack.Screen name="Grupo" component={App} /> :
          <Stack.Screen name="Auth" component={Auth} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
