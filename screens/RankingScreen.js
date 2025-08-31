import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import Header from "../components/Header";
import { useSelector } from "react-redux";

const API_URL = "http://192.168.1.158:3000";

export default function RankingScreen() {
  const user = useSelector((state) => state.user);
  const [departments, setDepartments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDepartments = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`${API_URL}/depts`);
      const data = await res.json();

      if (data.result) {
        const sortedDepts = data.departments.sort(
          // pour que ça s'affiche dans le bon ordre
          (a, b) => b.totalPoints - a.totalPoints
        );
        setDepartments(sortedDepts);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
    {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // permet de se rafraîchir automatiquement quand les points du user changent
  useEffect(() => {
    fetchDepartments();
  }, [user.currentPoints]);

  const onRefresh = () => {
    fetchDepartments();
  };

  return (
    <View style={styles.container}>
      {/* En-tête de l'application */}
      <Header title="PlanetPals" count={user.currentPoints} />

      {/* Liste scrollable des départements classés */}
      <ScrollView
        contentContainerStyle={styles.scrollContent} // padding et centrage
        showsVerticalScrollIndicator={false} // retire la scrollbar
        // prop pour pouvoir faire pull to refresh -> natif chez iOS et android
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Department ranking</Text>

        {departments.map((dept, index) => {
          {
            /* Affichage de chaque département avec sa position, son nom et ses points */
          }
          // on recupère le département du user
          const isUserDepartment = dept._id === user.departmentId;
          return (
            <View
              key={dept._id}
              style={[
                styles.rankCard,
                isUserDepartment && styles.userDepartmentCard, // si c'est le dept de user on va le highlight
              ]}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Rank ${index + 1}, Department ${
                dept.name
              }, ${dept.totalPoints} points${
                isUserDepartment ? ", your department" : ""
              }`}
            >
              <Text style={[styles.rankNumber, isUserDepartment]}>
                {index + 1}
              </Text>
              <Text
                style={[
                  styles.department,
                  isUserDepartment && styles.userDepartmentText,
                ]}
              >
                {dept.name}
              </Text>
              <Text
                style={[styles.points, isUserDepartment && styles.userPoints]}
              >
                {dept.totalPoints}
                <Text style={styles.pointsBold}> points</Text>
              </Text>
            </View>
          );
        })}
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
    borderWidth: 1,
    borderColor: "transparent",
  },
  userDepartmentCard: {
    backgroundColor: "#E3EBFF",
    borderColor: "#0F4B34",
    borderWidth: 2,
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
  userDepartmentText: {
    fontWeight: "bold",
    color: "#0F4B34",
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
  userPoints: {
    backgroundColor: "#0F4B34",
    color: "white",
  },
  pointsBold: {
    fontWeight: "bold",
  },
});
