import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { Camera, CameraView } from "expo-camera";
import { addUserPhoto } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";

export default function ValidateModal({ onClose }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);

  const dispatch = useDispatch();

  //recuperation de l'utilisateur connecté
  const username = useSelector((state) => state.user.value.username);

  // on passe par une fonction et non useEffect car il faut que la demande de permission soit faite quand on clique
  // sur le take a photo et non au montage
  // c'est async a cause de la demande de permission justement 

  const grantPermissionTakePicture = async () => {
    // destructuration d'objet au lieu de result.status
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status === "granted") {
      setHasPermission(true);
      setShowCamera(true);
    } else {
      alert("Permission denied");
    }
  };

  //fonction pour prendre la photo (recup du cours)

  const takePicture = async () => {
    try {
      if (!cameraRef.current) {
        console.warn("Camera ref is not available");
        return;
      }
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });
      if (!photo || !photo.uri) {
        console.warn("No photo captured");
        return;
      }
      const formData = new FormData();
      formData.append("photoFromFront", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      const response = await fetch("http://localhost:3000/photo/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data?.url) {
        dispatch(addUserPhoto(data.url));
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.header}>
          {/* side placeholder car j'ai pas trouvé comment le mettre au milieu le text*/}
          <View style={styles.sidePlaceholder} />
          <Text style={styles.headerText}>Validate the challenge</Text>
          <TouchableOpacity onPress={onClose}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {!showCamera && (
          <>
            <View style={styles.challengeDescription}>
              {/* sera dynamique quand on va recuperer les challenges*/}
              <Text>
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.{" "}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={grantPermissionTakePicture}
            >
              <Text style={styles.buttonText}>Open camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2}>
              <Text style={styles.buttonText2}>Upload from your device</Text>
            </TouchableOpacity>
          </>
        )}

        {showCamera && hasPermission && (
          <>
            {/* obligé de le mettre dans une View à part sinon elle est trop petite et ne s'affiche pas */}
            <View style={{ flex: 1, width: "90%", minHeight: 200 }}>
              <CameraView
                style={{ flex: 1 }}
                ref={(ref) => (cameraRef.current = ref)}
                facing="back"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.buttonText}>Take a photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.buttonText2}>Quit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute", // positionnement de la modal par rapport à son parent
    bottom: 0, // l'affiche tout en bas de l'ecran
    width: "100%",
    height: "50%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: "#dddddd5b",
    alignItems: "center",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  sidePlaceholder: {
    width: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
  },
  modal: {
    width: "90%",
    flex: 1, // tout l'espace dispo verticalement
    alignItems: "center",
  },

  button: {
    backgroundColor: "#0F4B34",
    width: "90%",
    padding: 12,
    borderRadius: 6,
    marginTop: 30,
  },
  button2: {
    backgroundColor: "#ffffff",
    width: "90%",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: "#000000",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  buttonText2: {
    color: "#00000",
    fontWeight: "600",
    textAlign: "center",
  },
  challengeDescription: {
    marginTop: "10%",
    padding: 20,
    backgroundColor: "#dddddd5b",
    width: "90%",
    borderRadius: 6,
  },
});
