import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator, // aka spinner chez Expo
} from "react-native";

const API_URL = "http://192.168.1.125:3000"; // téléphone physique

export default function SignUpScreen({ navigation }) {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null); // état pour stocker le departement sélectionné
  const [isDropdownVisible, setDropdownVisible] = useState(false); // état pour controler la visibilité du dropdown
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // pour la possibilité d'afficher ce qu'on écrit dans le password
  const [loading, setLoading] = useState(false); // spinner
  // fonction pour recuperer tous les departements actifs

  const loadDepts = () => {
    fetch(`${API_URL}/depts`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // on stock tout l'objet car on envoie au backend l'id par la suite, donc il nous faut tout
          setDepartments(data.departments);
        }
      });
  };
  // on appelle la fonction loadDepts au mount du composant
  useEffect(() => {
    loadDepts();
  }, []);

  // fonction qu'on appelle lorsqu’un département est sélectionné
  const handleSelect = (dept) => {
    setSelectedDepartment(dept); // mise à jour du département sélectionné dans l'état
    setDropdownVisible(false); // on ferme la dropdown
  };

  async function submitSignUpForm() {
    if (!email || !username || !password || !selectedDepartment) {
      alert("Please fill all fields");
      return;
    }

    // validation de l'email avec la regex
    const emailRegexPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegexPattern.test(email)) {
      alert("Please enter a valid email address (ex: your@email.com)");
      return;
    }

    // validation du password avec la regex
    const passwordRegexPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,}$/;

    if (!passwordRegexPattern.test(password)) {
      alert(
        "Password must be at least 8 characters long and include letters, numbers and a special character (ex: !@#$%&*)"
      );
      return;
    }
    setLoading(true);

    fetch(`${API_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        password,
        departmentId: selectedDepartment._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setTimeout(() => {
            setLoading(false)
            navigation.navigate("TabNavigator");
          }, 5000); // on attend quelques secondes avec le spinner avant de rediriger
        } else {
          setLoading(false)
          alert(data.error);
        }
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error:", error);
        alert("Something went wrong");
      });
  }

  return (
    <View style={styles.container}>
      {/* Welcome text */}
      <View style={styles.welcomeHeader}>
        <Text style={styles.welcomeTitle}>Welcome !</Text>
        <Text style={styles.welcomeSubtitle}>Create an account </Text>
      </View>
      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Email address</Text>
        <TextInput
          style={styles.formInput}
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
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
          autoCapitalize="none"
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
          autoCapitalize="none"
        />
      </View>

      {/* Show Password  */}
      <View style={styles.showPassword}>
        <TouchableOpacity
          style={[styles.circle, showPassword && styles.checkedCircle]}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword && <View style={styles.innerCircle} />}
        </TouchableOpacity>
        <Text style={styles.footerText}>Show password</Text>
      </View>
      {/* Department Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Department</Text>
        {/* bouton qui va déclencher l'ouverture de la dropdown */}
        <TouchableOpacity
          style={styles.formInput}
          onPress={() => setDropdownVisible(!isDropdownVisible)}
        >
          <Text
            style={!selectedDepartment ? { color: "#999" } : {}} // style si aucun dept sélectionné
          >
            {/* cela affiche la valeur sélectionnée ou un texte par défaut */}
            {selectedDepartment?.name || "Select..."}
          </Text>
        </TouchableOpacity>
        {/*  si on a cliqué sur la dropdown */}
        {isDropdownVisible && (
          <View style={styles.dropdownBox}>
            <ScrollView style={{ maxHeight: 150 }}>
              {/* on parcourt la liste des departements */}
              {departments.map((dept, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={() => handleSelect(dept)}
                >
                  <Text>{dept.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      {/* Submit bouton */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.7} // un effet sur le bouton au clic (70% visible, 30% transparent)
          onPress={() => submitSignUpForm()}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Spinner */}
      {loading && (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="#0F4B34" />
          <Text style={styles.spinnerText}>Creating account...</Text>
        </View>
      )}

      {/* Links */}
      <View style={styles.goBackContainer}>
        <Text style={styles.goBackText}>Already have an account?</Text>
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
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
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
  backToSignIn: {
    color: "#0F4B34",
    marginTop: 10,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  goBackContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  goBackText: {
    textAlign: "center",
  },
  footerText: {
    color: "#555",
  },
  spinner: {
    marginTop: 20,
    alignItems: "center" 
  },
  spinnerText: {
    marginTop: 10
  }
});
