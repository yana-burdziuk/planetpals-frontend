import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

const API_URL = "http://192.168.1.14:3000"; // téléphone physique

const departments = ["IT", "HR", "Marketing", "Finance", "Logistics"];

export default function LandingPage({ navigation }) {
  const [selectedDepartment, setSelectedDepartment] = useState(""); // état pour stocker le departement sélectionné
  const [isDropdownVisible, setDropdownVisible] = useState(false); // état pour controler la visibilité du dropdown
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // pour la possibilité d'afficher ce qu'on écrit dans le password
  

  // fonctione qu'on appelle lorsqu’un département est sélectionné
  const handleSelect = (dept) => {
    setSelectedDepartment(dept); // mise à jour du département sélectionné dans l'état
    setDropdownVisible(false); // on ferme la dropdown
  };

  async function submitSignUpForm() {
    if (!email || !username || !password || !selectedDepartment) {
      alert("Please fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    fetch("http://192.168.1.14:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        password,
        departmentId: selectedDepartment, // ou l'ID réel si tu as un mapping
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          alert("Account created successfully!");
          console.log("User token:", data.token);
          // Ici, tu pourrais rediriger vers une autre page
        } else {
          alert(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong");
      });
  }

  return (
    <View style={styles.container}>
      {/* Bienvenue text*/}
      <View style={styles.welcomeText}>
        <Text style={styles.welcomeWord}>Welcome !</Text>
        <Text>Create an Account </Text>
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Email address</Text>
        <TextInput
          style={styles.formInput}
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor="#999"
          autoCapitalize="none"
        />
      </View>
      {/* Username */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Username</Text>
        <TextInput
          style={styles.formInput}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#999"
        />
      </View>
      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Password</Text>
        <TextInput
          style={styles.formInput}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          // autoComplete="off" // désactive suggestion iOS
          textContentType="none" // désactive gestionnaire de mots de passe
        />
      </View>
      {/* Re enter the password */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Re-enter the password</Text>
        <TextInput
          style={styles.formInput}
          value={confirmPassword}
          onChangeText={setConfirmePassword}
          placeholder="Re-enter the password"
          placeholderTextColor="#999"
        secureTextEntry={!showPassword}
          autoComplete="off" // désactive suggestion iOS
          textContentType="none" // désactive gestionnaire de mots de passe
        />
      </View>
  <View style={styles.showPassword}>
                <TouchableOpacity
                  style={[styles.circle, showPassword && styles.checkedCircle]}
                  onPress={() => setShowPassword(!showPassword)}
                ></TouchableOpacity>
                <Text style={styles.footerText}>Show passwords</Text>
              </View>
      {/* Department Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Department</Text>

        {/* bouton qui va déclencher l'ouverture de la dropdown */}
        <TouchableOpacity
          style={styles.formInput}
          onPress={() => setDropdownVisible(!isDropdownVisible)}
        >
          <Text style={styles.inputFormLabel}>
            {/* cela affiche la valeur sélectionnée ou un texte par défaut */}
            {selectedDepartment || "Select..."}
          </Text>
        </TouchableOpacity>
        {/*  si on a cliqué sur la dropdown alors */}
        {isDropdownVisible && (
          <View style={styles.dropdownBox}>
            <ScrollView style={{ maxHeight: 150 }}>
              {/* on parcourt la liste des departements */}
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept}
                  style={styles.option}
                  onPress={() => handleSelect(dept)}
                >
                  <Text>{dept}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.7} // un effet sur le bouton au clic (70% visible, 30% transparent)
          onPress={() => submitSignUpForm()}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.goBackContainer}>
        <Text style={styles.goBackText}>Already have an account ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("TabNavigator")}>
          <Text style={styles.backToSignIn}>Sign in to your account</Text>
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
    justifyContent: "center", // centrer horizontalement
    
  },
  welcomeText: {
    alignItems: "center",
  },
  welcomeWord: {
    fontSize: 15,
    color: "#0F172A",
  },
  inputContainer: {
    marginBottom: 10,
    
  },
  inputFormLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
    
    
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },

  dropdownBox: {
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  option: {
    padding: 15, // de tous les côtés
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 8,
    paddingVertical: 16, // hauteur du bouton
    paddingHorizontal: 12, // largeur du bouton
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  showPassword: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    alignItems: "center"
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
  checkedCircle: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0F4B34",
  },
  submitButton: {
    backgroundColor: "#0F4B34",
    paddingVertical: 8, // hauteur du bouton
    paddingHorizontal: 7, // largeur du bouton
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#0F4B34",
    paddingVertical: 16, // hauteur de l'input
    paddingHorizontal: 12, // largeur de l'input
    borderRadius: 8,
    marginVertical: 10, // que les inputs soient séparés
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  backToSignIn: {
    color: "#0F4B34",
    marginTop: 10,
    textDecorationLine: "underline",
  },

  goBackContainer: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  goBackText: {
    textAlign: "center",
  },
});
