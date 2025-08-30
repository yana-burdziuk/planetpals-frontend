import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Header from "../components/Header"; // header maison
import ValidateModal from "../components/ValidateModal";
import { useDispatch, useSelector } from "react-redux";
import { updatePoints } from "../reducers/user";

/** À ajuster selon mon réseau local quand je change d’endroit */
const API_URL = "http://192.168.1.158:3000";

export default function ChallengeScreen({ route }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // l’ID du challenge (planningId) passé depuis HomeScreen
  const { challengeId } = route.params || {};

  // données du challenge courant (récupérées depuis le backend)
  const [challenge, setChallenge] = useState(null);

  // liste des commentaires + champ de saisie
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  // activité (photos postées sur ce défi)
  const [activity, setActivity] = useState([]);

  // petits états d’UI
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [posting, setPosting] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);

  /** 1) Je récupère tous les challenges de l’utilisateur,
   *    puis je garde celui dont le planningId === challengeId.
   *    -> GET /challenges/userChallenges (token obligatoire)
   */
  useEffect(() => {
    if (!challengeId || !user || !user.token) return;

    async function fetchChallenge() {
      try {
        const res = await fetch(`${API_URL}/challenges/userChallenges`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();

        if (data.result) {
        // on cherche le challenge correspondant au planningId
          const foundChallenge = data.challenges.find(
            (challenge) => challenge.planningId === challengeId
          );
          setChallenge(foundChallenge);
        } else {
          console.log("Error fetching challenge:", data.error);
        }
      } catch (error) {
        console.log("Error fetching challenge:", error);
      }
    }

    fetchChallenge();
  }, [challengeId, user]);

  /** 2) Je charge les commentaires de ce défi
   *    -> GET /challenges/:planningId/comments (lecture publique)
   */
  useEffect(() => {
    if (!challengeId) return;

    async function loadComments() {
      try {
        setLoadingComments(true);
        const res = await fetch(`${API_URL}/challenges/${challengeId}/comments`);
        const data = await res.json();
        if (data.result) {
          // attendu: [{ user, content, createdAt }, ...]
          setComments(data.comments || []);
        } else {
          console.log("Error loading comments:", data.error);
        }
      } catch (e) {
        console.log("Network error (comments):", e);
      }
      setLoadingComments(false);
    }

    loadComments();
  }, [challengeId]);

  /** 3) Je charge l’activité (photos postées) pour ce défi
   *    -> GET /challenges/:planningId/activity
   */
  useEffect(() => {
    if (!challengeId) return;

    async function loadActivity() {
      try {
        setLoadingActivity(true);
        const res = await fetch(
          `${API_URL}/challenges/${challengeId}/activity`
        );
        const data = await res.json();
        if (data.result) {
          // attendu: [{ user, type:'photo', photoUrl, submittedAt }, ...]
          setActivity(data.activity || []);
        } else {
          console.log("Error loading activity:", data.error);
        }
      } catch (e) {
        console.log("Network error (activity):", e);
      }
      setLoadingActivity(false);
    }

    loadActivity();
  }, [challengeId]);

  /** 4) Je valide le challenge pour l’utilisateur.
   *    -> POST /challenges/:planningId/submit (token obligatoire)
   *    -> si photo requise, j’ouvre la modale ValidateModal
   */
  const handleSubmit = async (photoUrl = null) => {
    if (!challenge || !challenge.planningId) return;

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
        // mise à jour des points du user et du dept
         dispatch(updatePoints(data.result));
        // surtout pour changer le style de la card 
        setChallenge({ ...challenge, done: true });

        // si une photo a été envoyée, je recharge l’activité pour voir la vignette
        if (photoUrl) {
          try {
            const res = await fetch(
              `${API_URL}/challenges/${challengeId}/activity`
            );
            const data = await res.json();
            if (data.result) setActivity(data.activity);
          } catch {}
        }
      } else {
        console.log("Submit error:", data.error);
      }
    } catch (error) {
      console.log("Error submitting challenge:", error);
    }
  };

  /** 5) J’envoie un commentaire (facultatif).
   *    -> POST /challenges/:planningId/comments { content }
   *    -> token obligatoire
   *    -> si le champ est vide, je n’envoie rien
   */
  const onSendComment = async () => {
    const content = (comment || "").trim();
    if (!content || !challengeId) return;

    try {
      setPosting(true);
      const res = await fetch(`${API_URL}/challenges/${challengeId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();

      if (data.result) {
        // je vide le champ
        setComment("");
        // je recharge la liste pour voir mon commentaire
        const res = await fetch(`${API_URL}/challenges/${challengeId}/comments`);
        const data = await res.json();
        if (data.result) setComments(data.comments);
      } else {
        console.log("Post comment error:", data.error);
      }
    } catch (error) {
      console.log("Network error (post comment):", error);
    }
    setPosting(false);
  };

  /** 6) Clic sur “Complete the challenge”
   *    -> si photo requise: j’ouvre la modale (upload)
   *    -> sinon: je soumets direct
   */
  const onComplete = () => {
    if (challenge && challenge.photoRequired) {
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
        <Text style={styles.title}>
          {challenge ? challenge.title : "Challenge"}
        </Text>

        {/* Description */}
        <Section title="Description">
          <Text style={styles.p}>
            {challenge ? challenge.description : "-"}
          </Text>
        </Section>

        {/* Why it’s important */}
        <Section title="Why it’s important">
          <Text style={styles.p}>{challenge ? challenge.why : "-"}</Text>
        </Section>

        {/* Fun fact */}
        <Section title="Fun fact">
          <Text style={styles.p}>{challenge ? challenge.funFact : "-"}</Text>
        </Section>

        {/* Activity */}
        <Text style={[styles.h2, { marginTop: 16 }]}>Activity</Text>
        {loadingActivity ? (
          <Text style={styles.p}>Chargement…</Text>
        ) : activity.length === 0 ? (
          <Text style={styles.p}>Aucune activité pour le moment.</Text>
        ) : (
          activity.map((a, idx) => (
            <View key={idx} style={styles.activityItem}>
              {/* petit avatar “placeholder” */}
              <View style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>
                  <Text style={styles.bold}>{a.user}</Text>{" "}
                  {a.type === "photo" ? "a posté une photo" : "activité"}
                </Text>
                <Text style={{ color: "#64748B", fontSize: 12 }}>
                  {new Date(a.submittedAt).toLocaleString()}
                </Text>
              </View>
              {/* vignette si on a une URL de photo */}
              {a.photoUrl ? (
                <Image source={{ uri: a.photoUrl }} style={styles.thumb} />
              ) : null}
            </View>
          ))
        )}

        {/* Comments */}
        <Text style={[styles.h2, { marginTop: 16 }]}>Comments</Text>
        {loadingComments ? (
          <Text style={styles.p}>Chargement…</Text>
        ) : comments.length === 0 ? (
          <Text style={styles.p}>Aucun commentaire pour le moment.</Text>
        ) : (
          comments.map((c, idx) => (
            <View key={idx} style={styles.commentItem}>
              <View style={styles.avatarSmall} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bold}>{c.user}</Text>
                <Text style={styles.p}>{c.content}</Text>
              </View>
            </View>
          ))
        )}

        {/* Add a comment (facultatif) */}
        <Text style={styles.h3}>Leave a comment</Text>
        <TextInput
          style={styles.input}
          placeholder="Write something…"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={onSendComment}
          disabled={posting}
        >
          <Text style={styles.sendText}>{posting ? "Sending..." : "Send"}</Text>
        </TouchableOpacity>

        {/* Valider le challenge */}
        <TouchableOpacity style={styles.primaryBtn} onPress={onComplete}>
          <Text style={styles.primaryText}>Complete the challenge</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modale de validation (photo) */}
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

/** Petit composant “section” réutilisable */
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
