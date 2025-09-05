import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { addUserPhoto } from "../reducers/user";
import { useDispatch } from "react-redux";

export default function ValidateModal({ onClose, challenge, onValidated }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  //un état pour afficher l’image seulement après que l’utilisateur en ait choisi une
  const [previewImage, setPreviewImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const cameraRef = useRef(null);

  const dispatch = useDispatch();

  const API_URL = "http://192.168.1.158:3000";

  // on passe par une fonction et non useEffect car il faut
  // que la demande de permission soit faite quand on clique
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
      const uri = photo.uri;
      if (!photo || !uri) {
        console.warn("No photo captured");
        return;
      }
      const formData = new FormData();
      formData.append("photoFromFront", {
        uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      const response = await fetch(`${API_URL}/photo/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      //console.log("Cloudinary URL:", data.url);

      if (data?.url) {
        dispatch(addUserPhoto(data.url));
        setPreviewImage(data.url);
        setShowCamera(false);
      }
    } catch (error) {
      console.error("Photo process failed", error);
    }
  };

  //choisir une photo depuis la galérie

  const pickPicture = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append("photoFromFront", {
        uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      try {
        const response = await fetch(`${API_URL}/photo/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        //console.log("Cloudinary URL:", data.url);

        if (data?.url) {
          dispatch(addUserPhoto(data.url));
          setPreviewImage(data.url);
        }
      } catch (error) {
        console.error("Upload failed", error);
      }
    }
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="dialog"
      accessibilityLabel="Validate your challenge"
    >
      <View style={styles.modal}>
        <View style={styles.header}>
          {/* side placeholder car j'ai pas trouvé comment le mettre au milieu le text*/}
          <View style={styles.sidePlaceholder}>
            {(previewImage || showCamera) && (
              <TouchableOpacity
                onPress={() => {
                  if (showCamera) {
                    setShowCamera(false);
                  } else {
                    setPreviewImage(null);
                  }
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <FontAwesome name="arrow-left" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.headerText} accessibilityRole="header">
            Validate the challenge
          </Text>

          {/* réinit les états au cas ou on ferme, pour que cela ne garde pas les photos uploadées/prises*/}
          <TouchableOpacity
            onPress={() => {
              setPreviewImage(null);
              setShowCamera(false);
              onClose();
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close validation modal"
          >
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* mode preview ou boutons avec la description */}

        {!showCamera && (
          <>
            {previewImage ? (
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: previewImage }}
                  style={styles.image}
                  accessible={true}
                  accessibilityLabel="Preview of your challenge photo"
                />
                {/* bouton pour valider*/}
                <TouchableOpacity
                  style={styles.submitModal}
                  onPress={() => {
                    if (previewImage) {
                      onValidated(previewImage); // on appelle handleSubmit du HomeScreen
                      setPreviewImage(null);
                      setShowCamera(false);
                      onClose();
                    }
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Submit photo to validate challenge"
                >
                  <Text style={styles.submitModalText}> Submit </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.modalDescription}>
                  <Text>
                    Take a photo of your completed challenge or upload one from
                    your device
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={grantPermissionTakePicture}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Open your phone's camera to take a photo of your challenge"
                >
                  <Text style={styles.buttonText}>Open camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={pickPicture}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Upload a photo from your device"
                >
                  <Text style={styles.buttonText2}>
                    Upload from your device
                  </Text>
                </TouchableOpacity>
              </>
            )}
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

            <TouchableOpacity
              style={styles.button}
              onPress={takePicture}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Capture a photo of your challenge"
            >
              <Text style={styles.buttonText}>Take a photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => setShowCamera(false)}
              accessibilityRole="button"
              accessibilityLabel="Close the camera view"
            >
              <Text style={styles.buttonText2}>Cancel</Text>
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
    marginTop: 50,
  },
  button2: {
    backgroundColor: "#ffffff",
    width: "90%",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: "#000",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  buttonText2: {
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
  },
  modalDescription: {
    marginTop: "20%",
    padding: 20,
    backgroundColor: "#dddddd5b",
    width: "90%",
    borderRadius: 6,
  },
  previewContainer: {
    marginTop: 20,
    position: "relative",
    alignItems: "center",
  },
  submitModal: {
    marginTop: 15,
    backgroundColor: "#0F4B34",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  submitModalText: {
    color: "#fff",
    fontWeight: "600",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
