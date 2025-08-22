import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header"; // Header réutilisable avec titre et points utilisateur
import { useSelector } from "react-redux";

const API_URL = "http://192.168.1.27:3000"; // téléphone physique

export default function RankingScreen() {
  const user = useSelector((state) => state.user);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`${API_URL}/depts`);
        const data = await res.json();

        if (data.result) {
          const sortedDepts = data.departments.sort(
          // pour que ça s'affiche dans le bon ordre 
            (a,b) => b.totalPoints - a.totalPoints
          )
          setDepartments(sortedDepts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <View style={styles.container}>
      {/* En-tête de l'application */}
      <Header title="PlanetPals" count={user.currentPoints} />

      {/* Liste scrollable des départements classés */}
      <ScrollView
        contentContainerStyle={styles.scrollContent} // padding et centrage
        showsVerticalScrollIndicator={false} // retire la scrollbar
      >
        <Text style={styles.title}>Department ranking</Text>

        {/* Affichage de chaque département avec sa position, son nom et ses points */}
        {departments.map((dept, index) => (
          <View key={dept._id} style={styles.rankCard}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
            <Text style={styles.department}>{dept.name}</Text>
            <Text style={styles.points}>
              {dept.totalPoints} <Text style={styles.pointsBold}>points</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#0F172A",
  },
  rankCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "90%",
    padding: 20,
    marginBottom: 10,
    borderRadius: 15,
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
    color: "#0F172A",
  },
  points: {
    fontSize: 14,
    color: "#0F4B34",
    backgroundColor: "#CFF7D3",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 12,
  },
  pointsBold: {
    fontWeight: "bold",
  },
});
