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
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>New Employee</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="black"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholderTextColor="black"
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TouchableOpacity style={[styles.btn, styles.addEmployeeBtn]} onPress={handleAddEmployee}>
            <Text style={styles.btnText}>Add Employee</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.closeButton]} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
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
    padding: 40,
    borderRadius: 10,
    elevation: 5,
    width: '80%'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom:16,
    marginTop: -25,
    marginLeft: -10 ,
    textAlign: "left",
    color: "#000"
  },
  input: {
    borderWidth: 1,
    borderColor: '#262626',
    backgroundColor: "#FFF",
    borderRadius: 15,
    color: "#000",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  text: {
    color: "black",
    fontSize: 20,
    fontWeight:"100",
    marginLeft:10,
    marginBottom:8
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
    backgroundColor: "#ff0000",
    padding: 8,
    borderRadius: 100,
    marginBottom: -10,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  addEmployeeBtn: {
    backgroundColor: "#0066cc", 
    padding:10,
    marginBottom: 15,
    marginTop:15
  },
});

export default EmployeeModal;
