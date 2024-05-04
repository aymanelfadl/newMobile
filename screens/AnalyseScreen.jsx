import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import ShowAnalyse from "../components/ShowAnalyse";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const AnalyseScreen = () => {

  const navigation = useNavigation();

  function formatDateToDash(dateString) {
    const parts = dateString.split('/');
    const formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
    
    return formattedDate;
  }
  
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [totalDepense, setTotalDepense] = useState(0);
  const [totalRevenu, setTotalRevenu] = useState(0);
  const [totalDepenseEmp, setTotalDepenseEmp] = useState(0);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedEndDate, setSelectedEndDate] = useState(formatDate(new Date()));
  const [userId, setUserId] = useState(null);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate
    console.log(selectedDate);
    setSelectedDate(formatDate(currentDate));
    setShowStartDate(false);
  };

  const showModeStartDate = () => {
    setShowStartDate(true); 
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate
    console.log(selectedDate);
    setSelectedEndDate(formatDate(currentDate));
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
  }, []);
  
  const getTotalDepenses = () => {
    const dateObj = new Date(selectedDate);
    dateObj.setUTCHours(23, 23, 23, 23);
    
    const unsubscribe = firestore().collection(`Users/${userId}/DepensesCollection`).where("timestamp", "<=", dateObj).onSnapshot(snapshot => {
      let totalSpends = 0;
      snapshot.forEach(depense => {
        totalSpends -= Number(depense.data().spends); 
      });
      setTotalDepense(totalSpends);
    });
  
    return unsubscribe;
  };
  
  const getTotalRevenus = () => {
    const dateObj = new Date(selectedDate);
    dateObj.setUTCHours(23, 23, 23, 23);

    const unsubscribe = firestore().collection(`Users/${userId}/RevenusCollection`).where("timestamp", "<=", dateObj).onSnapshot(snapshot => {
      let totalRevenus = 0;
      snapshot.forEach(revenu => {
        totalRevenus += Number(revenu.data().spends);  
      });
      setTotalRevenu(totalRevenus);
    });
  
    return unsubscribe;
  };
  
  const getTotalEmployes = () => {
    const unsubscribe = firestore().collection(`Users/${userId}/EmployesCollection`).onSnapshot(querySnapshot => {
        let totalEmployes = 0;

        querySnapshot.forEach(async employeeDoc => {
            let dateObj = new Date(selectedDate);
            dateObj.setUTCHours(23, 59, 59, 999);
            
            const spendSnapshot = await employeeDoc.ref.collection('SpendModifications').get();
            spendSnapshot.forEach(doc => {
                const docDate = new Date(doc.data().dateAdded);
                if (docDate <= dateObj) {
                    totalEmployes -= doc.data().spends; 
                }
            });
            setTotalDepenseEmp(totalEmployes);
        });

    });

    return unsubscribe;
};



  useEffect(() => {
    if(userId){
    const fetchInitialData = async () => {
        await Promise.all([getTotalDepenses(), getTotalRevenus(), getTotalEmployes()]);
    };
    fetchInitialData();
    }
  }, [selectedDate,userId]); 

  
  return (
    <View style={styles.container}>
      <Header title={"Analyse"} MyIcon={"chevron-double-left"} dateSelcted={selectedDate} onIconPress={()=>navigation.navigate("Échange")}/>
      <ShowAnalyse 
        total={Number(totalDepense + totalRevenu + totalDepenseEmp)}
        totalDepense={totalDepense}
        totalRevenu={totalRevenu}
        totalEmp={totalDepenseEmp}
      />
      
      <View style={styles.button}>
        <TouchableOpacity onPress={toggleOptions} >
          <Text><Icon name="calendar" size={30} color="white"></Icon></Text>
        </TouchableOpacity>
        {showOptions &&
         <>
            <TouchableOpacity style={styles.buttonEndDate} onPress={showModeStartDate}>
              <Text><Icon name="calendar-plus-o" size={20} color="white" /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStartDate} onPress={showModeEndDate}>
              <Text><Icon name="calendar-minus-o" size={20} color="white" /></Text>
            </TouchableOpacity>
          </>
        }
        
      </View>

      {showStartDate && <DateTimePicker testID='dateTimePicker' value={new Date()} onChange={onChangeStartDate} />}
      {showEndDate && <DateTimePicker testID='dateTimePicker' value={new Date()} onChange={onChangeEndDate} />}

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
  buttonStartDate: {
    position: 'absolute',
    bottom: 130,
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
    bottom: 70,
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
