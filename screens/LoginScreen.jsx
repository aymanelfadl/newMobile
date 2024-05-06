import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventRegister } from 'react-native-event-listeners';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleLogin = async (userId) => {
    try {
      await AsyncStorage.setItem('userId', userId);
      console.log(userId);
      EventRegister.emit('userIdChanged');
      navigation.navigate('TabNavigator');
    } catch (error) {
      console.error('Error saving user ID to local storage:', error);
    }
  };

  return (
    <View style={{ flex: 1,alignItems: 'center', backgroundColor: "crimson" }}>
      <View style={{flexDirection:"row",marginTop:"10%",marginBottom:"10%" }}>
        <View style={{borderWidth:2, borderColor: "white",width:"50%",height:"1%",alignSelf:"center", marginRight:"10%" }}></View>
        <Text style={{fontSize:28,color:"white"}}>
          Passer à
        </Text>
        <View style={{borderWidth:2, borderColor: "white",width:"50%",height:"1%",alignSelf:"center" ,marginLeft:"10%"}}></View>

      </View>

      <TouchableOpacity
        style={{ backgroundColor: 'rgb(147 197 253)', alignItems: "center", paddingVertical: 18, marginVertical: 25, borderRadius: 100, width: "30%" }}
        onPress={() => handleLogin('1')}
      >
        <Text style={{ color: 'white' }}>Azize</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: 'rgb(147 197 253)', alignItems: "center", paddingVertical: 18, marginVertical: 25, borderRadius: 100, width: "30%", }}
        onPress={() => handleLogin('2')}
      >
        <Text style={{ color: 'white' }}>Abdlatif</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
