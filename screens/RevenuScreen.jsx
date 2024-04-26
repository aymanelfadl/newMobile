import { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Image, Modal } from "react-native";
import Header from "../components/Header";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import firestore from '@react-native-firebase/firestore';
import Sound from "react-native-sound";
import AddSpendModalRevenu from "../components/AddSpendModalRevenu";

const RevenuScreen = () => {
  const [items, setItems] = useState([]);
  const [isModalSpendsOpen, setIsModalSpendsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [searchQuery ,setSearchQuery] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);


  useEffect(() => {
    const unsubscribe = firestore().collection('RevenusCollection').onSnapshot(snapshot => {
      const fetchedItems = [];
      snapshot.forEach(documentSnapshot => {
        const data = documentSnapshot.data();
        const item = {
          id: documentSnapshot.id,
          ...data,
          timestamp: data.timestamp.toDate(),
          isAudioPlaying: false,
        };
        fetchedItems.push(item);
      });
      fetchedItems.sort((a, b) => b.timestamp - a.timestamp);
      setItems(fetchedItems);

    }, error => {
      console.error('Error fetching data:', error);
    });
    
    return () => unsubscribe();
  },[]);    


  const handleSearch = (query) =>{
    setSearchQuery(query);
  }

  const filteredItems = () => {
    if (!items) {
      return []; 
    }
  
    if (!searchQuery) {
      return items; 
    }
  
    return items.filter(item =>
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.spends.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dateAdded.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const renderItem = ({ item }) => {
    if (item.thumbnailType === 'audio') {
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={()=>handleAudioPress(item)} onLongPress={()=>openDeleteModal(item.id)}>
          <Text style={{marginVertical:8}}>
            <Icon name={isPlaying ? "pause-circle" : "play-circle"} size={50} color="black" />
          </Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.spends}><Text style={{ fontWeight: "bold" }}>-</Text>{item.spends} MAD</Text>
          <Text style={styles.dateAdded}>{item.dateAdded}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => openImageModal(item.thumbnail)} onLongPress={()=>openDeleteModal(item.id)}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.spends}><Text style={{ fontWeight: "bold" }}>+</Text>{item.spends} MAD</Text>
          <Text style={styles.dateAdded}>{item.dateAdded}</Text>
        </TouchableOpacity>
      );
    }
  };
  

  const handleAudioPress = (item) => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause(); 
      } else {
        currentAudio.play(); 
      }
      setIsPlaying(!isPlaying); 
    } else {
      openAudioPlayer(item.thumbnail);
      setIsPlaying(true);
    }
  };
  
  

  const openAudioPlayer = (audioUri) => {
    const sound = new Sound(audioUri, '', (error) => {
      setCurrentAudio(sound);
      if (error) {
        console.log('Error loading sound:', error);
      } else {
        sound.play((success) => {
          if (success) {
            setIsPlaying(false);
            console.log('Sound played successfully');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
        });
      }
    });
  };
  
  const openDeleteModal = (itemId) => {
    setSelectedItemId(itemId);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItemId) {
      firestore().collection('RevenusCollection').doc(selectedItemId).delete()
      .then(() => {
        console.log("Item deleted successfully");
        setDeleteModalVisible(false);
      })
      .catch((error) => {
        console.error("Error removing item: ", error);
        setDeleteModalVisible(false);
      });
    }
  };

  


  return (
    <View style={styles.container}>
      <Header title={"Revenu"} onSearching={handleSearch}/>
      <FlatList
        data={filteredItems()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={<Text style={{ color: "black", justifyContent: "center", alignSelf: "center", color: "gray" }}>Aucun revenu trouvé</Text>}
      />
      <TouchableOpacity style={styles.button} onPress={() => setIsModalSpendsOpen(true)}>
        <Text style={styles.buttonText}><Icon name="plus" size={40} color="white" /></Text>
      </TouchableOpacity>
      <AddSpendModalRevenu visible={isModalSpendsOpen} onClose={() => setIsModalSpendsOpen(false)} />
      
      {/* Image Viewer Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
        </View>
      </Modal>

       {/* Delete Modal */}
       <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
            setDeleteModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirmer la suppression ?</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <TouchableOpacity
                  style={[styles.openButton, { backgroundColor: "#2196F3", }]}
                  onPress={handleConfirmDelete}
              >
                  <Text style={styles.textStyle}>Confirmer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.openButton, { backgroundColor: "crimson" }]}
                  onPress={() => {
                      setDeleteModalVisible(false);
                  }}
              >
                  <Text style={styles.textStyle}>Annuler</Text>
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
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 10,
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
    elevation: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "black",
    fontWeight: "600",
  },
})

export default RevenuScreen;
