import { useState } from "react";
import { StyleSheet, View ,FlatList, Text,TouchableOpacity,Image } from "react-native";
import Header from "../components/Header";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import logoTest from "../assets/depenser-de.png";
import AddSpendMofalDepenses from "../components/AddSpendModalDepenses";

const DepensesScreen = () =>{
  // test Data
  const testData = [
    {
      id: 1,
      thumbnail:logoTest ,
      description: 'Item 1',
      spends: 50,
      dateAdded: '2024-04-20',
    },
    {
      id: 2,
      thumbnail: logoTest,
      description: 'Item 2',
      spends: 100,
      dateAdded: '2024-04-21',
    },
    {
      id: 3,
      thumbnail: logoTest,
      description: 'Item 3',
      spends: 75,
      dateAdded: '2024-04-22',
    },
  ];
  
  const [showDelete, setShowDelete] = useState(false);
  const [isModalSpendsOpen, setIsModalSpendsOpen] = useState(false);
  const [isModaldepenseOpen, setIsModalDepenseOpen ] = useState(false);
  const openDelete = () => {
    setShowDelete(true);
  };
  

  const handleDelete = async (item) => {
    // TODO
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onLongPress={openDelete} >
      <TouchableOpacity style={showDelete ? styles.deleteIconContainer : styles.hideDeleteIconContainer} onPress={() => handleDelete(item)}>
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
            <Header title={"Dépenses"} ></Header>
            <FlatList
                data={testData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                ListEmptyComponent={<Text style={{color:"black", justifyContent:"center" , alignSelf:"center", color:"gray"}}>Aucun dépenses trouvé</Text>}
            /> 
            <TouchableOpacity style={styles.button} onPress={()=>setIsModalSpendsOpen(true)}>
                <Text style={styles.buttonText}><Icon name="plus" size={40} color="white" /></Text>
            </TouchableOpacity>
            <AddSpendMofalDepenses visible={isModalSpendsOpen} onClose={()=>setIsModalSpendsOpen(false)}></AddSpendMofalDepenses>
        </View>
      );
}


const styles = StyleSheet.create({
  container:{
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
})
export default DepensesScreen;