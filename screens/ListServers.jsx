import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper'; 
import axios from 'axios';
import { LOGIN } from '../assets/credentials';
import { encode } from 'base64-arraybuffer';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import RNSimpleOpenvpn, { addVpnStateListener, removeVpnStateListener } from 'react-native-simple-openvpn';


const ListServers = () => {
  const [selectedServerId, setSelectedServerId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [servers, setServers] = useState([]);
  const navigation = useNavigation();
  const [loadingServer, setLoadingServer]=useState(true);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [loading, setLoading]=useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const toggleServerConnection = async (serverId) => {
    const server = servers.find(s => s.id === serverId);
    if (!server) {
        console.error('Server not found');
        return;
    }

    console.log("Connecting to server with file name:", server.fileName); 

    if (selectedConnection !== serverId) {
        setLoading(true);
        setIsConnected(false);
        setSelectedConnection(serverId);

        try {
            await startOvpn(serverId,server.fileName);
            
            setIsConnected(true);
        } catch (error) {
            console.error('VPN connection error:', error);
        }

        setLoading(false);
    } else {
        try {
            await stopOvpn();
            setIsConnected(false);
        } catch (error) {
            console.error('VPN disconnection error:', error);
        }
        setSelectedConnection(null);
    }
};

const stopOvpn = async () => {
  try {
    await RNSimpleOpenvpn.disconnect();
  } catch (error) {
    updateLog(error);
  }
};


const getConnectionStatusText = (id) => {
  if (selectedConnection === id) {
      if (loading) {
          return 'Connecting...';
      } else if (isConnected) {
          return 'Connected'; 
      } else {
          return 'Connect';
      }
  } else {
      return 'Connect'; 
  }
};


const startOvpn = async (serverId, fileName) => {
  const server = servers.find(s => s.id === serverId);
  if (!server) {
    console.error('Server not found');
    return;
  }

  const fileUrl = `http://104.238.35.17:8090/api/ServersDetails/DownloadFile/${fileName}`;

  try {
    const response = await axios.get(fileUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });


    // console.log("OVPN File Content:", response.data); 

   const file=response.data;

    const fileContentStr = file.toString('utf8');
  
    await RNSimpleOpenvpn.connect({
      remoteAddress: server.serverIP,
      ovpnString:fileContentStr, 
      notificationTitle: 'RNSimpleOpenVPN',
      compatMode: RNSimpleOpenvpn.CompatMode.OVPN_TWO_THREE_PEER,
      providerBundleIdentifier: 'com.your.network.extension.bundle.id',
      localizedDescription: 'TestRNSimpleOvpn',
    });
    console.log("Connection established with server:", server.serverName);
  } catch (error) {
    updateLog(error.toString());
    console.error("Error connecting with OVPN or fetching file:", error);
  }
};

const getConnectionColor = (id) => {
  return selectedConnection === id ? 'green' : 'red';
};

  const loginUser = async () => {
    try {
      const response = await axios.post('http://104.238.35.17:8090/login', {
        email: LOGIN.email,  
        password: LOGIN.password
      });
  
      if (response.status === 200) {
        // console.log("Login successful", response.data);
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
    setLoadingServer(true);
    if (!token) {
        console.log("Access token is not available.");
        return;
    }
    
    try {
        const response = await axios.get('http://104.238.35.17:8090/api/ServersDetails', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
            const serversWithImagesAndFiles = await Promise.all(response.data.map(async server => {
                const imageUrl = `http://104.238.35.17:8090${server.countryFlagLink}`;
                const imageBase64 = await fetchImageDataAsBase64(imageUrl, token);
                const fileName = server.ovpnFileLink.split('/').pop();
                return { ...server, imageBase64, fileName };
            }));
            setServers(serversWithImagesAndFiles);
            setLoadingServer(false);
        } else {
            console.error("Failed to fetch server details", response.data);
        }
    } catch (error) {
        console.error("Error fetching server details:", error);
    }
};
  

  
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
            <TouchableOpacity
            key={index}
            style={[styles.billContainer]}
            onPress={() => toggleServerConnection(server.id)}
          >
            <View style={styles.textSection}>
              <Text style={styles.connectionHeading}>{server.serverName}</Text>
              <Image
                source={{ uri: server.imageBase64 || '' }}
                style={styles.flag}
                onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
              />
            </View>
            <View style={styles.rightConnectionSubtitle}>
              <Text style={[styles.connectionSubtitle, { color: getConnectionColor(server.id) }]}>
                {getConnectionStatusText(server.id)}
              </Text>
              <RadioButton
                value={server.id}
                status={selectedConnection === server.id ? 'checked' : 'unchecked'}
                onPress={() => toggleServerConnection(server.id)}
                color={getConnectionColor(server.id)}
                uncheckedColor="red"
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