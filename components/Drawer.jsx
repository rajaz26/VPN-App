import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../assets/theme';
import { useNavigation } from '@react-navigation/native'; 



const Drawer = props => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: COLORS.primary}}>
          <View style={{backgroundColor:COLORS.primary,paddingHorizontal:20,paddingVertical:35}}>
          <Image
            source={require('../assets/images/person.jpg')}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Poppins-Regular',
              top:1,
              marginBottom: 5,
            }}>
            Raja Zain
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Poppins-Regular',
                marginRight: 5,
              }}>
              Admin
            </Text>
            <Ionicons name="person-circle-outline" size={18} color={'white'} />
          </View>
          </View>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 15}}>
            <View style={{paddingHorizontal: 20, }}>
            <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="home-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Home
                </Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingVertical: 15}} onPress={()=> navigation.navigate('Profile')}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="person-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Profile
                </Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingVertical: 15}} onPress={()=> navigation.navigate('Scan')}>
             <View style={{flexDirection: 'row'}}>
                <Ionicons name="scan-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Scan
                </Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingVertical: 15}} onPress={()=> navigation.navigate('History')}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="archive-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Transactions
                </Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingVertical: 15}} onPress={()=> navigation.navigate('Settings')}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="settings-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Settings
                </Text>
            </View>
            </TouchableOpacity>
        </View>
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
      <TouchableOpacity onPress={() => {}} style={{paddingVertical: 10}}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="share-social-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Tell a Friend
                </Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={{paddingVertical: 10}}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="log-out-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                    Logout
                </Text>
            </View>
            </TouchableOpacity>
      </View>
    </View>
  );
};

export default Drawer;