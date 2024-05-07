import { useState , useEffect} from 'react';
import { View, Modal, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome"
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddSpendModalEmploye = ({ visible, employee, onClose }) => {
    
    const formatDate = (date) =>{
        const currentDate = date;
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = currentDate.getFullYear().toString();
            return `${year}-${month}-${day}`
    }
    
    const [spends, setSpends] = useState('');
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date())); 
    const [isUploading , setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dots, setDots] = useState('');
    const [userId, setUserId] = useState(null);
    const [showDate , setShowDate] = useState(false);


    const onChangeDate = (event, selectedDate) => {
        setSelectedDate(formatDate(selectedDate));
        setShowDate(false);
      };
    
      const showModeDate = () => {
        setShowDate(true); 
      };


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
  

    useEffect(() => {
     let intervalId;
     if (isUploading) {
            intervalId = setInterval(updateDots, 500);
        } else {
            clearInterval(intervalId);
            setDots('');
        }

            return () => clearInterval(intervalId);
    }, [isUploading]);
        
    const updateDots = () => {
        setDots(prevDots => {
         if (prevDots === '...') {
            return '';
         } else {
            return prevDots + '.';
         }
        });
    };


    const handleSpendAmount = async () => {
        setIsUploading(true);
        onClose();
        try {
            setUploadProgress(0);
          
            const employeeDoc = await firestore().collection(`Users/${userId}/EmployesCollection`).doc(employee.id).get();
            
            const currentSpends = employeeDoc.data().spends;
            const spendsToAdd = Number(spends);
            const formattedDate = selectedDate;

            setUploadProgress(0.5);

            let totalSpends = isNaN(spendsToAdd) ? currentSpends : spendsToAdd + currentSpends;
                
            await firestore().collection(`Users/${userId}/EmployesCollection`).doc(employee.id).update({
                spends: totalSpends,
                dateAdded: formattedDate,
                timestamp: new Date(),
            });
    

            await firestore().collection(`Users/${userId}/EmployesCollection`).doc(employee.id).collection('SpendModifications').add({
                spends: spendsToAdd, 
                dateAdded: formattedDate,
                timestamp: new Date(),
            });

            setUploadProgress(1);
            setSpends("");
            setSelectedDate(formatDate(new Date()));
            setIsUploading(false);
            onClose();
            
        } catch (error) {
            console.error('Error updating spends:', error);
        }
    }

    return (
        <>
            {!isUploading &&
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visible}
                    onRequestClose={onClose}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.title}>Dépenses</Text>
                                <TouchableOpacity onPress={showModeDate} style={{padding:4, marginTop:10}} >
                                    <Icon name="calendar-plus-o" color="crimson"  size={30}></Icon>
                                </TouchableOpacity>
                            </View>
                                {showDate && <DateTimePicker testID='dateTimePicker' value={new Date()} onChange={onChangeDate} />}
                            <View>
                                <Text style={styles.textDate}>{selectedDate}</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Entrer montant dépense"
                                placeholderTextColor="black"
                                keyboardType="numeric"
                                value={spends}
                                onChangeText={(text) => {
                                    if (/^-?\d*\.?\d*$/.test(text)) {
                                        setSpends(text);
                                    }
                                }}
                            />
                            <TouchableOpacity style={[styles.btn, styles.AddspendBtn]} onPress={handleSpendAmount}>
                                <Text style={styles.btnText}>Ajouter Dépenses</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.closeButton]} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>}
            {isUploading && (
                <View style={styles.uploadingContainer}>
                    <Text style={{ color: 'crimson', marginBottom: 10, fontSize: 15 }}>Uploading{dots}</Text>
                    <Progress.Pie progress={uploadProgress} size={50} color='crimson' />
                </View>
            )}
        </>
    );
    
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
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
      title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: "center",
        color: "rgb(38 38 38)"
      },
    input: {
        borderWidth: 1,
        borderColor: 'crimson',
        backgroundColor: "#FFF",
        height:70,
        borderRadius: 15,
        color: "black",
        paddingHorizontal: 10,
        marginBottom: 12,
      },
    textDate:{
        fontSize: 20,
        fontWeight: '400',
        textAlign: "center",
        color: "rgb(38 38 38)",
        marginBottom:30,
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
    AddspendBtn: {
        backgroundColor: "rgb(14 165 233)",
        padding:10,
        marginBottom: 15,
        marginTop:15
    },
    uploadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.9)', 
      }
      
});

export default AddSpendModalEmploye;
