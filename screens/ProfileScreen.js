import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import Badge from "../components/Badge";
import { useSelector } from "react-redux";

export default function ProfileScreen({}) {
  //pour l'instant on a juste un tableau des badges, à voir pour créer peut être une API
  const badges = [
    { name: "🌱", text: "Little Seed", points: 400, disabled: false },
    { name: "🥕", text: "Baby Carrot", points: 1800, disabled: false },
    { name: "🥦", text: "Mighty Broccoli", points: 3000, disabled: true },
    { name: "🌶️", text: "Brilliant Pepper", points: 4500, disabled: true },
    { name: "🌽", text: "Golden Corn", points: 7000, disabled: true },
    { name: "🎃", text: "Legendary Pumpkin", points: 9000, disabled: true },
  ];

// pour compter le nombre de badges
 const currentBadgeCount = badges.filter(badge => !badge.disabled).length; // crée le nouveau tableau avec des badges activés (condition respéctée)
  const totalBadgeCount = badges.length; // le nombre total des badges dans le tableau

  const currentPoints = 2200; // à dynamiser
  const totalPoints = 3000; // à dynamiser
  const progress = currentPoints / totalPoints;
  const pointsCount = 3434 + " pts"; // temporaire
  const username = useSelector((state) => state.user.username);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Header title="PlanetPals" count={pointsCount} />
      </View>

      {/* Profile Name à recuperer depuis le redux dynamiquement */}
      <View style={styles.profileNameContainer}>
        <Text style={styles.profileNameText}>angrybird</Text>
        {/*    <Text>{username} </Text> */}
      </View>

      {/* barre de progression*/}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.bar, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.percentage}>
          {currentPoints} / {totalPoints} pts
        </Text>
      </View>

      {/* badges*/}

      <View style={styles.badgeContainer}>
        <View style={styles.myBadgesTextContainer}>
          <Text style={styles.myBadgesText}>My badges ({currentBadgeCount}/{totalBadgeCount})</Text>
        </View>
        {badges.map((badge, index) => (
          <Badge
            key={index}
            name={badge.name}
            text={badge.text}
            points={badge.points}
            disabled={badge.disabled}
          />
        ))}
      </View>
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
  profileNameContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E3EBFF",
    alignItems: "center",
    justifyContent: "center",
    margin: 50,
    paddingHorizontal: 10, // comme ça le texte ne touche pas les bords
  },
  profileNameText: {
    fontSize: 20,
    color: "#0F172A",
    textAlign: "center",
    flexWrap: "wrap",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#DBDBDB",
    borderRadius: 8,
  },
  bar: {
    height: "100%",
    backgroundColor: "#113EA7",
    borderRadius: 8,
  },
  percentage: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "black",
  },
  myBadgesTextContainer: {
    width: "90%",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 10,
  },
  myBadgesText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0F172A",
  },
  badgeContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    shadowColor: "#0F4B34",
    shadowOpacity: 0.05,
    borderWidth: 1,
    borderColor: "#f2f2f2ff",
    width: "90%",
    minHeight: "10%",
    flexDirection: "row",
    flexWrap: "wrap", // passer à la ligne, donc prend le max ce qui peut rentrer dans les 90%
    justifyContent: "space-between",
  },
});
