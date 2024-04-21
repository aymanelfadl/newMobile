import { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Image, Modal } from "react-native";
import Header from "../components/Header";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import firestore from '@react-native-firebase/firestore';
import AddSpendModalDepenses from "../components/AddSpendModalDepenses";
import Sound from "react-native-sound";

const DepensesScreen = () => {
  const [items, setItems] = useState([]);
  const [audioItems , setAudioItems] = useState([]);
  const [imageItems , setImageItems] = useState([]);
  const [isModalSpendsOpen, setIsModalSpendsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore().collection('DepensesCollection').onSnapshot(snapshot => {
      const fetchedItems = [];
      const audioItems = []; 
      const imageItems = [];
      snapshot.forEach(documentSnapshot => {
        const data = documentSnapshot.data();
        const item = {
          id: documentSnapshot.id,
          ...data,
          timestamp: data.timestamp.toDate(),
          isAudioPlaying: false,
        };
        fetchedItems.push(item);
        if (data.thumbnailType === 'audio') {
          audioItems.push(item);
        } else {
          imageItems.push(item);
        }
      });
      fetchedItems.sort((a, b) => b.timestamp - a.timestamp);
      setItems(fetchedItems);

    }, error => {
      console.error('Error fetching data:', error);
    });
    
    return () => unsubscribe();
  },[]);    

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const renderItem = ({ item }) => {
    if (item.thumbnailType === 'audio') {
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => openAudioPlayer(item.thumbnail)}>
          <Icon name="play-circle" size={50} color="black" />
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.spends}><Text style={{ fontWeight: "bold" }}>-</Text>{item.spends} MAD</Text>
          <Text style={styles.dateAdded}>{item.dateAdded}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => openImageModal(item.thumbnail)}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.spends}><Text style={{ fontWeight: "bold" }}>-</Text>{item.spends} MAD</Text>
          <Text style={styles.dateAdded}>{item.dateAdded}</Text>
        </TouchableOpacity>
      );
    }
  };
  
  const openAudioPlayer = (audioUri) => {
    const sound = new Sound(audioUri, null, (error) => {
      if (error) {
        console.log('Error loading sound:', error);
      } else {
        console.log('Loaded sound:', sound);
        sound.play((success) => {
          if (success) {
            console.log('Sound played successfully');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
        });
      }
    });
  };
  

  return (
    <View style={styles.container}>
      <Header title={"Dépenses"} />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={<Text style={{ color: "black", justifyContent: "center", alignSelf: "center", color: "gray" }}>Aucun dépenses trouvé</Text>}
      />
      <TouchableOpacity style={styles.button} onPress={() => setIsModalSpendsOpen(true)}>
        <Text style={styles.buttonText}><Icon name="plus" size={40} color="white" /></Text>
      </TouchableOpacity>
      <AddSpendModalDepenses visible={isModalSpendsOpen} onClose={() => setIsModalSpendsOpen(false)} />
      
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
})

export default DepensesScreen;
