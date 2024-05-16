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

import RNSimpleOpenvpn, { addVpnStateListener, removeVpnStateListener } from 'react-native-simple-openvpn';


const HomeScreen = () => {

  const [accessToken, setAccessToken] = useState(null);
  const [servers, setServers] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading]=useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [log, setLog] = useState('');
  const logScrollView = useRef(null);
  useEffect(() => {
    async function observeVpn() {
      addVpnStateListener((e) => {
        updateLog(JSON.stringify(e, undefined, 2));
      });
    }

    observeVpn();

    return () => {
      removeVpnStateListener();
    };
  }, []);

  const toggleServerConnection = async (serverId) => {
    if (selectedConnection !== serverId) {
      setLoading(true);
      setIsConnected(false);
      setSelectedConnection(serverId);

      try {
        await startOvpn(serverId);
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

  const startOvpn = async (serverId) => {
    const ovpnFileName = 'US_1.ovpn' ;
    const assetsPath =  '../assets';

    
    console.log("Here");
    try {
      await RNSimpleOpenvpn.connect({
        remoteAddress: '',
        ovpnFileName:'US_1' ,
        assetsPath:'',
        notificationTitle: 'RNSimpleOpenVPN',
        compatMode: RNSimpleOpenvpn.CompatMode.OVPN_TWO_THREE_PEER,
        providerBundleIdentifier: 'com.your.network.extension.bundle.id',
        localizedDescription: 'TestRNSimpleOvpn',
      });
      console.log("Done");
    } catch (error) {
      updateLog(error.toString());
      console.error("Error OVPN",error);
      console.log("Error OVPN",error);
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
  const [mapRegion, setMapRegion] = useState({
    latitude: 46.2276,
    longitude: 2.2137,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  
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


  useEffect(() => {
    if (loading && !isConnected) {
      setShowAnimation(true);
    } else if (!loading && !isConnected) {
      setTimeout(() => setShowAnimation(false), 1500);
    }
  }, [loading, isConnected]);
  
  const connections = [
    {
      id: 1,
      country: 'Germany',
      image: require('./germany.jpg'),
    },
    {
      id: 2,
      country: 'Japan',
      image: require('./germany.jpg'), // You might want to change this to japan.jpg
    },
  ];


  
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

  const getConnectionColor = (id) => {
    return selectedConnection === id ? 'green' : 'red';
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

  const toggleConnect = async () => {
      setLoading(true);
      if (!isConnected) {
          // Simulate connection delay
          setTimeout(async () => {
              try {
                  await startOvpn(selectedConnection); // Make sure `selectedConnection` holds the correct server ID
                  setIsConnected(true);
                  setTimer(0);
                  setMapRegion({
                      latitude: 48.8566,
                      longitude: 2.3522,
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                  });
                  console.log("Navigated to France!");
              } catch (error) {
                  console.error('Connection failed:', error);
                  setIsConnected(false);
              }
              setLoading(false);
          }, 5000);
      } else {
          await stopOvpn();
          setIsConnected(false);
          setLoading(false);
          setTimer(0);
      }
  };

  
  useEffect(()=>{
    loginUser();
  },[])
  
  const formatTime = (timer) => {
    const getSeconds = `0${(timer % 60)}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  }
  const getConnectionButtonText = () => {
    if (loading) {
      return 'Connecting...';  // Show this text when the connection is in progress
    } else if (isConnected) {
      return 'Connected';  // Show when the connection is established
    } else {
      return 'Connect';  // Default text when there is no connection
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
  
  
  useEffect(() => {
    loginUser();
  }, []);
  

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.homeContainer}>

        <View style={styles.logoContainer}>
          <View style={styles.logoSection}>
            <Text style={styles.logoText}>VPN</Text>
            <Text style={styles.logoText2}>!</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.premiumContainer}>
              <Ionic size={22} color='#F4C11E' name ='diamond-outline'/>
              <Text style={styles.premiumText}>Go Premium</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.connectionContainer}>
          <View style={styles.connectionTextSection}>
            <Text style={styles.connectionText}>Recent Connection</Text>
          </View>

          <ScrollView style={styles.sliderContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
          {servers.map((server, index) => (
  <TouchableOpacity
    key={index}
    style={[
      styles.connectionSection,
      { backgroundColor:'white' }
    ]}
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
      <Text
        style={[styles.connectionSubtitle, { color: getConnectionColor(server.id) }]}
      >
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


        <View style={styles.mainContainer}>
          <ImageBackground
            source={require('./background4.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >      
        <View style={styles.connectButtonContainer}>
          {showAnimation && (
          [...Array(3).keys()].map((index) => (
            <MotiView 
              key={index}
              from={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{
                type: 'timing',
                duration: 2000,
                easing: Easing.out(Easing.ease),
                loop: true,
                repeatReverse: false,
                delay: index * 400,
              }}
              style={[StyleSheet.absoluteFillObject, styles.connectButtonBackground]}
            />
          )))}

<TouchableOpacity 
  style={[styles.connectButton]}
  onPress={toggleConnect} 
>
  <Text style={styles.connectStartText}>
    {getConnectionButtonText()}
  </Text>
</TouchableOpacity>

        </View>

        <View style={styles.connectionTimer}>
          <Text style={styles.connectTimeText}>{formatTime(timer)}</Text>
        </View>

        </ImageBackground>

        </View>

        <View style={styles.bottomContainer}>

          <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('ListServers')}>
            <View style={styles.buttonContainer}>
            {/* <Ionic size={22} color='#292B3A' name ='location'/> */}
            <Text style={styles.bottomText}>Duration :</Text>
            </View>
            <View style={styles.buttonContainer}>
     
            <Text style={styles.bottomText}>Local IP :</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('ListServers')}>
            <View style={styles.buttonContainer}>
        
            <Text style={styles.bottomText}>In :</Text>
            </View>
            <View style={styles.buttonContainer}>
          
            <Text style={styles.bottomText}>Out :</Text>
            </View>
            </TouchableOpacity>
         
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  dot:{
    width:100,
    height:100,
    borderRadius:100,
    backgroundColor:COLORS.secondary,
  },
  background:{
    backgroundColor:'#292B3A',
    flex:1,
    paddingHorizontal:15,
    paddingVertical:20,
  },
  homeContainer:{
   
  },
  logoContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:15
    },
    logoSection:{
      flexDirection:'row',
    },
    logoText:{
      fontSize:25,
      fontFamily:'Poppins-Bold',
      color:'white',
    },
    logoText2:{
      fontSize:25,
      fontFamily:'Poppins-Bold',
      color:'red',
      left:5,
    },
    premiumContainer:{
      backgroundColor:'#FF4F11',
      borderRadius:20,
      justifyContent:'space-between',
      alignItems:'center',
      paddingHorizontal:15,
      paddingVertical:5,
      flexDirection:'row'
      
    },
    premiumText:{
      color:'white',
      fontFamily:'Poppins-Medium',
      top:1,
      marginLeft:10,
    },
    connectionSection: {
      flex: 1, // Remove if you set a specific width
      width: 300, // Set a specific width for each element
      padding: 20,
      borderRadius: 15,
      justifyContent: 'center',
      marginRight: 20, // Add space between elements
    },
    sliderContainer: {
      flexDirection: 'row',
      width: '100%',
    },
    connectionContainer:{
 
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
      justifyContent:'space-around',
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'space-between'
    },
   
    textSection:{
      flexDirection:'row',
      justifyContent:'space-between'
    },
    flag:{
      top:2,
      height:20,
      width:30,
    },
    mainContainer:{
      justifyContent:'center',
      alignItems:'center',
      paddingVertical:30,
      marginHorizontal:-30,
    },
    backgroundImage: {
    flex: 0,
    width: '100%', 
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal:-15,
  },
  connectButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',  
    width: 250,
    height: 250, 
  },
  
    connectButton:{
      backgroundColor:"#F4C11E",
      height:260,
      width:260,
      borderRadius:130,
      justifyContent:'center',
      alignItems:'center',
      borderColor: 'rgba(100, 100, 100, 0.8)',
      borderWidth:10,
    },
    connectButtonBackground:{
      backgroundColor:"#F4C11E",
      height:250,
      width:250,
      borderRadius:125,
      justifyContent:'center',
      alignItems:'center',

    },
    connectStartText:{
      fontFamily:'Poppins-SemiBold',
      fontSize:25,
      color:'black',
      top:1,
    },
    connectSubtitleText:{
      fontFamily:'Poppins-SemiBold',
      fontSize:15,
      color:'black',
    },
    connectionTimer:{
      paddingVertical:15,
    },
    connectTimeText:{
      color:'white',
      fontFamily:'Poppins-Bold',
      fontSize:30,
    },
    bottomContainer:{
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row',
      bottom:40
    },
    buttonContainer:{
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row'

    },
    bottomButton:{
      backgroundColor:'#F4C11E',
      justifyContent:'flex-start',
      alignItems:'flex-start',
      paddingVertical:10,
      borderRadius:10,
      flexDirection:'column',
      width:'50%',
      marginHorizontal:5

    },
    bottomText:{
      fontFamily:'Poppins-Medium',
      fontSize:14,
      color:'#292B3A',
      top:2,
      paddingLeft:10
    }
})