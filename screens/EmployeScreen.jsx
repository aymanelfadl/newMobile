import React, { useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AddSpendModal from "../components/AddSpendModal";
import EmployeeModal from "../components/EmployeeModal";
import Header from "../components/Header";


const EmployeScreen = () => {
    const [showDelete, setShowDelete] = useState(false);
    const [selectedEmploye, setSelectedEmploye] = useState(null);
    const [isModalSpoendsOpen, setIsModalSpoendsOpen] = useState(false);
    const [isModalEmployeOpen, setIsModalEmployeOpen ] = useState(false);

    const itemsData = [
        {
          id: 1,
          thumbnail: require("../assets/download.jpeg"),
          description: 'Item 1 description',
          spends: '10',
          dateAdded: '2024-04-19',
        },
        {
          id: 2,
          thumbnail: require("../assets/download.jpeg"),
          description: 'Item 2 description',
          spends: '20',
          dateAdded: '2024-04-20',
        },
        {
          id: 3,
          thumbnail: require("../assets/download.jpeg"),
          description: 'Item 3 description',
          spends: '30',
          dateAdded: '2024-04-21',
        },
    ];

    const handleEmployePress = (item) => {
        setIsModalSpoendsOpen(true);
        setSelectedEmploye(item);
    }

    const openDelete = () => {
        setShowDelete(true);
    };

    const handleDelete = () => {
        // handle delete logic
    };

    const handleCloseOptions = () => {
        setShowDelete(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={handleEmployePress} onLongPress={openDelete}>
          <TouchableOpacity style={showDelete ? styles.deleteIconContainer : styles.hideDeleteIconContainer} onPress={handleDelete}>
            <Icon name="delete-circle-outline" size={20} style={{ opacity: 1, color: "red" }} />
          </TouchableOpacity>  
          <Image source={item.thumbnail} style={styles.thumbnail}  />
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.spends}><Text style={{fontWeight:"bold"}}>-</Text>{item.spends} MAD</Text>
          <Text style={styles.dateAdded}>{item.dateAdded}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header title={"Employe"} />
            <FlatList
                data={itemsData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}><Icon name="plus" size={40} color="white" /></Text>
            </TouchableOpacity>
            <AddSpendModal visible={isModalSpoendsOpen} employee={selectedEmploye} onClose={() => setIsModalSpoendsOpen(false)} />
            <EmployeeModal  visible={isModalEmployeOpen} onClose={()=>{setIsModalEmployeOpen(false)}}/>
        </View>
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
      margin: 5,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: '#ffff',
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
});

export default EmployeScreen;
