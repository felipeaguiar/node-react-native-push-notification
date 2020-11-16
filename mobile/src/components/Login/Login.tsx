import React from 'react';
import { StyleSheet, View, Button, TextInput, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import api, { isApiError } from '../../api';
import { jwtUtil } from '../../util/jwt';
import { loadingAction, savaTokenAction, failAction } from '../../store/ducks/auth/actions';
import { hasLoginError, getLoginErrorMessage, isLoading } from '../../store/ducks/auth/selectors';

export default function Login() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loading = useSelector(isLoading);
  const hasError = useSelector(hasLoginError);
  const errorMessage = useSelector(getLoginErrorMessage);

  const initialValues = {
    email: '',
    senha: ''
  };

  const validationSchema = yup.object().shape({
    email: yup.string()
      .email('O valor deve ser um email válido')
      .required('E-mail é um campo obrigatório.'),
    senha: yup.string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .required('Senha é um campo obrigatório.')
  });

  async function setPlayerId() {
    const player = await AsyncStorage.getItem('player') as string;
    await api.put(`usuario/player-id/${player}`);
  }

  async function onSubmit(auth: typeof initialValues) {
    dispatch(loadingAction());

    try {
      const response = await api.post('auth/login', auth);

      const token = response.data.token;
      const jwt = jwtUtil.decode(token);

      if (!jwt) {
        throw new Error();
      }

      await AsyncStorage.setItem('token', token);
      dispatch(savaTokenAction(token, jwt));

      await setPlayerId();
    } catch (error) {
      let message = 'Erro ao efetuar login';

      if (isApiError(error)) {
        message = error.response.data.error.message;
      }

      await AsyncStorage.removeItem('token');
      dispatch(failAction(message));
    }
  }

  function onRegisterClick() {
    navigation.navigate('Register');
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>

          { hasError && <Text>{errorMessage}</Text> }

          <TextInput
            placeholder="E-mail"
            autoCapitalize="none"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />

          { errors.email && touched.email && <Text>{errors.email}</Text> }

          <TextInput
            placeholder="Senha"
            secureTextEntry
            onChangeText={handleChange('senha')}
            onBlur={handleBlur('senha')}
            value={values.senha}
          />

          { errors.senha && touched.senha && <Text>{errors.senha}</Text> }

          <Button title="Login" disabled={loading} onPress={handleSubmit} />

          <Button title="Criar Conta" disabled={loading} onPress={onRegisterClick} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
