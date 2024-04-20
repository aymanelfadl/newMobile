import React from "react";
import { TouchableOpacity, View, StyleSheet, Image, Text } from "react-native";
import LogoTest from "../assets/plus.png";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const AddItemBtn = () => {
  const navigation = useNavigation(); // Access the navigation object

  const DataBtns = [
    { title:"Depense", description: "Nouveau Depense", onPress: () => console.log("Nouveau Depense") },
    { title:"Revenu",description: "Nouveau Revenu", onPress: () => console.log("Nouveau Revenu") },
    { title:"Dépense pour Employe", description: "Nouveau Depense", onPress: () => navigation.navigate('Employé') }, // Navigate to EmployeScreen
  ];

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height:"100%",
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
    fontWeight: "normal",
    color: "#000",
  }
});

export default AddItemBtn;
