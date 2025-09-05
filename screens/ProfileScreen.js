import { TouchableOpacity, StyleSheet, Text, View, Alert, ScrollView } from "react-native";
import Header from "../components/Header";
import Badge from "../components/Badge";
import { useSelector, useDispatch } from "react-redux";
import { logout, updatePoints } from "../reducers/user";
import { useEffect } from "react";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  // recup depuis le redux
  const user = useSelector((state) => state.user);
  const { username, currentPoints } = user;

  // on recupère les dernières données utilisateur au chargement
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("http://192.168.1.158:3000/users/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();

        if (data.result) {
          // on met à jour le Redux si nécessaire
          if (data.userTotalPoints !== currentPoints) {
            dispatch(
              updatePoints({
                userPoints: data.userTotalPoints,
                userCO2: data.userTotalCo2SavingsPoints,
                deptPoints: data.department.totalPoints,
                deptCO2: data.department.totalCo2SavingsPoints,
              })
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user.token) {
      fetchUserData();
    }
  }, [user.token, currentPoints]);

  //pour l'instant on a juste un tableau des badges, à voir pour créer peut être une API et transmettre la logique au backend
  const existingBadges = [
    { name: "🌱", text: "Little Seed", points: 400, disabled: true },
    { name: "🥕", text: "Baby Carrot", points: 800, disabled: true },
    { name: "🥦", text: "Mighty Broccoli", points: 1200, disabled: true },
    { name: "🌶️", text: "Brilliant Pepper", points: 1600, disabled: true },
    { name: "🌽", text: "Golden Corn", points: 2000, disabled: true },
    { name: "🎃", text: "Legendary Pumpkin", points: 2400, disabled: true },
  ];
  // on détermine le prochain palier

  // on cherche le premier badge dont les points sont superieurs aux points currents de l'utilisateur
  // (les badges sont triés par points croissants)
  const nextBadge = existingBadges.find(
    (badge) => badge.points > currentPoints
  );

  //si on a trouvé un nextBadge, alors la jauge de progression doit viser son seuil
  //sinon si tous les badges sont déjà débloqués, on met totalPoints = currentPoints pour que la barre affiche 100%

  const totalPoints = nextBadge ? nextBadge.points : currentPoints;

  // on fait un nouveau tableau avec disabled changé dynamiquement (true si pas assez de points), on ne modifie pas l'existant !
  const usersBadges = existingBadges.map((badge) => ({
    ...badge,
    disabled: currentPoints < badge.points,
  }));

  // pour compter le nombre de badges
  const currentBadgeCount = usersBadges.filter(
    (badge) => !badge.disabled
  ).length; // crée le nouveau tableau avec des badges activés (condition respéctée)
  const totalBadgeCount = existingBadges.length; // le nombre total des badges dans le tableau

  // progression : tant qu'il y a ou progresser, on fait score courant / seuil du prochain badge, sinon on met 1 = 100%
  const progress = nextBadge ? currentPoints / totalPoints : 1;

  const handleSignOut = () => {
    Alert.alert("See you soon!", "Are you sure you want to sign out ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: () => {
          dispatch(logout());
          //reset supprime l’historique de navigation
          // pour éviter que le user puisse revenir en arrière après le signout
          navigation.reset({
            routes: [{ name: "SignIn" }],
          });
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Header title="PlanetPals" count={currentPoints} />
      </View>
   <ScrollView 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* profile name */}
      <View
        style={styles.profileNameContainer}
        accessible={true}
        accessibilityLabel={`Profile name: ${username}`}
        accessibilityRole="text"
      >
        <Text style={styles.profileNameText}>{username}</Text>
      </View>

      {/* barre de progression*/}
      <View
        style={styles.progressContainer}
        accessible={true}
        accessibilityLabel={`Progress: ${currentPoints} out of ${totalPoints} points`}
        accessibilityRole="progressbar"
      >
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
          <Text style={styles.myBadgesText}>
            My badges ({currentBadgeCount}/{totalBadgeCount})
          </Text>
        </View>
        {usersBadges.map((badge, index) => (
          <Badge
            key={index}
            name={badge.name}
            text={badge.text}
            points={badge.points}
            disabled={badge.disabled}
          />
        ))}
      </View>
      {/* LogOut*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignOut}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Sign out from your account"
        >
          <Text style={styles.logOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#f2f2f2ff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageHeader: {
    width: "100%",
  },
  scrollContent: {
  alignItems: "center",
  paddingBottom: 20,
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
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  logOutText: {
    color: "#0F4B34",
    marginTop: 40,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
