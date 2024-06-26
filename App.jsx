import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './screens/HomeScreen';
import DepensesScreen from './screens/DepensesScreen';
import RevenuScreen from './screens/RevenuScreen';
import EmployeScreen from './screens/EmployeScreen';
import AnalyseScreen from './screens/AnalyseScreen';
import ExchangeScreen from './screens/ExchangeScreen';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
    <Tab.Screen
      name="Accueil"
      component={HomeScreen}
    />
    <Tab.Screen
      name="Dépenses"
      component={DepensesScreen}
    />
    <Tab.Screen
      name="Revenu"
      component={RevenuScreen}
    />
    <Tab.Screen
      name="Employé"
      component={EmployeScreen}
    />
    <Tab.Screen
      name="Analyse"
      component={AnalyseScreen}
    />
  </Tab.Navigator>
);

const App = () => {

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator >
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />  
          <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />  

          <Stack.Screen
            name="Échange"
            component={ExchangeScreen}
            options={{
              headerTitleStyle: {
                color: "crimson"
              },
              headerTintColor: "crimson"
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
