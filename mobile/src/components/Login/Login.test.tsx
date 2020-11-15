import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { fireEvent, waitFor } from 'react-native-testing-library';
import AsyncStorage from '@react-native-community/async-storage';
import Login from './Login';
import { loginMock } from '../../test/http-mock';
import store from '../../store';
import { renderWithRedux } from '../../test/reduxMock';

it('login snapshot', () => {
  expect.hasAssertions();

  const { toJSON } = renderWithRedux(<Login />);
  expect(toJSON()).toMatchSnapshot();
});

it('login teste de integração com sucesso', async () => {
  expect.hasAssertions();

  loginMock('felipe@mail.com', '123456');

  const { toJSON, getByPlaceholder, getByText, queryByText } = renderWithRedux(<Login />, { store } );

  const email = getByPlaceholder('E-mail');
  const senha = getByPlaceholder('Senha');
  const login = getByText('Login');

  fireEvent.changeText(email, 'felipe@mail.com');
  fireEvent.changeText(senha, '123456');

  fireEvent.press(login);

  await waitFor(() => expect(login).toBeEnabled());

  const token = await AsyncStorage.getItem('token');
  const alert = queryByText('Usuário ou senha inválidos');

  expect(toJSON()).toMatchSnapshot();
  expect(email).toHaveProp('value', 'felipe@mail.com');
  expect(senha).toHaveProp('value', '');
  expect(alert).toBeFalsy();
  expect(token).not.toBeNull();
  expect(token).toBe(store.getState().auth.token);
});

it('login teste de integração com falha', async () => {
  expect.hasAssertions();

  loginMock('felipe@mail.com', '654321');

  const { toJSON, getByPlaceholder, getByText, queryByText } = renderWithRedux(<Login />, { store } );

  const email = getByPlaceholder('E-mail');
  const senha = getByPlaceholder('Senha');
  const login = getByText('Login');

  fireEvent.changeText(email, 'felipe@mail.com');
  fireEvent.changeText(senha, '654321');

  fireEvent.press(login);

  await waitFor(() => expect(login).toBeEnabled());

  const token = await AsyncStorage.getItem('token');
  const alert = queryByText('Usuário ou senha inválidos');

  expect(toJSON()).toMatchSnapshot();
  expect(email).toHaveProp('value', 'felipe@mail.com');
  expect(senha).toHaveProp('value', '');
  expect(alert).toBeTruthy();
  expect(token).toBeNull();
  expect(token).toBe(store.getState().auth.token);
});
