import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemeModal from '../components/ThemeModal.jsx';

const Settings = () => {
  const navigation = useNavigation();
  const [pressedItem,setPressedItem]=useState('');
  const [isThemeModalVisible, setThemeModalVisible] = useState(false);
  const [isProtocolModalVisible, setProtocolModalVisible] = useState(false);
  const [isNotificationModalVisible, setNotificationModalVisible] = useState(false);
  const toggleThemeModal = () => {
    setThemeModalVisible(!isThemeModalVisible);
  };

  const toggleModal = () => {
    setProtocolModalVisible(!isProtocolModalVisible);
  };

  const toggleNotificationModal = () => {
    setNotificationModalVisible(!isNotificationModalVisible);
  };

  const onPressInHandler = (item) => {
    setPressedItem(item);
  };

  const onPressOutHandler = () => {
    setPressedItem(null);
  };

  return (
    <SafeAreaView style={styles.headContainer}>
      <View style={styles.header}>

        <Text style={styles.settingsText}>Settings</Text>
      </View>
      <ScrollView
        style={{ marginHorizontal: 15, marginTop: 20 }}
      >
        <View style={styles.settingsSection}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.accountText}>Account</Text>
          </View>
          <View  onPressIn={() => onPressInHandler('RajaZain')}
            onPressOut={onPressOutHandler}
            style={[styles.optionContainer, pressedItem === 'RajaZain' ? styles.pressed : null]}>
            <Ionic style={styles.optionIcon} size={22} color={'white'} name="person-outline" />
            <Text style={styles.optionText}>Raja Zain</Text>
          </View>
          <View
            onPressIn={() => onPressInHandler('Subscription')}
            onPressOut={onPressOutHandler}
            style={[styles.optionContainer, pressedItem === 'Subscription' ? styles.pressed : null]}
          >
            <Ionic size={22} color={'white'} name="cash-outline" />
            <Text style={styles.optionText}>Subscription</Text>
          </View>
          <View  onPressIn={() => onPressInHandler('Rewards')}
            onPressOut={onPressOutHandler}
            style={[styles.optionContainer, pressedItem === 'Rewards' ? styles.pressed : null]} >
            <Ionic style={styles.optionIcon} size={22} color={'white'} name="trophy-outline" />
            <Text style={styles.optionText}>Rewards</Text>
          </View>
        </View>
        <View style={styles.settingsSection}>
        <View style={{marginBottom:10}}>
            <Text style={[styles.accountText,{marginTop:10}]}>VPN Connection</Text>
        </View>
        <View
            onPressIn={() => onPressInHandler('AutoConnect')}
            onPressOut={onPressOutHandler}
            style={[styles.optionContainer, pressedItem === 'AutoConnect' ? styles.pressed : null]} 
            onPress={toggleThemeModal}
          >
            <Ionic style={styles.optionIcon}  size={23} color={'white'} name ='wifi-outline'/>
            <Text style={styles.optionText}>Auto-connect</Text>
        </View>
        <View
            onPressIn={() => onPressInHandler('Protocol')}
            onPressOut={onPressOutHandler}
            style={[styles.optionContainer, pressedItem === 'Protocol' ? styles.pressed : null]}
            onPress={toggleModal}
          >
            <Ionic style={styles.optionIcon}  size={22} color={'white'} name ='shield-half-outline'/>
            <Text style={styles.optionText}>Protocol</Text>
        </View>
        <View
            onPressIn={() => onPressInHandler('DNS')}
            onPressOut={onPressOutHandler}
            style={[styles.optionContainer, pressedItem === 'DNS' ? styles.pressed : null]}
          >
            <Ionic style={styles.optionIcon}  size={22} color={'white'} name ='globe-outline'/>
            <Text style={styles.optionText}>DNS</Text>
        </View>
        </View>

        <View style={styles.settingsSection}>
        <View style={{marginBottom:10}}>
            <Text style={styles.accountText}>Support</Text>
        </View>
        <View
            onPressIn={() => onPressInHandler('FAQ')}
            onPressOut={onPressOutHandler}
            style={[styles.optionContainer, pressedItem === 'FAQ' ? styles.pressed : null]}
          >
            <Ionic style={styles.optionIcon}  size={23} color={'white'} name ='chatbubbles-outline'/>
            <Text style={styles.optionText}>FAQ</Text>
        </View>
        <View
            onPressIn={() => onPressInHandler('Send Feedback')}
            onPressOut={onPressOutHandler}
            style={[styles.optionContainer, pressedItem === 'Send Feedback' ? styles.pressed : null]}
          >
            <Ionic style={styles.optionIcon}  size={23} color={'white'} name ='send-outline'/>
            <Text style={styles.optionText}>Send Feedback</Text>
        </View>
        <View
            onPressIn={() => onPressInHandler('Rate the App')}
            onPressOut={onPressOutHandler}
            style={[styles.optionContainer, pressedItem === 'Rate the App' ? styles.pressed : null]}
          >
            <Ionic style={styles.optionIcon}  size={22} color={'white'} name ='star-half-outline'/>
            <Text style={styles.optionText}>Rate the App</Text>
        </View>
        <View
            onPressIn={() => onPressInHandler('Share')}
            onPressOut={onPressOutHandler}
            style={[styles.optionContainer, pressedItem === 'Share' ? styles.pressed : null]}
          >
            <Ionic style={styles.optionIcon}  size={22} color={'white'} name ='share-social-outline'/>
            <Text style={styles.optionText}>Share</Text>
        </View>
      </View>
        
        <ThemeModal visible={isThemeModalVisible} onClose={toggleThemeModal} type="theme" />
        <ThemeModal visible={isProtocolModalVisible} onClose={toggleModal} type="protocol" />
        <ThemeModal visible={isNotificationModalVisible} onClose={toggleNotificationModal} type="notifications" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  headContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    marginTop: 25,
    marginBottom: 5,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsText: {
    fontSize: 21,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    top: 1,
  },
  arrowBackIcon: {
    position: 'absolute',
    left: 8,
  },
  accountText: {
    fontSize: 16.5,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  pressed: {
    backgroundColor: COLORS.secondary,
  },
  optionContainer: {
    paddingHorizontal: 12,
    flex: 0,
    flexDirection: 'row',
    // paddingVertical: 8,
    paddingVertical: 15,
    marginVertical:10,
    backgroundColor: 'rgba(180, 180, 180,0.124)',
    // backgroundColor: 'rgba(180, 180, 180,0.099)',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginLeft: 50,
    fontFamily: 'Poppins-Regular',
  },
  settingsSection: {
    marginBottom: 13,
  },
});