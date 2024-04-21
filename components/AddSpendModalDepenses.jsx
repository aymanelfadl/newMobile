import React, { useState, useEffect } from 'react';
import { PermissionsAndroid, View, Modal, StyleSheet, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AudioRecord from 'react-native-audio-record';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Sound from 'react-native-sound';
import * as Progress from 'react-native-progress';

const AddSpendModalDepenses = ({ visible, onClose }) => {
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
              <Text style={styles.title}>New Article</Text>
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
              <TouchableOpacity style={styles.btn} onPress={handleAddArticle}>
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
    padding:10,
    marginBottom: 15,
    marginTop:15,
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
});

export default AddSpendModalDepenses;
