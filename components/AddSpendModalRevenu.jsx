import React, { useState, useEffect } from 'react';
import { PermissionsAndroid, View, Modal, StyleSheet, Text, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AudioRecord from 'react-native-audio-record';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Sound from 'react-native-sound';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddSpendModalRevenu = ({ visible, onClose }) => {
  const [description, setDescription] = useState('');
  const [spends, setSpends] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dots, setDots] = useState('');
  const [suggestionss , setSuggestions] = useState([]);
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
  

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      if (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Camera, storage, and audio recording permissions granted');
      } else {
        console.log('One or more permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchSuggestions = () => {
    const unsubscribe = firestore().collection(`Users/${userId}/RevenusCollection`).onSnapshot(snapshot => {
      const fetchedSuggestions = snapshot.docs.map(doc => doc.data().description);
      setSuggestions(fetchedSuggestions);
    });
  
    return unsubscribe;
  };
  


  useEffect(() => {
    fetchSuggestions();
    requestPermissions();

  }, []);

  const updateDots = () => {
    setDots(prevDots => {
      if (prevDots === '...') {
        return '';
      } else {
        return prevDots + '.';
      }
    });
  };

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

  const formatDate = (date) =>{
    const currentDate = date;
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear().toString();
        return `${year}-${month}-${day}`
}

  const handleLaunchCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error) {
        setThumbnail({ uri: response.assets[0].uri });
        setUploadType('image');
      }
    });
  };

  const handleLaunchImageLibrary = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error) {
        setThumbnail({ uri: response.assets[0].uri });
        setUploadType('image');
      }
    });
  };

  const startRecording = async () => {
    const audioFile = '../assets/audio.wav';
    try {
      AudioRecord.init({
        sampleRate: 44100,
        channels: 2,
        bitsPerSample: 16,
        audioSource: 6,
      });

      AudioRecord.start();

      setIsRecording(true);
      setUploadType('audio');
      console.log('Audio recording started');
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const audioFile = await AudioRecord.stop();
      console.log('Audio recording stopped:', audioFile);
      setAudioFile(audioFile);
      setIsRecording(false);

      const sound = new Sound(audioFile, '', (error) => {
        if (error) {
          console.log('Error loading sound:', error);
        }
      });
      setSound(sound);
    } catch (error) {
      console.error('Error stopping audio recording:', error);
    }
  };

  const playAudio = () => {
    setIsAudioPlaying(true);
    sound.play((success) => {
      if (success) {
        setIsAudioPlaying(false);
      } else {
        console.log('Playback failed due to audio decoding errors');
      }
    });
  };

  const stopPlayingAudio = () => {
    setIsAudioPlaying(false);
    sound.stop();
  };

  const uploadImage = async () => {
    try {
      let imageUrl;

      if (!thumbnail) {
        imageUrl = "https://firebasestorage.googleapis.com/v0/b/expense-manager-376bc.appspot.com/o/cost.png?alt=media&token=2d9db609-59ce-4237-8e94-633bae1e33aa";
    } else {
        const imageName = 'revenu_' + Date.now();
        const reference = storage().ref(imageName);

        await reference.putFile(thumbnail.uri);
        imageUrl = await reference.getDownloadURL();
      }

      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const uploadAudio = async () => {
    try {
      if (!audioFile) {
        return null;
      }

      const audioName = 'audio_' + Date.now() + '.wav';
      const reference = storage().ref().child(audioName);

      await reference.putFile(audioFile);

      const audioUrl = await reference.getDownloadURL();

      return audioUrl;
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };


  
  const handleAddArticle = async () => {
    setIsUploading(true);
    const defaultName = "Revenu " + formatDate(new Date());
    let finalDescription = description.trim() === '' ? defaultName : description;

    try {

      setUploadProgress(0);

      let mediaUrl;
      if (uploadType === 'image' || uploadType === null) {
        mediaUrl = await uploadImage();

        setUploadProgress(0.25);
      } else if (uploadType === 'audio') {
        mediaUrl = await uploadAudio();
        setUploadProgress(0.25);
      }

      
      setUploadProgress(0.50);

      const depenseRef = await firestore().collection(`Users/${userId}/RevenusCollection`).add({
        description: finalDescription,
        thumbnail: mediaUrl,
        thumbnailType: uploadType === null ? "image" : uploadType,
        spends: spends === '' ? 0 : spends,
        dateAdded: formatDate(new Date()),
        timestamp: new Date(),
      });

      setUploadProgress(0.75);

      await firestore().collection('changeLogs').add({
        Id: depenseRef.id,
        operation: `Un nouveau revenu, ${finalDescription} de ${spends} MAD a été ajouté`,
        type: "Revenu",
        timestamp: new Date(),
      });

      setUploadProgress(1);
      setAudioFile(null),
      setIsAudioPlaying(null);
      setThumbnail(null);
      setDescription("");
      setSpends("");

      onClose();
    } catch (error) {
      console.error('Error adding article:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredSuggestions = [...new Set(suggestionss.filter(item =>
    new RegExp('^' + description.toLowerCase(), 'g').test(item.toLowerCase())
  ))];
  
  

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity onPress={() => setDescription(item)}>
      <Text style={styles.suggestionItem}>{item}</Text>
    </TouchableOpacity>
  );
  

  const renderSuggestions = () => {
     return (
    <View style={styles.suggestionsContainer}>
      {description.length > 0 && (
        <FlatList
          data={filteredSuggestions}
          renderItem={renderSuggestionItem}
          keyExtractor={(item, index) => index.toString()}
          style={{height:"20%", marginBottom:10 ,}}
        />
      )}
    </View>
  );
  };


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
              <Text style={styles.title}>Nouveau Revenu</Text>
              {audioFile && (
                <View>
                  {isAudioPlaying ? (
                    <TouchableOpacity onPress={stopPlayingAudio} style={styles.audioIconContainer}>
                      <Icon name="stop" size={60} color="black" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={playAudio} style={styles.audioIconContainer}>
                      <Icon name="play" size={60} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {thumbnail && <Image source={thumbnail} style={styles.thumbnail} />}
              <View style={styles.iconContainer}>
                {!isRecording && !audioFile && (
                  <>
                    <View style={styles.iconWrapper}>
                      <TouchableOpacity onPress={handleLaunchCamera}>
                        <View style={styles.icon}>
                          <Icon name="camera" size={30} color="black" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.iconWrapper}>
                      <TouchableOpacity onPress={handleLaunchImageLibrary}>
                        <View style={styles.icon}>
                          <Icon name="folder-open" color="black" size={30} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {!thumbnail && !isAudioPlaying && !isRecording && (
                  <View style={styles.iconWrapper}>
                    <TouchableOpacity onPress={startRecording} disabled={isRecording}>
                      <View style={styles.icon}>
                        <Icon name="microphone" size={30} color="black" />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                {isRecording && (
                  <View style={styles.iconWrapper}>
                    <TouchableOpacity onPress={stopRecording}>
                      <View style={styles.icon}>
                        <Icon name="microphone-slash" size={30} color="red" />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Entrer description"
                placeholderTextColor="black"
                multiline={true}
                numberOfLines={2}
                value={description}
                onChangeText={setDescription}
              />
               {filteredSuggestions.length > 0 && (
                    renderSuggestions()
                )}
              <TextInput
                style={styles.input}
                placeholder="Entrer montant revenu"
                placeholderTextColor="black"
                keyboardType="numeric"
                value={spends}
                onChangeText={(text) => {
                  if (/^-?\d*\.?\d*$/.test(text)) {
                    setSpends(text);
                  }
                }}
              />
              <TouchableOpacity style={styles.btn} onPress={handleAddArticle}>
                <Text style={styles.btnText}>Ajouter Revenu</Text>
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
  modalContent: {
    backgroundColor: "#fff",
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
    marginBottom: 15,
    fontWeight: '600',
    textAlign: "center",
    color: "rgb(38 38 38)"
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 25,
  },
  iconWrapper: {
    marginHorizontal: 10,
    borderRadius: 40,
    borderWidth: 0.1, 
    borderColor: "crimson",
    padding: 10,
    width:"30%"
  },
  icon: {
    alignItems: 'center',
  },
  audioIconContainer: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'crimson',
    backgroundColor: "#FFF",
    height:60,
    borderRadius: 15,
    color: "black",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "rgb(14 165 233)",
    padding:13,
    marginTop:15,
    borderRadius: 100,
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
  uploadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.9)', 
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  suggestionItem: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical:2,
    borderColor: '#dcdcdc',
    fontSize: 15,
    color: 'black',
    
  },
  
  
});

export default AddSpendModalRevenu;
