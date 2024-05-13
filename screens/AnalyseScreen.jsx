import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from "react-native";
import firestore from "@react-native-firebase/firestore";
import Header from "../components/Header";
import ShowAnalyse from "../components/ShowAnalyse";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { EventRegister } from 'react-native-event-listeners';

const AnalyseScreen = () => {


  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [totalDepense, setTotalDepense] = useState(0);
  const [totalRevenu, setTotalRevenu] = useState(0);
  const [totalDepenseEmp, setTotalDepenseEmp] = useState(0);
  const [totalExchange , setTotalExchange] = useState(0);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedEndDate, setSelectedEndDate] = useState(formatDate(new Date()));
  const [userId, setUserId] = useState(null);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const onChangeStartDate = (event, selectedDate) => {
    setSelectedDate(formatDate(selectedDate));
    setShowStartDate(false);
  };

  const showModeStartDate = () => {
    setShowStartDate(true); 
  };

  const onChangeEndDate = (event, selectedDate) => {
    setSelectedEndDate(formatDate(selectedDate));
    setShowEndDate(false);
  };

  const showModeEndDate = () => {
    setShowEndDate(true); 
  };

  const toggleOptions = () =>{
    setShowOptions(!showOptions)
  }


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
    const listener = EventRegister.addEventListener('userIdChanged', () => {
      getUserId();
    });
    return () => {
      EventRegister.removeEventListener(listener);
    };
  }, []); 
  
  
  const getTotalDepenses = () => {
    const dateStartObj = new Date(selectedDate);
    const dateEndObj = new Date(selectedEndDate);

    const unsubscribe = firestore()
      .collection(`Users/${userId}/DepensesCollection`)
      .onSnapshot(snapshot => {
        let totalSpends = 0;
        snapshot.forEach(depense => {
          if(dateStartObj.toISOString().split("T")[0] <= depense.data().dateAdded &&  depense.data().dateAdded  <= dateEndObj.toISOString().split("T")[0]){
            totalSpends -= Number(depense.data().spends); 
          }
          });
        setTotalDepense(totalSpends);
      });
  
      return unsubscribe;
  };
  
  const getTotalRevenus = () => {
    const dateStartObj = new Date(selectedDate);
    const dateEndObj = new Date(selectedEndDate);
  
    const unsubscribe = firestore()
      .collection(`Users/${userId}/RevenusCollection`)
      .onSnapshot(snapshot => {
        let totalRevenus = 0;
        snapshot.forEach(revenu => {
          if(dateStartObj.toISOString().split("T")[0] <= revenu.data().dateAdded &&  revenu.data().dateAdded  <= dateEndObj.toISOString().split("T")[0]){
            totalRevenus += Number(revenu.data().spends);  
          }
        });
        setTotalRevenu(totalRevenus);
      });
  
    return unsubscribe;
  };
  
  const getTotalEmployes = () => {
    const unsubscribe = firestore().collection(`Users/${userId}/EmployesCollection`).onSnapshot(querySnapshot => {
        let totalEmployes = 0;
        querySnapshot.forEach(
          async employeeDoc => {
            let dateStartObj = new Date(selectedDate);
            let dateEndObj = new Date(selectedEndDate);
            const spendSnapshot = await employeeDoc.ref.collection('SpendModifications').get();
            spendSnapshot.forEach(doc => {
                if (dateStartObj.toISOString().split("T")[0] <= doc.data().dateAdded && doc.data().dateAdded <= dateEndObj.toISOString().split("T")[0]) {
                    totalEmployes -= doc.data().spends; 
                }
            });
            setTotalDepenseEmp(totalEmployes);
          });
    });

    return unsubscribe;
};


const getTotalExchange = () => {

  const dateStartObj = new Date(selectedDate);
  const dateEndObj = new Date(selectedEndDate);

  const unsubscribe = firestore()
    .collection(`Users/${userId}/ExchangeCollection`)
    .onSnapshot(snapshot => {
      let totalExchange = 0;
      snapshot.forEach(exchange => {
        const exchangeDate = new Date(exchange.data().date.seconds * 1000)
        if(dateStartObj.toISOString().split("T")[0] <= exchangeDate.toISOString().split("T")[0] &&  exchangeDate.toISOString().split("T")[0]  <= dateEndObj.toISOString().split("T")[0]){
            if(exchange.data().type === 'taking'){
              totalExchange += Number(exchange.data().spend);
            }else if(exchange.data().type === 'giving'){
              totalExchange -= Number(exchange.data().spend);
            }
        }
        setTotalExchange(totalExchange);
      });
})
  return unsubscribe;
};


  const fetchInitialData = async () => {
    await Promise.all([ getTotalDepenses() , getTotalRevenus(), getTotalEmployes(), getTotalExchange()]);
  };

  useEffect(() => {
    fetchInitialData();
  },[userId, selectedDate, selectedEndDate]);

  return (
    <View style={{flex:1, backgroundColor:"white"}}>

      <Header title={"Analyse"} MyIcon={"calendar"} dateSelcted={selectedDate} endDate={selectedEndDate} onIconPress={toggleOptions}/>
    <ScrollView>

    <TouchableWithoutFeedback onPress={()=>setShowOptions(false)} >
    <View style={styles.container}>
      <ShowAnalyse 
        total={Number(totalDepense + totalRevenu + totalDepenseEmp)}
        totalDepense={totalDepense}
        totalRevenu={totalRevenu}
        totalEmp={totalDepenseEmp}
        totalExchenge={totalExchange}
      />
      
        {showOptions &&
         <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.buttonEndDate} onPress={showModeStartDate}>
              <Text style={{color:"white"}}>Début</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStartDate} onPress={showModeEndDate}>
              <Text style={{color:"white"}}>Fin</Text>
            </TouchableOpacity>
          </View>
        }  
    
      {showStartDate && <DateTimePicker testID='dateTimePicker' value={new Date()} onChange={onChangeStartDate} />}
      {showEndDate && <DateTimePicker testID='dateTimePicker' value={new Date()} onChange={onChangeEndDate} />}
    </View>
    </TouchableWithoutFeedback>
    </ScrollView>
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
  optionsContainer: {
    bottom:"72%",
    left:"83%",
  },
  buttonStartDate: {
    position: 'absolute',
    bottom: 70,
    backgroundColor: 'rgb(225 29 72)',
    width: 50,
    height: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation : 5 
  },
  buttonEndDate: {
    position: 'absolute',
    bottom: 130,
    backgroundColor: 'rgb(225 29 72)',
    width: 50,
    height: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation : 5
  }
});

export default AnalyseScreen;
