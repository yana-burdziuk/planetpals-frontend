import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import ChallengeCard from "../components/ChallengeCard";

export default function HomeScreen({ navigation }) {
  const pointsCount = 3434 + " pts"; //ephemère, faudra dynamiser pour l'afficher dans le header
  const co2Count = 2.5 + " kg"; //pareil

  return (
    <View style={styles.container}>
      {/* fait un composant à réutiliser*/}
      <View style={styles.pageHeader}>
        <Header title="PlanetPals" count={pointsCount} />
      </View>
      {/* affichage de total CO2 */}
      <View style={styles.totalCO2Container}>
        <Text style={styles.CO2ContainerText1}> {co2Count} </Text>
        <Text style={styles.CO2ContainerText2}>
          of CO2 saved by your department so far
        </Text>
      </View>
      {/* affichage de daily challenges*/}
      <View style={styles.dailyTextContainer}>
        <Text style={styles.dailyText}>Daily challenges</Text>
      </View>
      {/* fait un composant à réutiliser*/}
      <ChallengeCard
        title="Vegetarian meal"
        points={150}
        CO2={0.8}
        done={true}
      />
      <ChallengeCard
        title="Turn off the light"
        points={10}
        CO2={0.4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#f2f2f2ff",
    alignItems: "center",
  },
  pageHeader: {
    width: "100%",
  },
  title: {
    marginTop: 50,
    fontSize: 20,
  },
  totalCO2Container: {
    shadowColor: "#0F4B34",
    shadowOpacity: 0.05,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 15,
    backgroundColor: "#0F4B34",
    color: "#fff",
    width: "80%",
    minHeight: "10%",
  },
  CO2ContainerText1: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  CO2ContainerText2: {
    color: "#fff",
  },
  dailyTextContainer: {
    width: "80%",
    alignItems: "flex-start", // pour alligner le text à gauche par rapport au parent
    marginTop: 20,
  },
  dailyText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0F172A",
  },
});
