import { StyleSheet, Image,Text, TouchableOpacity, View, ScrollView, ImageBackground} from 'react-native'
import React, { useState, useEffect,useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { RadioButton } from 'react-native-paper';
import Ionic from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import { COLORS } from '../assets/theme';
import { Easing } from 'react-native-reanimated';
import axios from 'axios';
import { LOGIN } from '../assets/credentials';
import { encode } from 'base64-arraybuffer';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSimpleOpenvpn, { addVpnStateListener, removeVpnStateListener } from 'react-native-simple-openvpn';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useDispatch, useSelector } from 'react-redux';


const ListServers = () => {

  const [accessToken, setAccessToken] = useState(null);
  const [servers, setServers] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [timer, setTimer] = useState(0);
  const [country, setCountry] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();
  const [loadingServer, setLoadingServer]=useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [log, setLog] = useState('');
  const dispatch = useDispatch();
  const vpnStatus = useSelector((state) => state.vpn);
  const [ipAddress,setIpAddress]=useState(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    async function observeVpn() {
      addVpnStateListener((e) => {
        updateLog(e);  
        console.log("R",e);
      });
    }

    observeVpn();

    return () => {
      removeVpnStateListener();
    };
  }, []);


useEffect(() => {
  if (isConnected) {
      getPublicIP();
  }
}, [isConnected]);

const getPublicIP = async () => {
  try {
      const response = await axios.get('https://api.ipify.org?format=json');
      console.log("Your public IP address is: ", response.data.ip);
      setIpAddress(response.data.ip);
  } catch (error) {
      console.error("Failed to fetch IP address: ", error);
  }
};


const toggleServerConnection = async (serverId) => {
  const server = servers.find(s => s.id === serverId);
  if (!server) {
      toggleConnect();
      return;
  }

  if (selectedConnection !== serverId) {
      setIsConnecting(true);
      setIsConnected(false);
      setSelectedConnection(serverId);

      try {
          await startOvpn(serverId, server.fileName);
          setIsConnected(true);
      } catch (error) {
          console.error('VPN connection error:', error);
      }

      setIsConnecting(false);
  } else {
      setIsConnecting(false);
      setIsDisconnecting(true);
      try {
          await stopOvpn();
          setIsConnected(false);
          setIsDisconnecting(false); 
      } catch (error) {
          console.error('VPN disconnection error:', error);
          setIsDisconnecting(false); // Reset disconnection flag if error occurs
      }
      setSelectedConnection(null);
      // setTimer(0);
      setIpAddress(null);
      setCountry(null);
  }
};


const toggleConnect = async () => {
  setIsConnecting(true);
  if (!isConnected) {
      
      setTimeout(async () => {
          try {
              await connectToRandomServer();
              setIsConnected(true);
              setTimer(0);
              
          } catch (error) {
              console.error('Connection failed:', error);
              setIsConnected(false);
          }
          setIsConnecting(false);
      }, 5000);
  } else {
      setIsConnecting(false);
      setIsDisconnecting(true);
      await stopOvpn();
      setIsConnected(false);
      setSelectedConnection(null);
      setIpAddress(null);
      setCountry(null);
      setIsDisconnecting(false);
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

   const file=response.data;

    const fileContentStr = file.toString('utf8'); 
    await RNSimpleOpenvpn.connect({
      remoteAddress: server.serverIP,
      ovpnString:fileContentStr, 
     
      compatMode: RNSimpleOpenvpn.CompatMode.OVPN_TWO_THREE_PEER,
      providerBundleIdentifier: 'com.your.network.extension.bundle.id',
      localizedDescription: 'TestRNSimpleOvpn',
    });
    setCountry(server.countryName);
    console.log(server.countryName);
    console.log("Connection established with server:", server.serverName);
  } catch (error) {
    updateLog(error.toString());
    console.error("Error connecting with OVPN or fetching file:", error);
  }
};




  const stopOvpn = async () => {
    try {
      await RNSimpleOpenvpn.disconnect();
    } catch (error) {
      updateLog(error);
    }
  };

  const updateLog = (newLog) => {
    const now = new Date().toLocaleTimeString();
    setLog((prevLog) => `${prevLog}\n[${now}] ${newLog}`);
  };

  useEffect(() => {
    let interval = null;
    if (isConnected) {
      interval = setInterval(() => {
        setTimer(oldTimer => oldTimer + 1);
      }, 1000);
    } else if (!isConnected && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isConnected, timer]);

  const loginUser = async () => {
    try {
      const response = await axios.post('http://104.238.35.17:8090/login', {
        email: LOGIN.email,  
        password: LOGIN.password
      });
  
      if (response.status === 200) {

        setAccessToken(response.data.accessToken);
        await fetchServers(response.data.accessToken);
      } else {
        console.error("Login unsuccessful", response.data);
      }
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
    }
    
  }


  useEffect(() => {
    if (isConnecting && !isConnected) {
      setShowAnimation(true);
    } else if (!isConnecting && !isConnected) {
      setTimeout(() => setShowAnimation(false), 1500);
    }
  }, [isConnecting, isConnected]);
  

  const getConnectionStatusText = (id) => {
    if (selectedConnection === id) {
        if (isConnecting) {
            return 'Connecting...';
        } else if (isDisconnecting) {
          return 'Disconnecting'; 
      }
      else if (isConnected) {
            return 'Connected'; 
        } else {
            return 'Connect';
        }
    } else {
        return 'Connect'; 
    }
};

  const getConnectionColor = (id) => {
    return selectedConnection === id ? 'green' : 'red';
  };




  

  const formatTime = (timer) => {
    const getSeconds = `0${(timer % 60)}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  }
  const getConnectionButtonText = () => {
    if (isConnecting) {
      return 'Connecting...';
    } else if (isDisconnecting) {
      return 'Disconnecting'; 
  }else if (isConnected) {
      return 'Connected';  
    } else {
      return 'Connect';
    }
  };
  


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

const connectToRandomServer = async () => {
  if (servers.length === 0) {
      console.error('No servers available to connect.');
      return;
  }

  const randomIndex = Math.floor(Math.random() * servers.length);
  const server = servers[randomIndex];

  console.log("Automatically connecting to server:", server.serverName);
  await toggleServerConnection(server.id);
};

  useEffect(() => {
    loginUser();
  }, []);
  

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