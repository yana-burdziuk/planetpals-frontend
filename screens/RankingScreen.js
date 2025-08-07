import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import Header from "../components/Header"; // Header réutilisable avec titre et points utilisateur

// FAKE DATA – à remplacer par un appel API plus tard
const rankings = [
  { department: "HR", points: 15000 },
  { department: "IT", points: 12000 },
  { department: "Marketing", points: 10000 },
  { department: "Finance", points: 8500 },
  { department: "Logistics", points: 6000 },
];

export default function RankingScreen() {
  const userPoints = "3434 pts"; // À remplacer par données dynamiques (ex: Redux)

  return (
    <View style={styles.container}>
      {/* En-tête de l'application */}
      <Header title="PlanetPals" count={userPoints} />

      {/* Liste scrollable des départements classés */}
      <ScrollView
        contentContainerStyle={styles.scrollContent} // padding et centrage
        showsVerticalScrollIndicator={false} // retire la scrollbar
      >
        <Text style={styles.title}>Department ranking</Text>

        {/* Affichage de chaque département avec sa position, son nom et ses points */}
        {rankings.map((item, index) => (
          <View key={index} style={styles.rankCard}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
            <Text style={styles.department}>{item.department}</Text>
            <Text style={styles.points}>
              <Text style={styles.boldPoints}>{item.points}</Text> points
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  paddingTop: 50,
  backgroundColor: "#F2F2F2",
},
  scrollContent: {
  alignItems: "center",
  paddingBottom: 40,
},
  title: {
  fontSize: 20,
  fontWeight: "bold",
  marginVertical: 20,
  color: "#0F172A",
},
  rankCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  width: "85%",
  padding: 15,
  marginBottom: 10,
  borderRadius: 10,
  borderColor: "#ddd",
  borderWidth: 1,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 5,
},
  rankNumber: {
  fontSize: 20,
  fontWeight: "bold",
  marginRight: 15,
  color: "#0F4B34",
},
  department: {
  flex: 1,
  fontSize: 16,
},
  points: {
  fontSize: 14,
  color: "#555",
},
  boldPoints: {
  fontWeight: "bold",
},
});