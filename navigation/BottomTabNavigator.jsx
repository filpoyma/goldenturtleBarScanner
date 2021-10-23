import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import BarCodeScanScreen from "../screens/BarCodeScanScreen";
import AboutScreen from "../screens/AboutScreen";

import FAwesomeIcon from "react-native-vector-icons/FontAwesome5";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator initialRouteName="BarCodeScan">
      <BottomTab.Screen
        name="BarCodeScan"
        component={BarCodeScanNavigator}
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FAwesomeIcon name="qrcode" size={25} color={color} style={{ marginBottom: -10 }}/>
          ),
          tabBarActiveTintColor: "#2f95dc",
          tabBarStyle: [
            {
              display: "flex",
            },
            null,
          ],
        }}
      />
      <BottomTab.Screen
        name="About"
        component={AboutNavigator}
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FAwesomeIcon name="info-circle" size={25} color={color} style={{ marginBottom: -10 }}/>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const BarCodeScanStack = createStackNavigator();

function BarCodeScanNavigator() {
  return (
    <BarCodeScanStack.Navigator>
      <BarCodeScanStack.Screen
        name="BarCodeScanScreen"
        component={BarCodeScanScreen}
        options={{ headerTitle: "Scan QR Code" }}
      />
    </BarCodeScanStack.Navigator>
  );
}

const AboutStack = createStackNavigator();

function AboutNavigator() {
  return (
    <AboutStack.Navigator>
      <AboutStack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{ headerTitle: "About" }}
      />
    </AboutStack.Navigator>
  );
}
