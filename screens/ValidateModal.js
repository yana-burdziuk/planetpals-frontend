import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";

export default function ValidateModal({  }) {
  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.headerText}>Validate the challenge</Text>
        <View style={styles.challengeDescription}>
          {/* sera dynamique quand on va recuperer les challenges*/}
          <Text>
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.{" "}
          </Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Take a photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2}>
          <Text style={styles.buttonText2}>Upload from your device</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  headerText: {
    marginTop : "5%",
  },
  modal: {
    borderWidth: 1,
    width: "100%",
    height: "50%",
    borderColor: "#ddd",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    borderRadius : 6,
  },
});
