import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Header from "../components/Header"; // header maison
import ValidateModal from "../components/ValidateModal";
import { useDispatch, useSelector } from "react-redux";
import { updatePoints } from "../reducers/user";

export default function ChallengeScreen({ route }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // récupération du challengeId passé depuis HomeScreen
  const { challengeId } = route.params || {};
  // on stocke le challenge recupéré depuis le backend, sur lequel on est
  const [challenge, setChallenge] = useState(null);
  // state pour stocker la liste des commentaires du challenge
  const [comments, setComments] = useState([]);
  const [showValidateModal, setShowValidateModal] = useState(false);

  // fetch du challenge qui correspond au challengeId
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        // on appelle la route /userChallenges pour récupérer tous les challenges du user
        const res = await fetch(
          "http://192.168.1.158:3000/challenges/userChallenges",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const data = await res.json();

        if (data.result) {
          // on cherche le challenge correspondant au planningId
          const foundChallenge = data.challenges.find(
            (challenge) => challenge.planningId === challengeId
          );
          setChallenge(foundChallenge); // stockage dans state pour afficher après
        } else {
          console.log("Error fetching challenge:", data.error);
        }
      } catch (error) {
        console.log("Error fetching challenge:", error);
      }
    };

    fetchChallenge();
  }, [challengeId, user.token]);

  const handleSubmit = async (photoUrl = null) => {
    try {
      const res = await fetch(
        `http://192.168.1.158:3000/challenges/${challenge.planningId}/submit`,
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
        // mise à jour des points du user et du dept
         dispatch(updatePoints(data.result));
        // surtout pour changer le style de la card 
        setChallenge({ ...challenge, done: true });
      }
    } catch (error) {
      console.log("Error submitting challenge:", error);
    }
  };

  const onSendComment = () => {
    if (!comment.trim()) return;
    // TODO backend: POST /challenges/:id/comments
    console.log("send comment:", comment);
    setComment("");
  };

  const onComplete = () => {
    if (challenge?.photoRequired) {
      setShowValidateModal(true);
    } else {
      handleSubmit();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Details" count={user.currentPoints} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Titre */}
        <Text style={styles.title}>{challenge?.title}</Text>

        {/* Description */}
        <Section title="Description">
          <Text style={styles.p}>{challenge?.description}</Text>
        </Section>

        {/* Why it’s important */}
        <Section title="Why it’s important">
          <Text style={styles.p}>{challenge?.why}</Text>
        </Section>

        {/* Fun fact */}
        <Section title="Fun Fact">
          <Text style={styles.p}>{challenge?.funFact}</Text>
        </Section>

        {/* Activity  
        <Text style={styles.h2}>Activity</Text>
        {mock.activity.map((a) => (
          <View key={a.id} style={styles.activityItem}>
            <View style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityText}>
                <Text style={styles.bold}>{a.author}</Text> uploaded a photo
              </Text>
            </View>
            <Image source={{ uri: a.thumbnail }} style={styles.thumb} />
          </View>
        ))}

        {/* Comments  
        <Text style={[styles.h2, { marginTop: 16 }]}>Comments</Text>
        {mock.comments.map((c) => (
          <View key={c.id} style={styles.commentItem}>
            <View style={styles.avatarSmall} />
            <View style={{ flex: 1 }}>
              <Text style={styles.bold}>{c.author}</Text>
              <Text style={styles.p}>{c.text}</Text>
            </View>
          </View>
        ))}

        {/* Add a comment  
        <Text style={styles.h3}>Leave a comment</Text>
        <TextInput
          style={styles.input}
          placeholder="Write something…"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={onSendComment}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity> */}

        {/* Complete challenge */}
        <TouchableOpacity style={styles.primaryBtn} onPress={onComplete}>
          <Text style={styles.primaryText}>Complete the challenge</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* ValidateModal */}
      {showValidateModal && challenge && (
        <ValidateModal
          challenge={challenge}
          onClose={() => setShowValidateModal(false)}
          onValidated={(photoUrl) => {
            handleSubmit(photoUrl);
            setShowValidateModal(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}

/** Composant section */
function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.h2}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  h2: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  h3: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginTop: 12,
    marginBottom: 6,
  },
  p: { color: "#1f2937", lineHeight: 20 },

  section: { marginBottom: 14 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  funFactBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  funFactTitle: { fontWeight: "700", marginBottom: 4, color: "#0F172A" },

  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  activityText: { color: "#1f2937" },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D1FAE5",
    marginRight: 10,
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D1FAE5",
    marginRight: 10,
  },
  thumb: { width: 40, height: 40, borderRadius: 6, marginLeft: 10 },
  bold: { fontWeight: "700" },

  commentItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },

  input: {
    minHeight: 44,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sendBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#0F4B34",
    marginTop: 8,
  },
  sendText: { color: "white", fontWeight: "700" },

  primaryBtn: {
    backgroundColor: "#0F4B34",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 14,
  },
  primaryText: { color: "white", fontWeight: "700" },
});
