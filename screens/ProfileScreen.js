import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
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
    marginTop: 50, // espace depuis le haut
    fontSize: 20,
    fontWeight: 'bold',
  },
});