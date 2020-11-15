import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { fireEvent, waitFor, act } from 'react-native-testing-library';
import AsyncStorage from '@react-native-community/async-storage';
import Register from './Register';
import { registerMock } from '../../test/http-mock';
import store from '../../store';
import { renderWithRedux } from '../../test/reduxMock';

it('register snapshot', () => {
  expect.hasAssertions();

  const { toJSON } = renderWithRedux(<Register />);
  expect(toJSON()).toMatchSnapshot();
});

it('registrando com sucesso', async () => {
  expect.hasAssertions();

  registerMock();
  const { toJSON, getByPlaceholder, getByText } = renderWithRedux(<Register />, { store } );

  const nome = getByPlaceholder('Nome Completo');
  const email = getByPlaceholder('Endereço de E-mail');
  const senha = getByPlaceholder('Senha');
  const confirmar = getByPlaceholder('Confirmar Senha');
  const criar = getByText('Criar Conta');

  fireEvent.changeText(nome, 'Felipe Aguiar');
  fireEvent.changeText(email, 'felipe@mail.com');
  fireEvent.changeText(senha, '123456');
  fireEvent.changeText(confirmar, '123456');

  fireEvent.press(criar);

  await waitFor(() => expect(criar).toBeEnabled());

  const token = await AsyncStorage.getItem('token');

  expect(nome).toHaveProp('value', expect.any(String));
  expect(email).toHaveProp('value', expect.any(String));

  expect(senha).toHaveProp('value', '');
  expect(confirmar).toHaveProp('value', '');

  expect(token).not.toBeNull();
  expect(token).toBe(store.getState().auth.token);

  expect(toJSON()).toMatchSnapshot();
});

it('registrando com falha', async () => {
  expect.hasAssertions();

  registerMock();
  const { toJSON, getByPlaceholder, getByText, queryByText } = renderWithRedux(<Register />, { store } );

  const nome = getByPlaceholder('Nome Completo');
  const email = getByPlaceholder('Endereço de E-mail');
  const senha = getByPlaceholder('Senha');
  const confirmar = getByPlaceholder('Confirmar Senha');
  const criar = getByText('Criar Conta');

  fireEvent.changeText(nome, 'Fel');
  fireEvent.changeText(email, 'mail.com');
  fireEvent.changeText(senha, '123');
  fireEvent.changeText(confirmar, '654321');

  await act(async() => fireEvent.press(criar));

  const nomeError = queryByText('Nome inválido');
  const emailError = queryByText('Email invalido');
  const senhaError = queryByText('Senha deve ter no mínimo 6 caracteres');
  const confirmarError = queryByText('Senha e Confirmação de senha não podem ser diferentes');

  expect(nomeError).toBeTruthy();
  expect(emailError).toBeTruthy();
  expect(senhaError).toBeTruthy();
  expect(confirmarError).toBeTruthy();

  expect(nome).toHaveProp('value', expect.any(String));
  expect(email).toHaveProp('value', expect.any(String));

  expect(toJSON()).toMatchSnapshot();
});
