import React, { useState, useEffect } from 'react';
import { PermissionsAndroid, View, Modal, StyleSheet, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import AudioRecord from 'react-native-audio-record'; 
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Sound from 'react-native-sound';
import * as Progress from 'react-native-progress'

const AddSpendModalDepenses = ({ visible, onClose }) => {
  const [description, setDescription] = useState('');
  const [spends, setSpends] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadType, setUploadType] = useState(null); 
  const [audioFile, setAudioFile] = useState(null);
  const [isAudioPlaying , setIsAudioPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [isUploading , setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dots, setDots] = useState('');



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
  
  useEffect(() => {
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
    const audioFile = 'audio.wav'; 
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
  

  const playAudio = () =>{
    setIsAudioPlaying(true);
    sound.play((success) => {
      if (success) {
        setIsAudioPlaying(false);
      } else {
        console.log('Playback failed due to audio decoding errors');
      }
    });
  }
  
  const stopPlayingAudio = () => {
    setIsAudioPlaying(false);
    sound.stop();
  }
  
  const uploadImage = async () => {
  
    try {
      let imageUrl;
  
      if (!thumbnail) {
        imageUrl = 'https://firebasestorage.googleapis.com/v0/b/project-cb3df.appspot.com/o/generous.png?alt=media&token=5b79881e-cea2-4631-aa0e-5ae08f33a6b7';
      } else {
        const imageName = 'employee_' + Date.now();
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
    const defaultName = `Article`;
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
      
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear().toString();
  
      const formattedDate = `${day}/${month}/${year}`;
      
      setUploadProgress(0.50);

      const articleRef = await firestore().collection('itemsCollection').add({
        type: "article",
        description: finalDescription,
        thumbnail: mediaUrl,
        thumbnailType: uploadType === null ? "image" : uploadType,
        spends: spends,
        dateAdded: formattedDate,
        timestamp: currentDate,
      });
  
      setUploadProgress(0.75);
  
      await firestore().collection('changeLogs').add({
        itemId: articleRef.id, 
        timestamp: new Date(),
        operation: `A new article, "${finalDescription}" has been added`
      });
  
      setUploadProgress(1);
  
      onClose();
    } catch (error) {
      console.error('Error adding article:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <>{!isUploading &&
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>New Article</Text>
          {audioFile && (
            <View>
              {isAudioPlaying ? (
                <TouchableOpacity onPress={stopPlayingAudio} style={styles.audioIconContainer}>
                  <Text>
                    <Icon name="stop" size={60} color="black" />
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={playAudio} style={styles.audioIconContainer}>
                  <Text>
                    <Icon name="play" size={60} color="black" />
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {thumbnail && <Image source={thumbnail} style={styles.thumbnail} />}
          {!isRecording && !audioFile && (
            <>
              <TouchableOpacity style={styles.btn} onPress={handleLaunchCamera}>
                <Text style={styles.btnText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={handleLaunchImageLibrary}>
                <Text style={styles.btnText}>Choose from Library</Text>
              </TouchableOpacity>
            </>
          )}
          {!thumbnail && (
            <TouchableOpacity style={styles.btn} onPress={startRecording} disabled={isRecording}>
              <Text style={styles.btnText}>{isRecording ? 'Recording...' : 'Start Recording'}</Text>
            </TouchableOpacity>
          )}
          {isRecording && (
            <TouchableOpacity style={[styles.btn, styles.closeRecordingBtn]} onPress={stopRecording}>
              <Text style={styles.closeButtonText}>Stop Recording</Text>
            </TouchableOpacity>
          )}
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="black"
            multiline={true}
            numberOfLines={2}
            value={description}
            onChangeText={setDescription}
          />
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
          <TouchableOpacity style={[styles.btn, styles.addArticleBtn]} onPress={handleAddArticle}>
            <Text style={styles.btnText}>Add Article</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.closeButton]} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>}

      {isUploading && (
        <View style={styles.uploadingContainer}>
          <Text style={{ color: 'black', marginBottom:10 , fontSize:15 }}>Uploading{dots}</Text>
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
  modalContent: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 10,
    elevation: 5,
    width: '80%'
  },
  audioIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    color: "#000",
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    color: "#000",
    borderWidth: 1,
    borderColor: '#262626',
    backgroundColor: '#FFF',
    borderRadius: 15,
    color: '#000',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: '#262626',
    padding: 10,
    borderRadius: 100,
    marginBottom: 15,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ff0000',
    marginBottom: -10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  addArticleBtn: {
    backgroundColor: "#0066cc", 
    padding:10,
    marginBottom: 15,
  },
  closeRecordingBtn:{
    backgroundColor: '#ff0000',
    marginBottom: 10,
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

export default AddSpendModalDepenses;
