import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import ShowAnalyse from "../components/ShowAnalyse";
import Icon from "react-native-vector-icons/EvilIcons";
import DatePicker from 'react-native-date-picker';

const AnalyseScreen = () => {
  const navigation = useNavigation();

  const [totalDepense, setTotalDepense] = useState(0);
  const [totalRevenu, setTotalRevenu] = useState(0);
  const [totalDepenseEmp, setTotalDepenseEmp] = useState(0);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getTotalDepenses = () => {
    const unsubscribe = firestore().collection('DepensesCollection').where("timestamp", "<=", selectedDate).onSnapshot(snapshot => {
      let totalSpends = 0;
      snapshot.forEach(depense => {
        totalSpends -= Number(depense.data().spends); 
      });
      setTotalDepense(totalSpends);
    });
  
    return unsubscribe;
  };

  const getTotalRevenus = () => {
    const unsubscribe = firestore().collection('RevenusCollection').where("timestamp", "<=", selectedDate).onSnapshot(snapshot => {
      let totalRevenus = 0;
      snapshot.forEach(revenu => {
        totalRevenus += Number(revenu.data().spends);  
      });
      setTotalRevenu(totalRevenus);
    });
  
    return unsubscribe;
  };
  
  const getTotalEmployes = () => {
    const unsubscribe = firestore().collection('changeLogs').where("timestamp", "<=", selectedDate).onSnapshot(snapshot => {
      let totalEmployes = 0;
      snapshot.forEach(log => {
        if (log.data().type === "Update" && typeof log.data().newSpends === "number") {
          totalEmployes -= log.data().newSpends;
        }
      });
      setTotalDepenseEmp(totalEmployes);
    });
  
    return unsubscribe;
  };
  
  useEffect(() => {
    const fetchInitialData = async () => {
        await Promise.all([getTotalDepenses(), getTotalRevenus(), getTotalEmployes()]);
    };

    fetchInitialData();
  }, [selectedDate]); 
 
  const DateModal = () =>{
    return (
      <DatePicker
        modal
        mode='date'
        them="light"
        open={isDateModalOpen}
        date={selectedDate}
        onConfirm={(selectedDate) => {
          setIsDateModalOpen(false)
          setSelectedDate(selectedDate)
        }}
        onCancel={() => {
          setIsDateModalOpen(false)
        }}
      />
    )
  }

  
  const formatDate = (date) =>{
    const currentDate = date;
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear().toString();
        return `${day}/${month}/${year}`;
}
  return (
    <View style={styles.container}>
      <Header title={"Analyse"} MyIcon={"plus"} dateSelcted={formatDate(selectedDate)} onIconPress={()=>navigation.navigate("Exchange")}/>
      <ShowAnalyse 
        total={Number(totalDepense + totalRevenu + totalDepenseEmp)}
        totalDepense={totalDepense}
        totalRevenu={totalRevenu}
        totalEmp={totalDepenseEmp}
      />
      
      <TouchableOpacity style={styles.button} onPress={()=>setIsDateModalOpen(true)}>
        <Text><Icon name="calendar" size={45} color="white" /></Text>
      </TouchableOpacity>
      <DateModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    margin: 0,
    backgroundColor:"white"
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'crimson',
    width: 60,
    height: 60,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation : 5
  },
});

export default AnalyseScreen;
