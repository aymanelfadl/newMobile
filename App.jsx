import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import HomeScreen from './screens/HomeScreen';
import DepensesScreen from './screens/DepensesScreen';
import RevenuScreen from './screens/RevenuScreen';
import EmployeScreen from './screens/EmployeScreen';
import AnalyseScreen from './screens/AnalyseScreen';

const Tab = createBottomTabNavigator();


const App = () => {
  return (
    <NavigationContainer>
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
        },})}
       >
        <Tab.Screen 
          name="Accueil"
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen 
          name="Dépenses" 
          component={DepensesScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="credit-card" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen 
          name="Revenu"
          component={RevenuScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="currency-usd" size={size} color={color} />
            )
          }}
        />
          <Tab.Screen
            name="Employé"
            component={EmployeScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="account" size={size} color={color} />
              )
            }}
          />
        <Tab.Screen 
          name="Analyse"
          component={AnalyseScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home-analytics" size={size} color={color} />
            )
          }}
        /> 
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
