import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index'; // Ensure COLORS is correctly imported

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Raja Zain');
  const [email, setEmail] = useState('raja@gmail.com');
  const [joined, setJoined] = useState('2021-01-01');
  const [subscriptionStatus, setSubscriptionStatus] = useState('Premium');

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./profileCover.jpg')} // Path to your texture image
        style={styles.upperView}
        resizeMode="cover"
      >
 
        <View style={styles.headerData}>
          <Text style={styles.name}>{name}</Text>
        </View>
        
      </ImageBackground>
      <View style={styles.lowerView}>
        <ScrollView style={styles.scrolledView}>
          <View style={styles.formInputContainer}>

            <View style={styles.formInputWrapper}>

              <View style={styles.imageContainer}>
                <Ionic size={30} color={COLORS.secondary} name='person-outline' />
                <Text style={styles.optionText}>Username</Text>
              </View>
              
              <View style={styles.inputContainer}>
                {isEditing ? (
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    style={styles.formInput}
                    placeholder="Username"
                    editable={true}
                  />
                ) : (
                  <Text style={styles.formInput}>{name}</Text>
                )}
              </View>


            </View>
          </View>
          <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
              <View style={styles.imageContainer}>
                <Ionic size={30} color={COLORS.secondary} name='mail-outline' />
                <Text style={styles.optionText}>Email</Text>
              </View>
              <View style={styles.inputContainer}>
                {isEditing ? (
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.formInput}
                    placeholder="Email Address"
                    editable={true}
                  />
                ) : (
                  <Text style={styles.formInput}>{email}</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
              <View style={styles.imageContainer}>
              <Ionic size={30} color={COLORS.secondary} name='calendar-outline' />
                <Text style={styles.optionText}>Joined</Text>
              </View>
              <View style={styles.inputContainer}>
                {isEditing ? (
                  <TextInput
                    value={joined}
                    onChangeText={setJoined}
                    style={styles.formInput}
                    placeholder="Joined"
                    editable={true}
                  />
                ) : (
                  <Text style={styles.formInput}>{joined}</Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
              <View style={styles.imageContainer}>
                <Ionic size={30} color={COLORS.secondary} name='cash-outline' />
                <Text style={styles.optionText}>Subscription Status</Text>
              </View>
              <View style={styles.inputContainer}>
                {isEditing ? (
                  <TextInput
                    value={subscriptionStatus}
                    onChangeText={setSubscriptionStatus}
                    style={styles.formInput}
                    placeholder="Subscription Status"
                    editable={true}
                  />
                ) : (
                  <Text style={styles.formInput}>{subscriptionStatus}</Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      {isEditing ? (
        <View style={styles.saveContainer}>

        <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditing(false)}>
          <Ionic size={18} color={COLORS.primary} name='save-outline' />
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Ionic size={18} style={{top:5,right:5}} color={COLORS.primary} name='brush-outline' />
          <Text style={styles.saveText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary
    
  },
  upperView: {
    flex:1.7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    borderBottomEndRadius:140,
    borderBottomStartRadius:140,
    overflow: 'hidden', 
    flexDirection:'row',
    marginBottom:30,
  },
  arrowBackIcon:{
    position:'absolute',
    top:50,
    left:8
},
headerData:{
  justifyContent:'center',
  alignItems:'center',
  marginBottom:40,
},
  lowerView: {
    flex: 3,
    backgroundColor: COLORS.primary,
  },

  name: {
    fontSize: 40,
    color: COLORS.primary,
    fontFamily:'Poppins-SemiBold',
  },
  role: {
    fontSize: 14,
    color: COLORS.secondary,
    // bottom:24,
    
  },
  scrolledView:{
    top:-15,
    // borderWidth:2,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    
  },
  field: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: COLORS.primary,
  },
  value: {
    fontSize: 14,
    color: 'darkgray',
  },
  input: {
    fontSize: 14,
    backgroundColor: 'white',
    color: 'black',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  picker: {
    flex: 1,
    height: 30,
    color: 'black',
    fontSize: 14,
    padding: 0,
    margin: 0,
  },
  dropdownIndicator: {
    fontSize: 16,
    color: COLORS.primary,
  },
  editButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 50,
    paddingVertical: 10,
    width:130,
    justifyContent:'center',
    elevation: 5,
    flexDirection:'row'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  formInputContainer:{
    borderBottomWidth:1,
    borderColor:'lightgray',
    justifyContent:'space-between',
    paddingVertical:25,
    paddingHorizontal:10,
    marginHorizontal:10,

},
formInputContainerSelected:{
    borderBottomWidth:1,
    borderColor:'lightgray',
    paddingVertical:10,
    paddingRight:20,
    paddingLeft:17,
},

formInputWrapper:{
    flex:0,
    flexDirection:'row',

    alignItems:'center',
    width:'100%'
},
formInput:{
  width:'100%',
    flex:0,
    fontSize:18.5,
    top:6,
    fontFamily:'Poppins-Regular',
    justifyContent:'center',
    alignItems:'center',
    color:'white',
    textAlign:'right',
},
formInputRole:{
  flex:0,
  fontSize:17.5,
  top:1,
  fontFamily:'Poppins-Regular',
  justifyContent:'center',
  alignItems:'center',
  color:'rgba(140, 140, 140,4)',
  textAlign:'center',
},
formInputSize:{
    flex:0,
    fontSize:19,
    top:6,
    fontFamily:'Poppins-Regular',
    justifyContent:'center',
    alignItems:'center',
    color:'black',
    
},
imageContainer:{
    flex:0,
    justifyContent:'space-around',
    alignItems:'flex-end',
    flexDirection:'row',
},
optionText: {
  fontSize: 16,
  // color: 'COLORS.secondary,'
  color: 'white',
  fontFamily: 'Poppins-Medium',
  paddingLeft:10,
},
inputContainer:{
    flex:1,
    paddingLeft:20,
    justifyContent:'center',
    alignItems:'center',
},
saveContainer:{
 paddingHorizontal:10,
  alignItems:'flex-end'
},
saveWrapper:{
  flex:0,
  paddingVertical:5,
  flexDirection:'row',
  justifyContent:'space-around',
  alignItems:'center',
 
},
saveButton:{

  backgroundColor: COLORS.secondary,
  borderRadius: 50,
  paddingVertical: 10,
  width:130,
  justifyContent:'center',
  elevation: 5,
  flexDirection:'row',

    backgroundColor:COLORS.secondary,
    width:130,
    paddingVertical:10,
    borderRadius:30,
    marginRight:10,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center', 
},
saveText:{
  fontFamily:'Poppins-SemiBold',
  fontSize:17,
  top:2,
  marginLeft:5,
  color:COLORS.primary,
  textAlign:'center',

},

deleteButton:{
  backgroundColor:'red',
  width:100,
  paddingVertical:5,
  borderRadius:30,
  marginRight:10,
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center',
},
deleteText:{
  fontFamily:'Poppins-Regular',
  fontSize:17,
  top:2,
  marginLeft:5,
  color:'white',
  textAlign:'center',

},
idCardImageContainer: {
  flex:1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 10, 
},
idCardImage: {
  width: 100, // Set your desired width
  height: 50, // Set your desired height
  resizeMode: 'cover', // Adjust as needed
},
loadingContainer: {
  ...StyleSheet.absoluteFillObject,
  position:'absolute',
  zIndex:999999,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
loadingText:{
  color:'white',
  fontSize:24,
  fontFamily:'Poppins-Regular',
  top:15,
},
successMessageContainer:{
  flex:0,
 alignItems:'center'
},
successButton: {
  backgroundColor: COLORS.secondary,
  width: 150,
  paddingVertical: 8,
  borderRadius: 30,
  top:20,
},
buttonText: {
  fontFamily: 'Poppins-SemiBold',
  fontSize: 18,
  color: COLORS.primary,
  textAlign: 'center',
  top:1,
},
});

export default Profile;