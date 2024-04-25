import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";

const ExchangeScreen = () => {
    const [name, setName] = useState('');
    const [spend, setSpend] = useState('');
    const [items, setItems] = useState([]);

    const handleAdd = () => {
        const newItem = {
            name: name,
            spend: spend,
            date: new Date().toLocaleString()
        };

        setItems([newItem, ...items]);
        
        setName('');
        setSpend('');
    };

    const renderItems = () => {
        return items.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
                <View style={styles.iconContainer}>
                    <Icon name="plus" size={24} color="black" />
                </View>
                <View style={styles.itemTextContainer}>
                    <Text style={{color:"black", lineHeight:24}}>{item.name} a pris {item.spend} MAD le {item.date}</Text>
                </View>
            </View>
        ));
    };
    
    return (
        <View style={styles.mainContainer}>
            <View style={styles.firstContainer}>
                <TextInput
                    onChangeText={(data) => setName(data)}
                    value={name}
                    placeholder="Nom"
                    placeholderTextColor="black"
                    style={styles.input}
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
                    <Icon name="arrow-right"  size={24} color="black"/>
                </View>
                <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.itemsContainer}>
                {renderItems()}
            </View>
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
        borderWidth:1,
        padding:18,
        borderRadius:100,
        borderColor:"crimson"
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
        color:"black"
    },
    addButton: {
        backgroundColor: 'crimson',
        borderRadius:100,
        padding:10,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    itemsContainer: {
        marginTop: 20,
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
        color:"black"
    },
    itemTextContainer: {
        flex: 1,
    },
});

export default ExchangeScreen;
