import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const SignUpScreen = () => {
  
  const navigation = useNavigation();

  const [user, setUser] = useState({
    name: '',
    password: '',
    second_password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    try {
      if (user.password !== user.second_password) {
        setErrorMessage("Les mots de passe ne correspondent pas.");
        return;
      }
      if (user.password.length < 8) {
        setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
        return;
      }

      await firestore().collection("Users").add({
        ...user,
        createdAt: new Date(),
      });

      navigation.navigate("Lgoin")
      setUser({
        user_name: '',
        password: '',
        second_password: '',
      });
      setErrorMessage('');
    } catch (err) {
      console.error("Error signing up:", err);
      setErrorMessage("Une erreur s'est produite lors de l'inscription. Veuillez réessayer plus tard.");
    }
  };

  return (
    <LinearGradient colors={['#900c3f', '#c70039']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.headerText}>Inscrivez-vous</Text>
        <Text style={styles.subHeaderText}>Créez un compte pour continuer</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom Utilisateur</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Entrez Nom Utilisateur"
              value={user.user_name}
              onChangeText={(text) => setUser({ ...user, name: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de Passe</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Entrez Mot de Pass"
              secureTextEntry={true}
              value={user.password}
              onChangeText={(text) => setUser({ ...user, password: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmez Mot de Passe</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Confirmez Votre Mot de Passe"
              secureTextEntry={true}
              value={user.second_password}
              onChangeText={(text) => setUser({ ...user, second_password: text })}
            />
          </View>
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '10%',
  },
  backButton: {
    elevation: 10,
    position: 'absolute',
    left: 10,
    backgroundColor: "#c70039",
    borderRadius: 100,
  },
  headerText: {
    fontSize: 30,
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
    color: 'black',
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
  errorMessage: {
    color: '#272530',
    borderRadius:10,
    marginVertical: 10,
  },
});

export default SignUpScreen;
