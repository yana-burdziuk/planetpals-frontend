import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function LandingPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/planetB.png")} // l'image en attendant qu'on trouve la bonne
        style={styles.image}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel="Planet Pals logo"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7} // un effet sur le bouton au clic (70% visible, 30% transparent)
          onPress={() => navigation.navigate("SignUp")}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Create a new account"
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("SignIn")}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Sign into your existing account"
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center", // centrer horizontalement
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    alignItems : "center"
  },
  button: {
    backgroundColor: '#0F4B34',
    paddingVertical: 16, // hauteur du bouton
    paddingHorizontal: 12, // largeur du bouton
    borderRadius: 8,
    marginVertical: 10, // que les boutons soient séparés
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
