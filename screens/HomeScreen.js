import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import ChallengeCard from "../components/ChallengeCard";

export default function HomeScreen({ navigation }) {
  const pointsCount = 3434 + " pts"; // temporaire
  const co2Count = 2.5 + " kg"; // temporaire

  // Exemple de données (à dynamiser avec l’API plus tard)
  const dailyChallenges = [
    { id: "d1", title: "Vegetarian meal", points: 150, CO2: 0.8, done: true },
    { id: "d2", title: "Turn off the PC", points: 150, CO2: 0.8, done: true },
    { id: "d3", title: "Turn off the light", points: 10, CO2: 0.4, done: false },
  ];

  const weeklyChallenges = [
    { id: "w1", title: "Utiliser sa gourde", points: 150, CO2: 0.8, done: false },
    { id: "w2", title: "Limiter l’usage de la clim", points: 200, CO2: 1.2, done: false },
  ];

  const openDetails = (challenge) => {
    navigation.navigate("ChallengesScreen", {
      challengeId: challenge.id,
      title: challenge.title,
      points: challenge.points,
      co2: challenge.CO2,
      done: challenge.done,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Header title="PlanetPals" count={pointsCount} />
      </View>

      {/* ScrollView pour pouvoir défiler */}
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Total CO2 */}
        <View style={styles.totalCO2Container}>
          <Text style={styles.CO2ContainerText1}>{co2Count}</Text>
          <Text style={styles.CO2ContainerText2}>
            of CO2 saved by your department so far
          </Text>
        </View>

        {/* Daily Challenges */}
        <View style={styles.dailyTextContainer}>
          <Text style={styles.dailyText}>Daily challenges</Text>
        </View>
        {dailyChallenges.map((challenge) => (
          <TouchableOpacity key={challenge.id} activeOpacity={0.8} onPress={() => openDetails(challenge)}>
            <ChallengeCard
              title={challenge.title}
              points={challenge.points}
              CO2={challenge.CO2}
              done={challenge.done}
            />
          </TouchableOpacity>
        ))}

        {/* Weekly Challenges */}
        <View style={styles.dailyTextContainer}>
          <Text style={styles.dailyText}>Weekly challenges</Text>
        </View>
        {weeklyChallenges.map((challenge) => (
          <TouchableOpacity key={challenge.id} activeOpacity={0.8} onPress={() => openDetails(challenge)}>
            <ChallengeCard
              title={challenge.title}
              points={challenge.points}
              CO2={challenge.CO2}
              done={challenge.done}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  totalCO2Container: {
    padding: 20,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 15,
    backgroundColor: "#0F4B34",
    width: "80%",
  },
  CO2ContainerText1: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  CO2ContainerText2: {
    color: "#fff",
    textAlign: "center",
  },
  dailyTextContainer: {
    width: "80%",
    alignItems: "flex-start",
    marginTop: 20,
  },
  dailyText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0F172A",
  },
});