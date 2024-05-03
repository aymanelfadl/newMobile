import React, { useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TouchableNativeFeedback, Modal } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AddSpendModal from "../components/AddSpendModalEmploye";
import EmployeeModal from "../components/EmployeeModal";
import Header from "../components/Header";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';



const EmployeScreen = () => {
    const [showDelete, setShowDelete] = useState(false);
    const [selectedEmploye, setSelectedEmploye] = useState(null);
    const [isModalSpoendsOpen, setIsModalSpoendsOpen] = useState(false);
    const [isModalEmployeOpen, setIsModalEmployeOpen ] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDeleteModal,setOpenDeleteModal] = useState(false);
    const [itemsData,setItemsData] = useState(null); 
    const [userId, setUserId] = useState(null);

 
    useEffect(() => {
      if(userId){
        const unsubscribe = firestore().collection(`Users/${userId}/EmployesCollection`).onSnapshot(querySnapshot => {
          const employees = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              dateAdded: data.dateAdded,
              description: data.description,
              spends: data.spends,
              thumbnail: data.thumbnail,
              timestamp: data.timestamp.toDate(), 
            };
          });
      
          employees.sort((a, b) => b.timestamp - a.timestamp);
          setItemsData(employees);
        });
      
        return () => unsubscribe();
      }
    }, [userId]);
    
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


    const handleDelete = async (item) => {
      try {
        const employeeRef = firestore().collection(`Users/${userId}/EmployesCollection`).doc(item.id);
    
        const spendModsSnapshot = await employeeRef.collection('SpendModifications').get();
        const batch = firestore().batch();
        spendModsSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
    
        await employeeRef.delete();
    
        await firestore().collection('changeLogs').add({
          Id: item.id,
          operation: `Employé a été supprimé, ${item.description}`,
          type: "Suppression",
          timestamp: new Date(),
        });
    
        console.log("Item deleted successfully");
        setOpenDeleteModal(false);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    };
    
    
    
    const handleSearch = (query) =>{
      setSearchQuery(query);
    }
    
    const filteredItems = () => {
      if (!itemsData) {
        return []; 
      }
    
      return itemsData.filter(item =>
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.spends.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dateAdded.toLowerCase().includes(searchQuery.toLowerCase())
      );
    };
    
    const openDelete = (item) => {
      setSelectedEmploye(item); 
      setOpenDeleteModal(true); 
    };
    
    const handleCloseAll = () =>{
      setShowDelete(false);
    }

    const handleEmployePress = (item) =>{
      setSelectedEmploye(item);
      setIsModalSpoendsOpen(true);
    }
  
    const renderItem = ({ item }) => (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handleEmployePress(item)} onLongPress={() => openDelete(item)}>
        <TouchableOpacity style={showDelete ? styles.deleteIconContainer : styles.hideDeleteIconContainer}>
          <Icon name="delete-circle-outline" size={20} style={{ opacity: 1, color: "red" }} />
        </TouchableOpacity>  
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail}  />
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.spends}><Text style={{fontWeight:"bold"}}>-</Text>{item.spends} MAD</Text>
        <Text style={styles.dateAdded}>{item.dateAdded}</Text>
      </TouchableOpacity>
    );

    return (
      <TouchableNativeFeedback onPress={handleCloseAll}>
        <View style={styles.container}>
            <Header title={"Employés"} onSearching={handleSearch} />
            <FlatList
                data={filteredItems()}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                ListEmptyComponent={<Text style={{color:"black", justifyContent:"center" , alignSelf:"center", color:"gray"}}>Aucun employé trouvé</Text>}
            /> 
            <TouchableOpacity style={styles.button} onPress={()=>{setIsModalEmployeOpen(true)}}>
                <Text style={styles.buttonText}><Icon name="plus" size={40} color="white" /></Text>
            </TouchableOpacity>
            <AddSpendModal visible={isModalSpoendsOpen} employee={selectedEmploye} onClose={() => setIsModalSpoendsOpen(false)} />
            <EmployeeModal  visible={isModalEmployeOpen} onClose={()=>{setIsModalEmployeOpen(false)}}/>
            <Modal
              visible={openDeleteModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setOpenDeleteModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>Confirmer la suppression</Text>
                  <View style={styles.modalButtonsContainer}>
                    <TouchableOpacity style={styles.modalButton} onPress={() => handleDelete(selectedEmploye)}>
                      <Text style={styles.modalButtonText}>Confirmer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton,{backgroundColor:"crimson"}]} onPress={() => setOpenDeleteModal(false)}>
                      <Text style={styles.modalButtonText}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                  </View>
                </View>
              </Modal>

        </View>
      </TouchableNativeFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      margin:0,
      backgroundColor: 'rgb(249 250 251)',
    },
    itemContainer: {
      flex: 1,
      margin: 8,
      borderRadius: 30,
      borderColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: 'white',
      shadowColor: 'gray',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 6,
      marginBottom: 10,
    },
    deleteIconContainer: {
      position: 'absolute',
      backgroundColor: "#FFF",
      borderRadius: 100,
      padding: 5,
      top: 5,
      right: 5,
      zIndex: 100,
    },
    hideDeleteIconContainer: {
      display: "none",
    },
    thumbnail: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
      marginBottom: 10,
      zIndex: 100,
    },
    description: {
      fontSize: 16,
      fontWeight: 'bold',
      color: "#000",
      marginBottom: 5,
    },
    spends: {
      color: "#000",
      fontSize: 14,
      marginBottom: 2,
    },
    dateAdded: {
      color: "#000",
      fontSize: 12,
      color: '#666',
    },
    columnWrapper: {
      justifyContent: 'space-between',
    },
    addButton: {
      alignItems: 'center',
      marginBottom: 20,
    },
    optionsContainer: {
      position: 'absolute',
      bottom: 90,
      right: 21,
    },
    option: {
      backgroundColor: '#262626',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 25,
      marginVertical: 8
    },
    optionText: {
      color: '#fff',
      fontSize: 90,
    },
    button: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      backgroundColor: 'crimson',
      width: 60,
      height: 60,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      elevation : 5
    },
    buttonText: {
      color: '#fff',
      fontSize: 50,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      color: "black",
      fontWeight: "600",
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    modalButton: {
      backgroundColor: "#2196F3",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      margin: 10,
    },
    modalButtonText: {
      color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default EmployeScreen;
