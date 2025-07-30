import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('TabNavigator')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center', // centrer horizontalement
  },
  title: {
    marginTop: 50, // espace par rapport au haut de l'écran
    fontSize: 20,
    fontWeight: 'bold',
  },
});