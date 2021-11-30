import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import {Ionicons} from "@expo/vector-icons";
// import FAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, TouchableOpacity } from 'react-native';

import BarCodeScanScreen from '../screens/BarCodeScanScreen';

import Null from '../components/Null';
import SearchScreen from '../screens/SearchScreen';
import { Colors } from '../constants/Colors';
import LogoTitle from '../components/LogoTitle';
import { switchTorch } from '../store/actions';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  // const colorScheme = useColorScheme();
  const isTorch = useSelector((state) => state.isTorch);
  const dispatch = useDispatch();

  return (
    <BottomTab.Navigator initialRouteName="BarCodeScan">
      <BottomTab.Screen
        name="BarCodeScan"
        component={BarCodeScanNavigator}
        options={{
          title: '',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#2f95dc',
          backgroundColor: '#f7f7f7',
          tabBarHideOnKeyboard: true,

          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/search_qr.png')}
              style={{
                width: 55,
                height: 55,
                opacity: color === '#2f95dc' ? 1 : 0.7
              }}
            />
          ),
          tabBarStyle: [
            {
              display: 'flex',
              height: 80,
              elevation: 0,
              borderTopWidth: 0
            },
            null
          ]
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchNavigator}
        params={'123'}
        options={{
          title: '',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#2f95dc',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/search.png')}
              style={{
                width: 55,
                height: 55,
                opacity: color === '#2f95dc' ? 1 : 0.7
              }}
            />
          ),
          tabBarStyle: [
            {
              display: 'flex',
              height: 80,
              elevation: 0,
              borderTopWidth: 0
            },
            null
          ]
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Null}
        options={({ navigation }) => ({
          title: '',
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarButton: (props) => <TouchableOpacity {...props} onPress={() => dispatch(switchTorch())} />,
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/torch_too.png')}
              style={{
                width: 55,
                height: 55,
                opacity: isTorch ? 1 : 0.7
              }}
            />
          )
        })}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
// function TabBarIcon(props) {
//   return <Ionicons size={30} style={{marginBottom: -3}} {...props} />;
// }

const BarCodeScanStack = createStackNavigator();

function BarCodeScanNavigator() {
  return (
    <BarCodeScanStack.Navigator>
      <BarCodeScanStack.Screen
        name="BarCodeScanScreen"
        component={BarCodeScanScreen}
        options={{
          // title: `ЗОЛОТАЯ ЧЕРЕПАХА ${currentYear}`,
          headerTitle: () => <LogoTitle />,
          headerStyle: {
            backgroundColor: Colors.primary
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}
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
        component={SearchScreen}
        options={{
          headerTitle: () => <LogoTitle />,
          headerStyle: {
            backgroundColor: Colors.primary
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}
      />
    </SearchStack.Navigator>
  );
}

// const AboutStack = createStackNavigator();
// function AboutNavigator() {
//   return (
//     <AboutStack.Navigator>
//       <AboutStack.Screen name="AboutScreen" component={AboutScreen} options={{ headerTitle: 'About' }} />
//     </AboutStack.Navigator>
//   );
// }
