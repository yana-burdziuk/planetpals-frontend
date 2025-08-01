import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function Header({ title = "PlanetPals", count = 0 }) {
  return (
    <View style={styles.headerContainer}>
      {/* bloc gauche : image + titre */}
      <View style={styles.leftContainer}>
        <Image source={require("../assets/leaves.png")} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {/* bloc droite : compteur de points totaux */}
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F4B34",
  },
  count: {
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "#0F4B34",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#0F4B34",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5, // pour un peu de hauteur
    minWidth: 30, // taille minimale
    textAlign: "center",
  },
});
