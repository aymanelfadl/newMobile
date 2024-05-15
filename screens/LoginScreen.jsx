import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore'; 
import { err } from 'react-native-svg';

const LoginScreen = () => {

  const navigation = useNavigation();

  const [user, setUser] = useState({
    name: "",
    password: "",
  });
  const [errs , setErrs] = useState('');

  const handleLogin = async () => {
    try {
      const { name, password } = user;

      const querySnapshot = await firestore()
        .collection('Users')
        .where('name', '==', name)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        if (userData.password === password) {
          await AsyncStorage.setItem('userId', userDoc.id);
          await AsyncStorage.setItem('userName', name);
          EventRegister.emit('userIdChanged');
          navigation.navigate('TabNavigator');
        } else {
          setErrs('Username or password is incorrect');
        }
      } else {
        setErrs('No user found with the provided username');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <LinearGradient colors={['#900c3f', '#c70039']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Extra Cach</Text>
        <Text style={styles.subHeaderText}>Connectez-vous pour continuer</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom Utilisateur</Text>
          <TextInput style={styles.input} placeholderTextColor="gray" placeholder="Entrez Nom Utilisateur" onChangeText={(text) => { setUser({ ...user, name: text }) }} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de Passe</Text>
          <TextInput style={styles.input} placeholderTextColor="gray" placeholder="Entrez Mot de Passe" secureTextEntry={true} onChangeText={(text) => { setUser({ ...user, password: text }) }} />
        </View>
        {errs ? <Text style={styles.errorMessage}>{errs}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signUpText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '20%',
  },
  headerText: {
    fontSize: 50,
    color: 'white',
    fontFamily: 'serif',
    fontWeight: '800',
  },
  subHeaderText: {
    color: 'white',
    fontFamily: 'serif',
    fontWeight: '100',
  },
  formContainer: {
    height: '50%',
    width: '100%',
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginLeft: 8,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    color: "black",
    borderRadius: 10,
    padding: 10,
  },
  button: {
    backgroundColor: 'crimson',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  signUpButton: {
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderColor: "white",
    borderWidth: 1,
    elevation: 10,
    padding: 15,
    backgroundColor: "#c70039"
  },
  signUpText: {
    color: "white"
  },
  errorMessage: {
    color: '#272530',
    borderRadius:10,
    marginVertical: 10,
  },
});

export default LoginScreen;
