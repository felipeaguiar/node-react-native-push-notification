import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function Carregando() {
  return (
    <View style={styles.container}>
      <Text>Carregando</Text>
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
