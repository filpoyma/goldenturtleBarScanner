import React from "react";
// import {Ionicons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
// import FAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import {Image, TouchableOpacity} from "react-native";

// import Colors from "../constants/Colors";
// import useColorScheme from "../hooks/useColorScheme";
import BarCodeScanScreen from "../screens/BarCodeScanScreen";
import AboutScreen from "../screens/AboutScreen";
import ButtonTab from "../components/ButtonTab";
import Context from "../context";


const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  // const colorScheme = useColorScheme();
  const { setTorchHandler, isTorch } = React.useContext(Context);

  return (
    <BottomTab.Navigator initialRouteName="BarCodeScan">
      <BottomTab.Screen
        name="BarCodeScan"
        component={BarCodeScanNavigator}
        options={{
          title: "",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#2f95dc",
          backgroundColor: '#f7f7f7',
          tabBarHideOnKeyboard: true,

          tabBarIcon: ({color}) => (
            <Image source={require('../assets/images/search.png')}
                          style={{
                            width: 60,
                            height: 60,
                            opacity: color === "#2f95dc" ? 1 : 0.7
                          }}
            />
          ),
          tabBarStyle: [
            {
              display: "flex",
              height: 95,
            },
            null,
          ],
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchNavigator}
        params={'123'}
        options={{
          title: "",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#2f95dc",
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({color}) => (
            <ButtonTab style={{opacity: color === "#2f95dc" ? 1 : 0.5}}>
                 ПОИСК
            </ButtonTab>
          ),
          tabBarStyle: [
            {
              display: "flex",
              height: 95,
            },
            null,
          ],
        }}
      />
      <BottomTab.Screen name="Settings"
                        component={AboutNavigator}
                        options={({navigation}) => ({
                          title: "",
                          tabBarShowLabel: false,
                          tabBarHideOnKeyboard: true,
                          tabBarButton: props => <TouchableOpacity {...props} onPress={setTorchHandler}/>,
                          tabBarIcon: ({color}) => (
                            <Image source={require('../assets/images/torch.png')}
                                   style={{
                                     width: 60,
                                     height: 60,
                                     opacity: isTorch ? 1 : 0.7
                                   }}
                            /> )

                        })

                        }/>
    </BottomTab.Navigator>

  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
// function TabBarIcon(props) {
//   return <Ionicons size={30} style={{marginBottom: -3}} {...props} />;
// }

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const BarCodeScanStack = createStackNavigator();

function BarCodeScanNavigator() {
  return (
    <BarCodeScanStack.Navigator>
      <BarCodeScanStack.Screen
        name="BarCodeScanScreen"
        component={BarCodeScanScreen}
        options={{headerTitle: "Scan QR Code"}}
      />
    </BarCodeScanStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

function SearchNavigator() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchScreen"
        component={BarCodeScanScreen}
        options={{headerTitle: "Search"}}
      />
    </SearchStack.Navigator>
  );
}

const AboutStack = createStackNavigator();

function AboutNavigator() {
  return (
    <AboutStack.Navigator>
      <AboutStack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{headerTitle: "About"}}
      />
    </AboutStack.Navigator>
  );
}
