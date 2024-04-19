import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

const TotalModal = ({ Title, ImageSource, Total }) => {
    
  return (
    <View style={styles.card}>
        <View  style={styles.imageContainer}>
            <Image source={{uri : ImageSource }} style={styles.image} />
        </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{Title}</Text>
        <Text style={styles.total}>{Total} MAD</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%", 
    height: "100%", 
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "black",
    marginBottom: 8,
  },
  total: {
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'center',
    color: "black"
  },
  imageContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:50,
    height:"30%",
    width:"30%",
},
image: {
    width: "100%", // Adjust width as needed
    height: "50%", // Adjust height as needed
    marginRight: 10,
    borderRadius: 100,
  },
});

export default TotalModal;
