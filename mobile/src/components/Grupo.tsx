import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../store/ducks/auth/actions';

export default function Perfil() {
  const dispatch = useDispatch();

  async function logout() {
    await AsyncStorage.removeItem('token');
    dispatch(logoutAction());
  }

  return (
    <View style={styles.container}>
      <Text>Grupo</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
