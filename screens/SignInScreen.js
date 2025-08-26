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
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.158:3000"; // téléphone physique

export default function SignInScreen({ navigation }) {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submitSignInForm() {
    if (!credentials || !password) {
      alert("All fields are mandatory");
      return;
    }

    fetch(`${API_URL}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credentials,
        password,
      }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      await AsyncStorage.setItem("userToken", data.token);
      dispatch(
        loginSuccess({
          username: data.username,
          email: data.email,
          token: data.token,
          currentPoints: data.currentPoints ?? 0,
        })
      );
      navigation.navigate("TabNavigator");
    });
  }

  return (
    <View style={styles.container}>
      {/* Welcome text */}
      <View style={styles.welcomeHeader}>
        <Text style={styles.welcomeTitle}>Welcome back!</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to your account</Text>
      </View>
      {/* Username / Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Username or Email</Text>
        <TextInput
          style={styles.formInput}
          value={credentials}
          onChangeText={setCredentials}
          placeholder="your@email.com"
          placeholderTextColor="#999"
          autoCapitalize="none"
        />
      </View>
      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Password</Text>
        <TextInput
          style={styles.formInput}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#999"
          autoCapitalize="none"
        />
      </View>
      {/* Show Password */}
      <View style={styles.showPassword}>
        <TouchableOpacity
          style={[styles.circle, showPassword && styles.checkedCircle]}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword && <View style={styles.innerCircle} />}
        </TouchableOpacity>
        <Text style={styles.footerText}>Show password</Text>
      </View>
      {/* Submit bouton */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.7}
          onPress={submitSignInForm}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      {/* Links */}
      {/* <TouchableOpacity>
        <Text style={styles.backToSignIn}>Forgot your password?</Text>
      </TouchableOpacity> */}

      <View style={styles.goBackContainer}>
        <Text style={styles.goBackText}>Don’t have an account yet?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.backToSignIn}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  welcomeHeader: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: 400,
    color: "#0F172A",
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputFormLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#0F4B34",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  showPassword: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cccccc",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0F4B34",
    alignSelf: "center",
  },
  checkedCircle: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0F4B34",
  },
  backToSignIn: {
    color: "#0F4B34",
    marginTop: 10,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  goBackContainer: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  goBackText: {
    textAlign: "center",
  },
  footerText: {
    color: "#555",
  },
});
