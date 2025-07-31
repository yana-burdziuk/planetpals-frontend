import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

const departments = ["IT", "HR", "Marketing", "Finance", "Logistics"];

function submitSignUpForm() {
  console.log("button clicked");
}

export default function LandingPage({ navigation }) {
  const [selectedDepartment, setSelectedDepartment] = useState(""); // état pour stocker le departement sélectionné
  const [isDropdownVisible, setDropdownVisible] = useState(false); // état pour controler la visibilité du dropdown

  // fonctione qu'on appelle lorsqu’un département est sélectionné
  const handleSelect = (dept) => {
    setSelectedDepartment(dept); // mise à jour du département sélectionné dans l'état
    setDropdownVisible(false); // on ferme la dropdown
  };

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
          // value={} à mettre dynamiquement
          //onChangeText={} à mettre dynamiquement
          placeholder=""
          placeholderTextColor="#999"
        />
      </View>
      {/* Username */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Username</Text>
        <TextInput
          style={styles.formInput}
          // value={} à mettre dynamiquement
          //onChangeText={} à mettre dynamiquement
          placeholder=""
          placeholderTextColor="#999"
        />
      </View>
      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Password</Text>
        <TextInput
          style={styles.formInput}
          // value={} à mettre dynamiquement
          //onChangeText={} à mettre dynamiquement
          placeholder=""
          placeholderTextColor="#999"
        />
      </View>
      {/* Re enter the password */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputFormLabel}>Re-enter the password</Text>
        <TextInput
          style={styles.formInput}
          // value={} à mettre dynamiquement
          //onChangeText={} à mettre dynamiquement
          placeholder=""
          placeholderTextColor="#999"
        />
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
       {/* à changer pour sign in*/}
        <TouchableOpacity onPress={() => navigation.navigate("TabNavigator")}> 
          <Text style={styles.backToSignIn}>Sign in to your account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center", // centrer horizontalement
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
    width: 300,
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
  submitButton: {
    backgroundColor: "#0F4B34",
    paddingVertical: 8, // hauteur du bouton
    paddingHorizontal: 7, // largeur du bouton
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#0F4B34",
    paddingVertical: 16, // hauteur du bouton
    paddingHorizontal: 12, // largeur du bouton
    borderRadius: 8,
    marginVertical: 10, // que les boutons soient séparés
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
