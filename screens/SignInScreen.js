import React from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function SignInScreen({ navigation }) {
    return (
        <View style={styles.container}>
        <Text style={styles.welcome}>Welcome back!</Text>
        <Text style={styles.title}>Sign In</Text> 

        <Text style={styles.label}>Username or Email address</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} secureTextEntry />

        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity>
            <Text style={styles.link}>Forgot your Password ?</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Don't have an account yet ?</Text>
        <TouchableOpacity>
            <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#0F4B34', // couleur utilisée
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    color: '#0F4B34',
    textAlign: 'center',
    marginTop: 10,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#555',
  },
});