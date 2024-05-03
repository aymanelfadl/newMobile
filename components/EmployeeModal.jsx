import React, { useState,useEffect } from 'react';
import { View, Modal, StyleSheet, Text, TextInput, TouchableOpacity, } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const EmployeeModal = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userId, setUserId] = useState(null);
 
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error retrieving user ID from local storage:', error);
      }
    };

    getUserId();
  }, []);
 

  const formatDate = (date) =>{
    const currentDate = date;
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

 const uploadToFirebase = async () => {
    try {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const img = 'https://firebasestorage.googleapis.com/v0/b/expense-manager-376bc.appspot.com/o/employes.png?alt=media&token=c33d6436-242a-480e-bb58-d52ebeaa642a'
        
        const employeeRef = await firestore().collection(`Users/${userId}/EmployesCollection`).add({
          thumbnail: img, 
          description: name + ' ' + lastName,
          spends: 0,
          dateAdded: formattedDate,
          timestamp: currentDate,
      });
      onClose();
      
      await firestore().collection('changeLogs').add({
        timestamp: new Date(),
        operation: "Un nouveau employé, " + name + " " + lastName + ", a été ajouté.",
        itemId: employeeRef.id,
      });
      console.log("the employee has ben addeed ");
      setName("");
      setLastName("");
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
 
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Nouvel Employé</Text>
          <TextInput
            style={styles.input}
            placeholder="Prenom"
            placeholderTextColor="black"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholderTextColor="black"
            style={styles.input}
            placeholder="Nom"
            value={lastName}
            onChangeText={setLastName}
          />
          <TouchableOpacity style={[styles.btn, styles.addEmployeeBtn]} onPress={uploadToFirebase}>
            <Text style={styles.btnText}>Ajouter Employé</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.closeButton]} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderRadius: 30,
    width: '80%',
    shadowColor: 'crimson',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 3,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom:20,
    color: "rgb(38 38 38)"
  },
  input: {
    borderWidth: 1,
    borderColor: 'crimson',
    backgroundColor: "#FFF",
    borderRadius: 15,
    color: "black",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#262626",
    padding: 8,
    borderRadius: 100,
    marginBottom: 15,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "crimson", 
    padding: 8,
    borderRadius: 100,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  addEmployeeBtn: {
    backgroundColor: "rgb(14 165 233)",
    padding:10,
    marginBottom: 15,
    marginTop:15
  },
});

export default EmployeeModal;
