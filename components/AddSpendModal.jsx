import React, { useState , useEffect} from 'react';
import { View, Modal, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import * as Progress from 'react-native-progress'
import Icon from "react-native-vector-icons/FontAwesome"
import DatePicker from 'react-native-date-picker';

const AddSpendModal = ({ visible, employee, onClose }) => {
   
    const [spends, setSpends] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [isUploading , setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dots, setDots] = useState('');
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

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

    const formatDate = (date) =>{
        const currentDate = date;
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = currentDate.getFullYear().toString();
            return `${day}/${month}/${year}`;
    }

    const handleCalendarPress = () => {
        setIsDateModalOpen(!isDateModalOpen);
    }
    
    const handleSpendAmount = async () => {
        setIsUploading(true)
        onClose();
        try {
            setUploadProgress(0);
            const employeeDoc = await firestore().collection('itemsCollection').doc(employee.id).get();
            const currentSpends = employeeDoc.data().spends ;
            const spendsToAdd = parseFloat(spends) ;
            let totalSpends ; 

            const currentDate = new Date();
            const formattedDate = formatDate(currentDate);

            setUploadProgress(0.5);
            isNaN(spendsToAdd) ? totalSpends = currentSpends : totalSpends = spendsToAdd + currentSpends ; 
            await firestore().collection('itemsCollection').doc(employee.id).update({
                spends: totalSpends,
                dateAdded: formattedDate,
                timestamp: new Date(),
            });
    
            const logData = {
                employeeId: employee.id,
                operation: `Employee ${employee.description} spends updated`,
                timestamp: new Date(),
            };
            await firestore().collection('changeLogs').add(logData);
            setUploadProgress(1);
            setSpends("");
            setIsUploading(false);
        } catch (error) {
            console.error('Error updating spends:', error);
        }
    }

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
    
    return (
        <>
            {!isUploading &&
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visible}
                    onRequestClose={onClose}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.title}>Add Spends</Text>
                                <TouchableOpacity onPress={handleCalendarPress} >
                                    <Icon name="calendar-plus-o" color="black" size={30}></Icon>
                                </TouchableOpacity>
                            </View>
                            <DateModal />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter spend amount"
                                placeholderTextColor="black"
                                keyboardType="numeric"
                                value={spends}
                                onChangeText={(text) => {
                                    if (/^-?\d*\.?\d*$/.test(text)) {
                                        setSpends(text);
                                    }
                                }}
                            />
                            <TextInput
                                style={styles.input}
                                placeholderTextColor="black"
                                value={formatDate(selectedDate)}
                            />
                            <TouchableOpacity style={[styles.btn, styles.AddspendBtn]} onPress={handleSpendAmount}>
                                <Text style={styles.btnText}>Add Spends</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.closeButton]} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>}
            {isUploading && (
                <View style={styles.uploadingContainer}>
                    <Text style={{ color: 'black', marginBottom: 10, fontSize: 15 }}>Uploading{dots}</Text>
                    <Progress.Pie progress={uploadProgress} size={50} color='black' />
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
        padding: 40,
        borderRadius: 10,
        elevation: 5,
        width: '80%'
    },
    title: {
        fontSize: 25,
        color: "#000",
        fontWeight: 'bold',
        textAlign: 'center',
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
    AddspendBtn: {
        backgroundColor: "#0066cc",
        padding: 10,
        marginBottom: 15,
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

export default AddSpendModal;
