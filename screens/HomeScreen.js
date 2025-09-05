import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Header from "../components/Header";
import ChallengeCard from "../components/ChallengeCard";
import ValidateModal from "../components/ValidateModal";
import { useSelector, useDispatch } from "react-redux";
import {
  updatePoints,
  updateDepartmentStats,
  setUserChallenges,
  updateChallengeStatus,
} from "../reducers/user";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const API_URL = "http://192.168.1.158:3000";

  // on recupère les stats du dept au chargement de l'app
  useEffect(() => {
    const fetchDepartmentStats = async () => {
      try {
        const res = await fetch(
          `${API_URL}/depts/department-stats`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const data = await res.json();

        if (data.result) {
          dispatch(
            updateDepartmentStats({
              totalCO2: data.stats.totalCO2,
              totalPoints: data.stats.totalPoints,
            })
          );
        }
      } catch (error) {
        console.log("Error fetching department stats:", error);
      }
    };

    if (user.token) {
      fetchDepartmentStats();
    }
  }, [user.token]);

  // fetch des challenges

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch(
          `${API_URL}/challenges/userChallenges`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const data = await res.json();
        if (data.result) {
          dispatch(setUserChallenges(data.challenges));
        } else {
          console.log("Error fetching challenges:", data.error);
        }
      } catch (error) {
        console.log("Error fetching challenges:", error);
      }
    };

    fetchChallenges();
  }, [user.token]);

  // filtrer depuis Redux
  const dailyChallenges = user.challenges.filter(
    (challenge) => challenge.frequency === "daily"
  );
  const weeklyChallenges = user.challenges.filter(
    (challenge) => challenge.frequency === "weekly"
  );

  const openDetails = (challenge) => {
    navigation.navigate("ChallengesScreen", {
      challengeId: challenge.planningId,
      title: challenge.title,
      points: challenge.points,
      CO2: challenge.co2,
      done: challenge.done,
    });
  };

  const handleSubmit = async (challenge, photoUrl = null) => {
    if (challenge.photoRequired && !photoUrl) {
      setSelectedChallenge(challenge); // on garde en "memoire" pour la modale
      setShowValidateModal(true);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/challenges/${challenge.planningId}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ photoUrl }),
        }
      );

      const data = await res.json();
      if (data.result) {
        // on met à jour le redux avec les nouveaux points
        dispatch(updatePoints(data.result));
        dispatch(
          updateChallengeStatus({
            planningId: challenge.planningId,
            done: true,
          })
        );
      }
    } catch (err) {
      console.log("Error submitting challenge:", err);
    }
  };

  const handleCancelSubmit = async (challenge) => {
    try {
      const res = await fetch(
        `${API_URL}/challenges/${challenge.planningId}/submission`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();

      if (data.result) {
        // on met à jour le redux avec les nouveaux points
        dispatch(updatePoints(data.pointsUpdate));
        dispatch(
          updateChallengeStatus({
            planningId: challenge.planningId,
            done: false,
          })
        );
      } else {
        console.log("Error cancelling submission:", data.error);
      }
    } catch (error) {
      console.log("Error cancelling submission:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Header title="PlanetPals" count={user.currentPoints} />
      </View>

      {/* ScrollView pour pouvoir défiler */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Total CO2 */}
        <View
          style={styles.totalCO2Container}
          accessible={true}
          accessibilityRole="summary"
          accessibilityLabel={`Total CO2 saved by your department so far: ${user.departmentStats.totalCO2?.toFixed(2)} kg`}
        >
          <Text style={styles.CO2ContainerText1}>
            {/*.toFixed(2) round à 2 chiffres*/}
            {user.departmentStats.totalCO2?.toFixed(2)} kg
          </Text>
          <Text style={styles.CO2ContainerText2}>
            of CO₂ saved by your department so far
          </Text>
        </View>

        {/* Daily Challenges */}
        <View style={styles.dailyTextContainer}>
          <Text style={styles.dailyText} accessibilityRole="header">
            Daily challenges
          </Text>
        </View>

        {dailyChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.planningId}
            title={challenge.title}
            points={challenge.points}
            CO2={challenge.co2}
            done={challenge.done}
            onPressCircle={() =>
              challenge.done
                ? handleCancelSubmit(challenge)
                : handleSubmit(challenge)
            }
            onPressCard={() => openDetails(challenge)}
            accessible={true}
            accessibilityLabel={`${challenge.title}, ${challenge.points} points, ${challenge.co2} kg CO2`}
          />
        ))}

        {/* Weekly Challenges */}
        <View style={styles.dailyTextContainer}>
          <Text style={styles.dailyText}>Weekly challenges</Text>
        </View>
        {weeklyChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.planningId}
            title={challenge.title}
            points={challenge.points}
            CO2={challenge.co2}
            done={challenge.done}
            onPressCircle={() =>
              challenge.done
                ? handleCancelSubmit(challenge)
                : handleSubmit(challenge)
            }
            onPressCard={() => openDetails(challenge)}
            accessible={true}
            accessibilityLabel={`${challenge.title}, ${challenge.points} points, ${challenge.co2} kg CO2`}
          />
        ))}
      </ScrollView>

      {showValidateModal && selectedChallenge && (
        <View style={styles.modalOverlay}>
          <ValidateModal
            onClose={() => setShowValidateModal(false)}
            challenge={selectedChallenge} // on passe le challenge en question à la modale validate
            token={user.token}
            onValidated={(photoUrl) =>
              handleSubmit(selectedChallenge, photoUrl)
            } // callback depuis validate modal quand c'est validé
          />
        </View>
      )}
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
    width: "90%",
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
    width: "90%",
    alignItems: "flex-start",
    marginTop: 20,
  },
  dailyText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0F172A",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", //  noir semi-transparent
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // pour être sûr que ça passe au-dessus
  },
});
