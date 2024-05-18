import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';


const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(async() => { 
        try {
          const userId = await AsyncStorage.getItem('userId');
          console.log(userId);
          if(userId === null) {
            navigation.replace("Login")
          }else{
            navigation.replace("TabNavigator");
          }
        } catch (err) {
          console.log("Checking login err: " + err);
        }
    }, 2000);

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <LinearGradient colors={['#900c3f', '#c70039']} style={styles.container}>
        <Image source={require('../assets/logologo.png')} style={styles.logo} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
