import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";

const NotificationsScreen = () => {
    const [messages, setMessages] = useState([]);

    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            throw new Error('Invalid date provided.');
        }
    
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        };
    
        return date.toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        const unsubscribe = firestore().collection("changeLogs").onSnapshot((snapshot) => {
            const messagesData = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                const message = {
                    id: doc.id,
                    operation: data.operation,
                    timestamp: data.timestamp.toDate(), 
                    type: data.type,
                    newSpends: data.newSpends 
                };
                messagesData.push(message);
            });
            messagesData.sort((a, b) => b.timestamp - a.timestamp);
            setMessages(messagesData);
        });


        return () => {
            unsubscribe();
        };
    }, []);

    const renderMessageItem = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={{ color: "black",fontWeight:"200", fontSize: 20}}>{item.operation + " " + formatDate(item.timestamp) }</Text>
        </View>
    );

    return (
        <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            style={{backgroundColor: "rgb(249 250 251)"}}
        />
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        backgroundColor: "white",
        margin:0,
        borderRadius:20,
        marginHorizontal:10,
        marginVertical: 6,
        paddingVertical: 10,
        paddingHorizontal:20,
    }
})
export default NotificationsScreen;
