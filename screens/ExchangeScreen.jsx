import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import firestore from "@react-native-firebase/firestore";

const ExchangeScreen = () => {
    const [name, setName] = useState('');
    const [spend, setSpend] = useState('');
    const [items, setItems] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [suggestions, setSuggestions] = useState(["Azize ", "Abdletife"]);

    useEffect(() => {
        const unsubscribe = firestore().collection("ExchangeCollection")
            .onSnapshot((querySnapshot) => {
                const itemsArray = [];
                querySnapshot.forEach((doc) => {
                    itemsArray.push({
                        id: doc.id,
                        name: doc.data().name,
                        spend: doc.data().spend,
                        date: doc.data().date.toDate(),
                    });
                });
                setItems(itemsArray);
            });

        return () => unsubscribe();
    }, []);

    const handleAdd = async () => {
        const newItem = {
            name: name,
            spend: spend,
            date: new Date(),
        };

        try {
            await firestore().collection("ExchangeCollection").add(newItem);
            setSpend('');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const handleDelete = (index) => {
        setDeleteIndex(index);
        setModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await firestore().collection("ExchangeCollection").doc(items[deleteIndex].id).delete();

            const updatedItems = [...items];
            updatedItems.splice(deleteIndex, 1);
            setItems(updatedItems);
            setDeleteIndex(null);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const renderItems = () => {
        return items.map((item, index) => (
            <TouchableOpacity 
                key={index} 
                onPress={() => setSelectedItem(item.name)} 
                onLongPress={() => handleDelete(index)} 
            >
                <View style={[styles.itemContainer, selectedItem === item.name && { backgroundColor: "crimson" }]}>
                    <View style={[styles.iconContainer]}>
                        <Icon name="plus" size={24} color={selectedItem === item.name ? "white" : "black"} />
                    </View>
                    <View style={styles.itemTextContainer}>
                        <Text style={[{ fontSize: 16, lineHeight: 24 }, selectedItem === item.name && { color: "white" },selectedItem === item.name ? { color: "white" } : { color: "black" }]}>
                            {item.name} m'a pris {item.spend} MAD le {formatDate(item.date)}.
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        ));
    };
    

    return (
        <View style={styles.mainContainer}>
            <View style={styles.firstContainer}>
                <FlatList
                    data={suggestions}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                            setSpend('');
                            setSelectedItem(item);
                            setName(item);
                        }}>
                            <Text style={{
                                backgroundColor: selectedItem === item ? "crimson" : "white",
                                color: selectedItem === item ? "white" : "black",
                                alignSelf: "center",
                                marginVertical: 4,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 10,
                            }}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                />

                <TextInput
                    onChangeText={(data) => setSpend(data)}
                    value={spend}
                    placeholder="Prix"
                    placeholderTextColor="black"
                    style={styles.input}
                    keyboardType="numeric"
                />
                <View style={styles.iconContainer}>
                    <Icon name="arrow-right" size={24} color="black" />
                </View>
                <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: "crimson", height: 1, width: "100%" }}></View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.itemsContainer}>
                    {renderItems()}
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Confirmer la suppression ?</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <TouchableOpacity
                                style={[styles.openButton, { backgroundColor: "#2196F3", }]}
                                onPress={() => {
                                    handleConfirmDelete();
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>Confirmer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.openButton, { backgroundColor: "crimson" }]}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
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
    mainContainer: {
        flex: 1,
        backgroundColor: 'rgb(249, 250, 251)',
        padding: 20,
    },
    firstContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 0.5,
        padding: 18,
        borderRadius: 30,
        borderColor: "crimson",
        paddingBottom: 20, 
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'crimson',
        backgroundColor: "#FFF",
        height: 50,
        borderRadius: 15,
        paddingHorizontal: 10,
        marginRight: 10,
        color: "black"
    },
    addButton: {
        backgroundColor: 'crimson',
        borderRadius: 100,
        padding: 10,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginHorizontal: 8
    },
    itemsContainer: {
        marginTop: 20,
        marginBottom: 100
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        padding: 20,
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
    iconContainer: {
        marginRight: 10,
        color: "black",
    },
    itemTextContainer: {
        flex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
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
    scrollView: {
        flex: 1, 
    },
});

export default ExchangeScreen;
