import React from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { savaTokenAction, failAction } from '../../store/ducks/auth/actions';
import api, { isApiError } from '../../api';
import { jwtUtil } from '../../util/jwt';

export default function Register() {
  const dispatch = useDispatch();

  const initialValues = {
    nome: '',
    email: '',
    senha: '',
    confirmar: ''
  };

  const validationSchema = yup.object().shape({
    nome: yup.string()
      .min(4, 'Nome inválido')
      .required('Nome é um campo obrigatório.'),
    email: yup.string()
      .email('Email invalido')
      .required('E-mail é um campo obrigatório.'),
    senha: yup.string()
      .min(6, 'Senha deve ter no mínimo 6 caracteres')
      .required('Senha é um campo obrigatório.'),
    confirmar: yup.string()
      .min(6, 'Confirmar Senha deve ter no mínimo 6 caracteres')
      .oneOf([yup.ref('senha')], 'Senha e Confirmação de senha não podem ser diferentes')
      .required('Confirmar Senha é um campo obrigatório.')
  });

  async function onSubmit(values: typeof initialValues) {
    try {
      const response = await api.post('auth/register', {
        nome: values.nome,
        email: values.email,
        senha: values.senha
      });
      values.senha = '';
      values.confirmar = '';

      const token = response.data.token;
      AsyncStorage.setItem('token', token);

      const jwt = jwtUtil.decode(token);

      if (!jwt || !jwtUtil.isExpired(jwt)) {
        throw new Error();
      }

      dispatch(savaTokenAction(token, jwt));
    } catch (error) {
      let message = 'Erro ao efetuar login';

      if (isApiError(error)) {
        message = error.response.data.errors[0].message;
      }

      await AsyncStorage.removeItem('token');
      dispatch(failAction(message));
    }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View style={styles.container}>

          <TextInput
            placeholder="Nome Completo"
            autoCapitalize="none"
            onChangeText={handleChange('nome')}
            onBlur={handleBlur('nome')}
            value={values.nome}
          />

          { errors.nome && touched.nome && <Text>{errors.nome}</Text> }

          <TextInput
            placeholder="Endereço de E-mail"
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

          <TextInput
            placeholder="Confirmar Senha"
            secureTextEntry
            onChangeText={handleChange('confirmar')}
            onBlur={handleBlur('confirmar')}
            value={values.confirmar}
          />

          { errors.confirmar && touched.confirmar && <Text>{errors.confirmar}</Text> }

          <Button title="Criar Conta" disabled={isSubmitting} onPress={handleSubmit} />
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
