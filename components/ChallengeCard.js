import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ChallengeCard({ title, points, CO2, done = false }) {
  return (
    <View style={styles.challengeCard}>
      <View style={styles.topRow}>
        <Text style={styles.title}> {title}</Text>
        <View style={styles.circle}>
          {/*si le trigger est declenché alors on affiche un autre circle(check)*/}
          {done && <View style={styles.checkedCircle} />}
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.pointsPrice}>
          {/* à dynamiser les points*/}
          <Text style={styles.pointsText}> {points} pts</Text>
        </View>
        {/* à dynamiser la quantité de CO2*/}
        <Text style={styles.CO2Text}> {CO2} kg of CO2 saved </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  challengeCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: "#0F4B34",
    shadowOpacity: 0.05,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#f2f2f2ff",
    width: "90%",
    minHeight: "10%",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    maxWidth: "85%", // si le texte est trop gros ça ne va pas depasser et faire bouger le circle
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0F4B34",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCircle: {
    // en fait c'est un mini circle dans le circle parent
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0F4B34",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    width: "100%",
  },
  pointsPrice: {
    backgroundColor: "#CFF7D3", // ui kit figma pour les couleurs
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 12,
  },
  pointsText: {
    color: "#0F4B34",
    fontWeight: "600",
    fontSize: 14,
  },
  CO2Text: {
    fontSize: 14,
    color: "#0F4B34",
  },
});
