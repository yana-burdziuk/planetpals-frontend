import React, { useState } from "react";
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
import Header from "../components/Header"; // ton header maison

export default function ChallengeScreen({ route }) {
  // Récupération des infos passées depuis Home
  const { challengeId, title = "Use a reusable water bottle" } =
    route.params || {};

  // Données mock (à remplacer plus tard par un fetch)
  const mock = {
    title,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    why: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisis gravida neque convallis.",
    funFact:
      "A fun fact about this challenge. Reusing a bottle can avoid hundreds of plastic bottles / year.",
    activity: [
      {
        id: "a1",
        author: "Marie Antoinette",
        type: "photo",
        thumbnail: "https://picsum.photos/seed/1/80",
      },
      {
        id: "a2",
        author: "Marie Antoinette",
        type: "photo",
        thumbnail: "https://picsum.photos/seed/2/80",
      },
    ],
    comments: [
      { id: "c1", author: "Marie Antoinette", text: "Lorem ipsum……" },
      { id: "c2", author: "Louis", text: "Nice challenge!" },
    ],
  };

  const [comment, setComment] = useState("");

  const onSendComment = () => {
    if (!comment.trim()) return;
    // TODO backend: POST /challenges/:id/comments
    console.log("send comment:", comment);
    setComment("");
  };

  const onComplete = () => {
    // TODO backend: POST /challenges/:id/complete
    console.log("complete challenge", challengeId);
  };

  const userPoints = "3434 pts"; // mock pour le Header

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Details" count={userPoints} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Titre */}
        <Text style={styles.title}>{mock.title}</Text>

        {/* Description */}
        <Section title="Description">
          <Text style={styles.p}>{mock.description}</Text>
        </Section>

        {/* Why it’s important */}
        <Section title="Why it’s important">
          <Text style={styles.p}>{mock.why}</Text>
        </Section>

        {/* Fun fact */}
        <View style={styles.funFactBox}>
          <Text style={styles.funFactTitle}>Fun fact</Text>
          <Text style={styles.p}>{mock.funFact}</Text>
        </View>

        {/* Activity */}
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

        {/* Comments */}
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

        {/* Add a comment */}
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
        </TouchableOpacity>

        {/* Complete challenge */}
        <TouchableOpacity style={styles.primaryBtn} onPress={onComplete}>
          <Text style={styles.primaryText}>Complete the challenge</Text>
        </TouchableOpacity>
      </ScrollView>
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
