import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper'; 
import axios from 'axios';
import { LOGIN } from '../assets/credentials';
import { encode } from 'base64-arraybuffer';

const ListServers = () => {
  const [selectedServerId, setSelectedServerId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [servers, setServers] = useState([]);
  const navigation = useNavigation();
  
  const toggleServerConnection = (serverId) => {
    setSelectedServerId(selectedServerId === serverId ? null : serverId);
  };

  const getConnectionColor = (serverId) => {
    return selectedServerId === serverId ? 'green' : 'red';
  };
  
  // const servers = [
  //   {
  //     id:1,
  //     name: 'Germany',
  //     flagUri: require('./germany.jpg'),
  //   },
  //   {
  //     id:2,
  //     name: 'Austria',
  //     flagUri: require('./austria.png'),
  //   },
  //   {
  //     id:3,
  //     name: 'France',
  //     flagUri: require('./france.jpg'),
  //   },
  //   {
  //     id:4,
  //     name: 'United Kingdom',
  //     flagUri: require('./uk.jpg'),
  //   },
  //   {
  //     id:5,
  //     name: 'Australia',
  //     flagUri: require('./australia.jpg'),
  //   },
  // ];

  const loginUser = async () => {
    try {
      const response = await axios.post('http://104.238.35.17:8090/login', {
        email: LOGIN.email,  
        password: LOGIN.password
      });
  
      if (response.status === 200) {
        console.log("Login successful", response.data);
        setAccessToken(response.data.accessToken);
        await fetchServers(response.data.accessToken);
      } else {
        console.error("Login unsuccessful", response.data);
      }
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
    }
    
  }

  const fetchImageDataAsBase64 = async (url, token) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer'  // To handle binary data
      });
      const base64 = `data:image/png;base64,${encode(response.data)}`;
      return base64;
    } catch (error) {
      console.error('Error fetching image data:', error);
      return '';
    }
  };
  
  const fetchServers = async (token) => {
    if (!token) {
      console.log("Access token is not available.");
      return;
    }
    try {
      const response = await axios.get('http://104.238.35.17:8090/api/ServersDetails', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        const serversWithImages = await Promise.all(response.data.map(async server => {
          const imageUrl = `http://104.238.35.17:8090${server.countryFlagLink}`;
          const imageBase64 = await fetchImageDataAsBase64(imageUrl, token);
          return { ...server, imageBase64 };
        }));
        setServers(serversWithImages);
      } else {
        console.error("Failed to fetch server details", response.data);
      }
    } catch (error) {
      console.error("Error fetching server details:", error);
    }
  }
  

  
  useEffect(()=>{
    loginUser();
  },[])
  


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.cashierHeading}>List of Servers</Text>
        </View>
      </SafeAreaView>
      <View style={styles.listContainer}>
        <ScrollView>
          {servers.map((server,index) => (
            <TouchableOpacity key={index} style={styles.billContainer}>
              <View style={styles.textSection}>
            <Text style={[styles.connectionHeading, { color:'black' }]}>
              {server.serverName}
            </Text>
            <Image
        source={{ uri: server.imageBase64 || '' }}
        style={styles.flag}
        onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
      />
          </View>

          <View style={styles.rightConnectionSubtitle}>
            <Text style={[styles.connectionSubtitle, { color: getConnectionColor(server.id) }]} onPress={() => toggleServerConnection(server.id)}>
            {selectedServerId === server.id ? 'Disconnect' : 'Connect'}
            </Text>
            <RadioButton
                value={server.id}
                status={selectedServerId === server.id ? 'checked' : 'unchecked'}
                onPress={() => toggleServerConnection(server.id)}
                color={getConnectionColor(server.id)}
                uncheckedColor="green"
                left={7}
              />
          </View>

            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.primary,
    },
    safeArea:{
        backgroundColor:COLORS.primary,
        flex:0,
    },
    headerContainer:{
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:50,
        borderBottomLeftRadius:30,
       
    },
    cashierHeading:{
        color:'white',
        fontSize:24,
        fontFamily:'Poppins-Regular',      
    },
    arrowBack:{
        position:'absolute',
        left:10,
    },
    listContainer:{
        flex:4.5,
        justifyContent:'center',
        // alignItems:'center',
        paddingHorizontal:30,
    },
    selectedContainer:{
        flex:0,
        paddingVertical:20,
        width:'100%',
        marginTop:10,
        
    },
    billContainer:{
      backgroundColor: 'white',
      padding:20,
      borderRadius: 15,
      justifyContent: 'center',
        elevation: 5, 
        shadowColor: 'black', 
        shadowOffset: {
            width:'100%',
            height: 2, 
        },
    shadowOpacity: 1, 
    shadowRadius: 15, 
    borderRadius: 15,
    marginVertical:10, 
      },
    connectionTextSection:{
      justifyContent:'flex-start',
      alignItems:'flex-start',
    },
    connectionText:{
      color:'white',
      fontFamily:'Poppins-Medium',
      fontSize:15,
      textAlign:'center',
      paddingVertical:10,                   
    },
    connectionSection: {
      backgroundColor: 'white',
      padding:20,
      borderRadius: 15,
      justifyContent: 'center',
      width: '75%', 
      marginRight: 20,
  
    },
    connectionSection2: {
      backgroundColor: 'white',
      padding: 25,
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '65%', 
      marginRight: 20,
    },
    
    connectionHeading:{
      fontFamily:'Poppins-Regular',
      fontSize:18,
      color:'black',
    },
    connectionSubtitle:{
      fontFamily:'Poppins-Medium',
      fontSize:15,
      color:'#6BCA91',
    },
    rightConnectionSubtitle:{
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'space-between',
    },
   
    textSection:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
    },
    flag:{
      top:2,
      height:20,
      width:30,
    },
})

export default ListServers;