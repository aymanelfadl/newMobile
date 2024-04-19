import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Image, Text } from "react-native";
import LogoTest from "../assets/plus.png";
import EmployeeModal from "./EmployeeModal";

const AddItemBtn = () => {
  const DataBtns = [
    { title:"Ajouter Employe", description: "Nouveau Employé", onPress: () => { setIsEmployeeModalVisible(true) } },
    { title:"Ajouter Depense", description: "Nouveau Depense", onPress: () => console.log("Nouveau Depense") },
    { title:"Ajouter Revenu",description: "Nouveau Revenu", onPress: () => console.log("Nouveau Revenu") }
  ];

  const [isEmployeModalVisible, setIsEmployeeModalVisible] = useState(false);

  const renderButtons = () => {
    return DataBtns.map((btnData, index) => (
      <TouchableOpacity key={index} style={styles.itemContainer} onPress={btnData.onPress}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{btnData.title}</Text>
          <View style={styles.line}></View>
        </View>
        <Image source={LogoTest} style={styles.thumbnail} />
        <Text style={styles.description}>{btnData.description}</Text>
      </TouchableOpacity>
    ));
  };


  return (
    <View style={styles.container}>
      {renderButtons()}
      <EmployeeModal visible={isEmployeModalVisible} onClose={()=> {setIsEmployeeModalVisible(false)}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: "#fff",
  },
  itemContainer: {
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    width:"90%",
    justifyContent: "center",
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    padding:15,
    
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  thumbnail: {
    marginVertical: 8,
    width: 60,
    height: 60,
    resizeMode: "cover",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 10,
  }
});

export default AddItemBtn;
