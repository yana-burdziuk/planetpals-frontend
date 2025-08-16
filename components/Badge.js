import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Badge({ name, text, disabled = false, points }) {
  return (
    <View
      style={
        disabled ? styles.inactiveBadgeContainer : styles.activeBadgeContainer
      }
    >
      <Text style={styles.icon}>{name}</Text>
      <Text style={styles.label}>{text}</Text>
      <Text style={styles.pointsText}>{points} pts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inactiveBadgeContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "30%",
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 15,
    shadowColor: "#0F4B34",
    shadowOpacity: 0.05,
    borderColor: "#DBDBDB",
    opacity: 0.5,
  },
  activeBadgeContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "30%",
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 15,
    shadowColor: "#0F4B34",
    shadowOpacity: 0.05,
    borderColor: "#14AE5C",
    backgroundColor: "#F4FFF5",
  },
  icon: {
    fontSize: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
