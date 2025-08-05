import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../reducers/user";

export default function SignInScreen({ navigation }) {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // pour la possibilité d'afficher ce qu'on écrit dans le password

  // sign in function qui sera trigger par onPress
  async function submitSignInForm() {
    if (!credentials || !password) {
      alert("All the fields are mandatory");
      return;
    }
    // a mettre dans .env ?
    fetch("http://192.168.1.161:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credentials,
        password,
      }),
    }).then(async (response) => {
      // si jamais le backend tombe on peut recuperer l'erreur
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      // on envoie les données dans redux
      dispatch(loginSuccess(data.user));
      navigation.navigate("TabNavigator");
    });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome back!</Text>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.label}>Username or Email address</Text>
      <TextInput
        style={styles.input}
        value={credentials}
        onChangeText={setCredentials} // mise à jour du state avec les infos mises dans le champs
        autoCapitalize="none" // sinon ça commence toujours pas une majuscule
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <View style={styles.showPassword}>
        <TouchableOpacity
          style={[styles.circle, showPassword && styles.checkedCircle]}
          onPress={() => setShowPassword(!showPassword)}
        ></TouchableOpacity>
        <Text style={styles.footerText}>Show password</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={submitSignInForm}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.link}>Forgot your Password ?</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account yet ?</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.link}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  welcome: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#0F4B34", // couleur utilisée
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  link: {
    color: "#0F4B34",
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    marginTop: 100,
    color: "#555",
  },
  footerText: {
    textAlign: "center",
    color: "#555",
  },
  showPassword: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginTop: 10,
    marginLeft: 5,
    alignItems: "center"
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#DBDBDB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCircle: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0F4B34",
  },
});
