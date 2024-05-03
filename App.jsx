import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './screens/HomeScreen';
import DepensesScreen from './screens/DepensesScreen';
import RevenuScreen from './screens/RevenuScreen';
import EmployeScreen from './screens/EmployeScreen';
import AnalyseScreen from './screens/AnalyseScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ExchangeScreen from './screens/ExchangeScreen';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const navigation = useNavigation();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: 'crimson',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        display: 'flex',
        height: 50,
      },
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Accueil') {
          iconName = 'home';
        } else if (route.name === 'Dépenses') {
          iconName = 'credit-card';
        } else if (route.name === 'Revenu') {
          iconName = 'currency-usd';
        } else if (route.name === 'Employé') {
          iconName = 'account';
        } else if (route.name === 'Analyse') {
          iconName = 'home-analytics';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Accueil" component={HomeScreen} />
    <Tab.Screen name="Dépenses" component={DepensesScreen} />
    <Tab.Screen name="Revenu" component={RevenuScreen} />
    <Tab.Screen name="Employé" component={EmployeScreen} />
    <Tab.Screen name="Analyse" component={AnalyseScreen} />
  </Tab.Navigator>
);

const App = () => {
  
  // TODO
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        userId === null ?  navigation.navigate("Login") : navigation.navigate("TabNavigator");
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Échange" component={ExchangeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
