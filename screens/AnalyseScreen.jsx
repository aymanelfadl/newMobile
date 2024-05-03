import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import ShowAnalyse from "../components/ShowAnalyse";
import Icon from "react-native-vector-icons/EvilIcons";
import DatePicker from 'react-native-modern-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';




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
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
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

  const handleCancelModal = () => {
    setSelectedDate(formatDate(new Date()));
    setIsDateModalOpen(false);
  };
  
  return (
    <View style={styles.container}>
      <Header title={"Analyse"} MyIcon={"chevron-double-left"} dateSelcted={selectedDate} onIconPress={()=>navigation.navigate("Échange")}/>
      <ShowAnalyse 
        total={Number(totalDepense + totalRevenu + totalDepenseEmp)}
        totalDepense={totalDepense}
        totalRevenu={totalRevenu}
        totalEmp={totalDepenseEmp}
      />
      
      <TouchableOpacity style={styles.button} onPress={()=>setIsDateModalOpen(true)}>
        <Text><Icon name="calendar" size={45} color="white" /></Text>
      </TouchableOpacity>

      <Modal visible={isDateModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DatePicker
              mode="calendar"
              current={selectedDate} 
              selected={selectedDate}
              onSelectedChange={date => setSelectedDate(formatDateToDash(date))} 
              options={{
                mainColor: 'crimson', 
              }}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsDateModalOpen(false)} style={[styles.buttonModal, styles.confirmButton]}>
                <Text style={styles.buttonText}>Confirmer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelModal} style={[styles.buttonModal, styles.cancelButton]}>
                <Text style={styles.buttonText}>Réinitialiser</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  buttonModal: {
    width: '45%',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'crimson',
    width: 60,
    height: 60,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: "80%",
    elevation: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20
  },
  confirmButton: {
    backgroundColor: 'rgb(14, 165, 233)',
  },
  cancelButton: {
    backgroundColor: 'crimson',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AnalyseScreen;
