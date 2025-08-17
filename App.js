import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import LandingPage from "./screens/LandingPage";
import HomeScreen from "./screens/HomeScreen";
import ChallengesScreen from "./screens/ChallengesScreen"; // écran de détail d’un défi
import ProfileScreen from "./screens/ProfileScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignInScreen from "./screens/SignInScreen";
import MyTeam from "./screens/MyTeam";
import RankingScreen from "./screens/RankingScreen";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";

// store redux
const store = configureStore({
  reducer: { user },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator(); // mini stack pour l’onglet Home

// Stack interne pour Home : permet de naviguer HomeScreen -> ChallengesScreen
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      {/* listing des défis */}
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      {/* détail d’un défi (description, photos, commentaires, input) */}
      <HomeStack.Screen name="ChallengesScreen" component={ChallengesScreen} />
    </HomeStack.Navigator>
  );
}

// Menu principal (tabs). On branche l’onglet Home sur son stack interne.
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          if (route.name === "Profile") iconName = "user";
          if (route.name === "MyTeam") iconName = "users"; // icône plus cohérente pour une équipe
          if (route.name === "Rankings") iconName = "trophy";
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2196f3",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      {/* l’onglet Home pointe vers HomeStackNavigator, pas directement HomeScreen */}
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Rankings" component={RankingScreen} />
      <Tab.Screen name="MyTeam" component={MyTeam} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navigation racine : écrans d’accès + TabNavigator
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* écran d’accueil au lancement */}
          <Stack.Screen name="LandingPage" component={LandingPage} />
          {/* auth */}
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          {/* app principale */}
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          {/* ne pas déclarer ChallengesScreen ici, il vit dans HomeStack */}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}