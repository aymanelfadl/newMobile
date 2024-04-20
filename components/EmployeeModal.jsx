import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TextInput, Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const EmployeeModal = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleAddEmployee = async () => {
    try {
        // the default image 
      const imageUrl = '';
       // obj employee
      const employeeData = {
        name: name,
        lastName: lastName,
        avatar: imageUrl,
      };

        await uploadToFirebase(employeeData);
    
      onClose();
    } catch (error) {
      console.error('Error handling employee data:', error);
    }
  };

 
 const uploadToFirebase = async (employeeData) => {
    try {
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear().toString();

      const formattedDate = `${day}/${month}/${year}`;

      const employeeRef = await firestore().collection('itemsCollection').add({
        type: 'employee',
        thumbnail: employeeData.avatar, 
        description: employeeData.name + ' ' + employeeData.lastName,
        spends: 0,
        dateAdded: formattedDate,
        timestamp: currentDate,
    });

  
      await firestore().collection('changeLogs').add({
        timestamp: new Date(),
        operation: 'A new employee, ' + employeeData.name + ' ' + employeeData.lastName + ' has been added',
        itemId: employeeRef.id,
      });
      console.log("the employee has ben addeed ");
      onClose();
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
          <TouchableOpacity style={[styles.btn, styles.addEmployeeBtn]} onPress={handleAddEmployee}>
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
