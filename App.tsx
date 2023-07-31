import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import List from './src/screens/List';

export default function App() {
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'red',
        flex: 1,
      }}>
      <List />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
