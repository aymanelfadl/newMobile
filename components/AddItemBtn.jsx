import React, {useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Image, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Header from "./Header";
import ExpenseIcon from "../assets/expenses.png";
import IncomeIcon from "../assets/income.png";
import EmployeeExpenseIcon from "../assets/recruitment.png";
import AddSpendModalDepenses from "./AddSpendModalDepenses";
import AddSpendModalRevenu from "./AddSpendModalRevenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventRegister } from 'react-native-event-listeners';



const AddItemBtn = () => {
  const [openDepenseModal, setOpenDepenseModal]= useState(false);
  const [openRevenuModal, setOpenRevenuModal]= useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  
  const LogOutIconName =  'location-exit';

  const navigation = useNavigation(); 


  const DataBtns = [
    { title:"Nouvelle Dépense", description: "Enregistrer une nouvelle dépense", onPress: () => setOpenDepenseModal(true), backgroundColor: "rgb(244 63 94)", icon: ExpenseIcon }, 
    { title:"Nouveau Revenu", description: "Enregistrer un nouveau revenu", onPress: () => setOpenRevenuModal(true), backgroundColor: "rgb(14 165 233)", icon: IncomeIcon }, 
    { title:"Dépense pour Employé", description: "Enregistrer une dépense pour un employé", onPress: () => navigation.navigate('Employé'), backgroundColor: "rgb(55 65 81)", icon: EmployeeExpenseIcon }, 
  ]; 
  

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserName = await AsyncStorage.getItem('userName')
        if (storedUserId !== null && storedUserName !== null) {
          setUserId(storedUserId);
          setUserName(storedUserName);
          console.log(storedUserId);
          console.log(storedUserName);
        }
      } catch (error) {
        console.error('Error retrieving user ID from local storage:', error);
      }
    };
    getUserId();
    const listener = EventRegister.addEventListener('userIdChanged', () => {
      getUserId();
    });
    return () => {
      EventRegister.removeEventListener(listener);
    };
  }, []); 

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userName');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  

  const renderButtons = () => {
    return DataBtns.map((btnData, index) => (
      <View key={index}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, {color: btnData.backgroundColor}]}>{btnData.title}</Text>
          <View style={[styles.line,{backgroundColor: btnData.backgroundColor}]}></View>
        </View>
        <TouchableOpacity style={[styles.itemContainer, { backgroundColor: btnData.backgroundColor }]} onPress={btnData.onPress}>
          <View style={styles.iconContainer}>
            <Image source={btnData.icon} style={styles.icon} />
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{btnData.description}</Text>
          </View>
        </TouchableOpacity>
      </View>
    ));
  };
  
  
  return (
    <View style={styles.mainContainer}>
      <Header title={"Bienvenue " + userName} MyIcon={LogOutIconName} mySecondIcon="rotate-3d-variant" onIconPress={handleLogOut} onSecondIconPress={()=>{navigation.navigate("Échange")}} />
      {renderButtons()}
      <AddSpendModalDepenses visible={openDepenseModal} onClose={() =>{setOpenDepenseModal(false)}} />
      <AddSpendModalRevenu visible={openRevenuModal} onClose={() =>{setOpenRevenuModal(false)}} />      
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    margin:0,
    position:"relative",
    backgroundColor: 'white',
  },
  itemContainer: {
    borderRadius: 40,
    borderColor: "#ccc",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: 'gray',
    flexDirection: 'row',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
    padding: 15,
    marginVertical: 30, 
    width:"80%"
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
  },
  title: {
    color :"black",
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
    paddingHorizontal:10,
    paddingVertical:10
  },
  line: {
    flex: 1,
    height: 2,
    
  },
  iconContainer: {
    marginRight: 10,
    borderRadius: 100,
    backgroundColor: "rgb(250 250 250)",
    padding:10
  },
  icon: {
    width: 40,
    height: 40,
  },
  descriptionContainer: {
    flex: 1,
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    color:"white"
  },
});

export default AddItemBtn;
