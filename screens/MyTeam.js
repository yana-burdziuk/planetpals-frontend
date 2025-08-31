import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { updateDepartmentStats } from "../reducers/user";

export default function MyTeam() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const departmentStats = useSelector((state) => state.user.departmentStats);
  const [teamMembers, setTeamMembers] = useState([]);
  //refreshing est un state local qui sert à indiquer si la donnée est en train d’être chargée
  // c'est souvent utilisé poiur le fornt, afficher pull to refresh par exemple, considérée comme bonne pratique
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeamData = async () => {
    try {
      // en cours de chargement 
      setRefreshing(true);
      const res = await fetch("http://192.168.1.158:3000/users/team", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      
      if (data.result) {
        setTeamMembers(data.teamMembers);
        
        // on met à jour le Redux avec les nouvelles stats du département
        dispatch(updateDepartmentStats({
          totalPoints: data.departmentStats.totalPoints,
          totalCO2: data.departmentStats.totalCO2
        }));
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    } {
      // chargement terminado
      setRefreshing(false);
    }
  };

  // recup de données au chargement du composant et le changement de token (user se reco)
  useEffect(() => {
    fetchTeamData();
  }, [user.token]);

  // update quand les points changent (après validation challenge p.ex)
  useEffect(() => {
    fetchTeamData();
  }, [user.currentPoints]);

  return (
    <View style={styles.container}>
      {/* Header avec les points du user */}
      <Header title="PlanetPals" count={user.currentPoints} />

      <View style={styles.content}>
        <Text style={styles.pageTitle}>My Team</Text>

        {/* Nom du département */}
        <View style={styles.departmentBox}>
          <Text style={styles.departmentText}>
            {departmentStats.name}
          </Text>
        </View>

        {/* Stats département */}
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total points</Text>
            <Text style={styles.statValue}>
              {departmentStats.totalPoints} points
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>CO₂ savings</Text>
            <Text style={styles.statValue}>
          {/*.toFixed(2) round à 2 chiffres*/}
              {departmentStats.totalCO2?.toFixed()} kg
            </Text>
          </View>
        </View>

        {/* Membres du département */}
        <ScrollView style={styles.membersContainer}>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.memberCard}>
              <Text style={styles.memberName}>{member.username}</Text>
              <Text style={styles.memberPoints}>
                {member.totalPoints}{" "}
                <Text style={styles.pointsBold}>points</Text>
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
    padding: 10,
    borderRadius: 15,
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
    borderRadius: 15,
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
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberName: {
    fontSize: 16,
    color: "#0F172A",
  },
  memberPoints: {
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
