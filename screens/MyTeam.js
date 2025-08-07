import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";

export default function MyTeam() {
  // TODO : remplacer ces données par celles du backend / Redux
  const userPoints = 3434;
  const departmentName = "HR Department";
  const totalPoints = 8500;
  const totalCO2 = 20;

  const teamMembers = [
    { name: "Yana", points: 3434 },
    { name: "Gilles", points: 2533 },
    { name: "Lionel", points: 2533 },
  ];

  return (
    <View style={styles.container}>
      {/* Composant d'en-tête réutilisable avec le titre de la page et les points de l'utilisateur */}
      <Header title="PlanetPals" count={`${userPoints} pts`} />

      <View style={styles.content}>
        <Text style={styles.pageTitle}>My Team</Text>

        {/* Affichage du nom du département */}
        <View style={styles.departmentBox}>
          <Text style={styles.departmentText}>{departmentName}</Text>
        </View>

        {/* Statistiques générales de l'équipe : points + CO2 */}
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total points</Text>
            <Text style={styles.statValue}>{totalPoints} points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>CO₂ savings</Text>
            <Text style={styles.statValue}>{totalCO2} kg</Text>
          </View>
        </View>

        {/* Liste scrollable des membres de l’équipe */}
        <ScrollView style={styles.membersContainer}>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.memberCard}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberPoints}>
                {member.points} <Text style={{ fontWeight: "bold" }}>points</Text>
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#f2f2f2ff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#0F172A",
  },
  departmentBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  departmentText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  statTitle: {
    fontSize: 14,
    color: "#555",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  membersContainer: {
    width: "100%",
    paddingTop: 10,
  },
  memberCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberName: {
    fontSize: 16,
    color: "#0F172A",
  },
  memberPoints: {
    fontSize: 16,
    color: "#0F172A",
  },
});