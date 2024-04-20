import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

const Header = ({ title, onSearching }) => {

  const [openSearch ,setOpenSearch] = useState(false);
 
  return (
    <View style={styles.container}>
      {openSearch ? (
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={()=>{setOpenSearch(false)}}>
            <Icon name="close" size={30} color="crimson" />
          </TouchableOpacity>
          <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor="gray"
          onChangeText={(text) => {
            onSearching(text); 
          }}
        />
        </View>
      ) : (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={()=>{setOpenSearch(true)}} style={{paddingLeft:6}}>
            <Icon name="search" size={30} color="crimson" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    color: 'crimson',
    fontWeight: '100',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'crimson',
    color: 'black',
  },
});

export default Header;
