import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, FlatList, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { getUserId } from '../../store/ducks/auth/selectors';
import { logoutAction } from '../../store/ducks/auth/actions';
import { Grupo, Usuario } from '../../model/grupo';
import api from '../../api';

export default function Perfil() {
  const dispatch = useDispatch();
  const id = useSelector(getUserId);
  const size = 10;

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);

  async function logout() {
    await AsyncStorage.removeItem('token');
    dispatch(logoutAction());
  }

  function usuarioEstaNoGrupo(grupo: Grupo) {
    const usuarios = grupo.usuarios || [] as Usuario[];
    const usuario = usuarios.find(u => u.id === id);

    if (usuario) {
      return true;
    }

    return false;
  }

  async function toggle(grupo: Grupo, index: number, noGrupo: boolean) {
    try {
      const update = [...grupos];
      if (noGrupo) {
        await api.put(`grupo/${grupo.id}/sair`);
        update[index].usuarios = [];
      } else {
        await api.put(`grupo/${grupo.id}/entrar`);
        update[index].usuarios = [{ id }];
      }
      setGrupos(update);
    } catch (error) {
      // TODO exibir mensagem de erro
    }
  }

  async function list() {
    if (loading) {
      return;
    }

    if (count > 0 && grupos.length === count) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('grupo', { params: { page, size } });
      setGrupos([...grupos, ...response.data]);
      setCount(parseInt(response.headers['x-count'], 10));

      setPage(page + 1);
      setLoading(false);
    } catch (error) {
      // TODO exibir mensagem de erro
      setLoading(false);
    }
  }

  useEffect(() => {
    list();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={logout} />

      <FlatList
        data={grupos}
        keyExtractor={g => String(g.id)}
        onEndReached={list}
        onEndReachedThreshold={0.2}
        renderItem={({ item, index }) => {
          const noGrupo = usuarioEstaNoGrupo(item);
          return (
            <View>
              <Text>{item.nome}</Text>
              <Text>{noGrupo ? 'MEMBRO' : 'NÃO É MEMBRO'}</Text>

              <TouchableOpacity
                onPress={() => toggle(item, index, noGrupo)}
              >
                <Text>{noGrupo ? 'Sair' : 'Entrar'}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
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
