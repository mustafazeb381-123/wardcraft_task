import {
    View, Text, SafeAreaView, StyleSheet, ImageBackground, TouchableOpacity, Image, Modal, Alert, TextInput, PermissionsAndroid, FlatList, ActivityIndicatorBase, ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { Avatar, Divider } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign'
import background from '../assets/images/background.png'
import imgupload from '../assets/images/imgupload.png'
import { launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment';


const AllCheckIns = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [input, setInput] = useState("")
    const [getData, setGetData] = useState([])
    const [loader, setLoader] = useState(true)
    console.log("selected Image", selectedImage)


    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
            }
        });
    };

    const postDataToFirestore = async () => {
        try {
            await firestore().collection('checkins').add({
                date: Date.now(),
                title: input,
                image:selectedImage
                // Add other key-value pairs as needed
            });
            console.log('Data posted to Firestore');
            Alert.alert("success", "data Posted")
            setModalVisible(false)
            setInput("")
            setSelectedImage(null)

            getDataFromFirestore();

            
        } catch (error) {
            console.error('Error posting data to Firestore:', error);
            Alert.alert("error", error)
        }
    };

    const getDataFromFirestore = async () => {
        setLoader(true)
        try {
            const snapshot = await firestore().collection('checkins').get();
            const data = snapshot.docs.map((doc) => doc.data());
            setGetData(data)
            console.log('Data retrieved from Firestore:', data);
            setLoader(false);

        } catch (error) {
            setLoader(false);

            console.error('Error retrieving data from Firestore:', error);
        }
    };

    useEffect(() => {
        getDataFromFirestore()
    }, [])
  return (
      <SafeAreaView style={styles.container}>
          <View style={styles.headerView}>
              <View style={styles.logoView}>
                  <Text style={styles.logoText}>
                      Logo
                  </Text>
              </View>

              <View style={styles.headerAvatarView}>
                  <Avatar width={30} height={30} bg="green.500" source={{
                      uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                  }} />

                <AntDesign name={"down"} color={"black"} size={15} />
                  
              </View>
          </View>

          <View style={styles.AddCheckInView}>
              <ImageBackground imageStyle={{ borderRadius: 24 }}
                  style={styles.backgroundImageView} source={background}>
                  <Text style={styles.hiText}>
                      Hi! 👋 James Doe
                  </Text>
                  <Text style={styles.loremText}>
                      Lorem ipsus dolor sit amen,
                  </Text>
                  <Text style={styles.loremSecondText}>
                  something important to say here
                  </Text>
                  <TouchableOpacity onPress={()=> setModalVisible(true)} style={styles.AddCheckInButton}>
                      <Text style={styles.AddCheckInButtonText}>
                          Add Check In
                      </Text>
                  </TouchableOpacity>
              </ImageBackground>
          </View>

          <Text style={styles.addcheckInHeadingText}>
              Added CheckIns
          </Text>

          
          {loader ? (
              // Show loader while data is being fetched
              <ActivityIndicator color={"blue"} size={20} />
          ) : (
          <FlatList
              data={getData}
              style={{ marginTop: 20 }}
              showsVerticalScrollIndicator={false}
              // numColumns={3}
              ListEmptyComponent={() => (
                  <Text
                      style={{
                          color: "white",
                          alignSelf: "center",
                          fontSize: 20,
                          paddingTop: "50%",
                      }}
                  >
                      No Address found
                  </Text>
              )}
              renderItem={({ item }) => {
                  return (
                      
                      <View style={styles.addedCheckIndata}>
                          <View>
                              <Image source={{ uri: item.image }} style={styles.addCheckinImage} />
                              <TouchableOpacity style={styles.checkedInButton}>
                                  <Text style={styles.AddCheckInButtonText}>
                                      Checked In
                                  </Text>
                              </TouchableOpacity>
                          </View>
                          <Text style={styles.CheckInName}>
                              {item.title}
                          </Text>
                          <Text style={styles.date}>
                              {moment(item.date).format('LLL')} 
                          </Text>
                          <View style={styles.avatarAndName}>
                              <Avatar style={{ width: 32, height: 32 }} bg="green.500" source={{
                                  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                              }} />
                              <Text style={styles.ownerName}>
                                  Owner: John Doe
                              </Text>
                          </View>
                      </View>
                  
                  );
              }}
          />
          )}
         
          
             
         
          
              
      
         
         
        
          <View style={styles.centeredView}>

          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                  setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                          <View style={styles.modalHeader}>
                              <Text style={styles.headerModalText}>
                                  Add Check In
                              </Text>
                              <TouchableOpacity onPress={()=> setModalVisible(false)}>
                                  
                              <AntDesign name={"close"} size={16} color={"black"} />
                              </TouchableOpacity>
                          </View>
                          <Divider style={{ width: "100%", backgroundColor: '#B4B4B4' }} />
                          <View style={styles.titleInputView}>
                              <Text style={styles.titleText}>
                                  Title
                              </Text>

                              <View style={styles.inputView}>
                                  <TextInput onChangeText={(val)=> setInput(val)} placeholder='Enter Title' placeholderTextColor={"black"} style={{color:'black'}} />
                                  
                              </View>
                              
                                  
                              <Text style={styles.uploadImageText}>
                                  Upload Image
                              </Text>
                            

                              <View style={styles.uplaodImageView}>
                                  <TouchableOpacity onPress={() => openImagePicker()}>
                                      {selectedImage ? <Text style={{color:"black"}} >{ selectedImage}</Text> :
                                      
                                      <Image source={imgupload} />
                                  }
                                      </TouchableOpacity>
                                  <Text style={styles.dragfile}>
                                      Click or drag file to this area to upload
                                  </Text>
                                  <Text style={styles.supportText}>
                                      Support for a single or bulk upload. Strictly prohibit from uploading company data
                                      or other band files
                                  </Text>
                              </View>

                          </View>

                          <Divider style={{ width: "100%", backgroundColor: '#B4B4B4', marginTop: 25 }} />
                          
                          <View style={styles.bottomButtons}>
                              
                              <TouchableOpacity onPress={()=> setModalVisible(false)} style={styles.cancelButton}>
                                  <Text style={styles.cancelText}>
                                      Cancel
                                  </Text>
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => postDataToFirestore()} style={styles.addButton}>
                                  <Text style={styles.addText}>
                                      Add
                                  </Text>
                              </TouchableOpacity>
                              
                          </View>
                      
                  </View>
              </View>
              </Modal>
              </View>

    </SafeAreaView>
  )
}

export default AllCheckIns

const styles = StyleSheet.create({
    addText: {
        fontSize: 14, color: '#ffffff'

    },
    cancelText: {
        fontSize:14, color:'#000000'
    },
    addButton: {
        height: 32, width: 59, borderRadius: 30, justifyContent: 'center', alignItems: "center", backgroundColor:'#7B5AFF'
    },
    cancelButton: {
        height: 32, width: 75, justifyContent: 'center', alignItems: 'center', borderRadius: 30, borderWidth: 1, borderColor:'#B4B4B4'
    },
    bottomButtons: {
        height:72, width:'100%', paddingHorizontal:16, paddingVertical:20, flexDirection:"row", justifyContent:'flex-end', alignItems:'center', gap:8
    },
    supportText: {
        color:"#B4B4B4", fontSize:14, textAlign:'center'
        
    },
    dragfile: {
        color:'#000000', fontSIze:16, marginTop:20
    },
    uplaodImageView: {
        marginTop: 15, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, width: '100%', borderWidth: 1, borderStyle: 'dashed', borderColor:'#B4B4B4'
    },
    uploadImageText: {
        marginTop:34,   
        color: '#000000',
        fontSize: 16,
    },
    titleText: {
        color: '#000000',
        fontSize:16,
    },
    inputView: {
        marginTop: 15, width: "100%", height: 44, borderRadius: 8, borderWidth: 1, borderColor:"#B4B4B4"
    },
    titleInputView: {
        paddingHorizontal:20, paddingTop:19, width:'100%'
    },
    headerModalText: {
        color: "#000000",
        fontSize:16,
    },
    modalHeader: {
        height: 74,
        paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row',
        backgroundColor:'#F8F8F8', borderTopLeftRadius:20, borderTopRightRadius:20
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
       width:'90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    ownerName: {
        color:'#000000', fontSize:16
    },
    avatarAndName: {
        flexDirection:'row', alignItems:'center', marginTop:14.5, gap:10
        
    },
    date: {
        fontSize: 16, color: "#718096",
        marginTop:10
    },
    CheckInName: {
        fontSize: 20, color: '#000000',
        marginTop:20.5
    },
    checkedInButton: {
         justifyContent: "center", alignItems: "center", backgroundColor: "#7b5aff", width: 99, height: 32, borderRadius: 20, position:'absolute', top:14, right:14
    },
    addCheckinImage: {
        width:'100%', height:160, borderRadius:18
    },
    addedCheckIndata: {
        paddingHorizontal: 20, paddingVertical: 20, borderRadius: 20, backgroundColor: "#ffffff", elevation:1, marginTop:16
        
    },
    addcheckInHeadingText: {
        fontSize:24, color:'#000000', marginTop:34
    },
    AddCheckInButtonText: {
        color:"#ffffff", fontSize:16, 
    },
    AddCheckInButton: {
        marginTop: 44, justifyContent: "center", alignItems: "center", backgroundColor:"#7b5aff", width:112, height:32, borderRadius:20
    },
    loremSecondText: {
        color: "#ffffff", fontSize:16
    },
    loremText: {
        color: "#ffffff", fontSize: 16, marginTop:15, textAlign:'center'
    },
    hiText: {
        color:"#ffffff", fontSize:30
    },
    backgroundImageView: {
        width: '100%', height: 318, justifyContent:"center", alignItems:"center"
    },
    AddCheckInView: {
        width:'100%', height:318, marginTop:24, 
    },
    headerAvatarView: {
        justifyContent:"center", alignItems:"center", gap:6, flexDirection:'row'
    },
    logoText: {
        color:"#ffffff", fontSize:10
    },
    logoView: {
        justifyContent: "center", alignItems: 'center', height: 30, width:30, backgroundColor:'#7b5aff'
    },
    headerView: {
        width: '100%', marginTop: 12,
        height: 44, paddingHorizontal: 20,
        backgroundColor:"#ffffff", alignItems:'center', flexDirection:'row', justifyContent:'space-between', borderRadius:15, elevation:1
        
    },
    container: {
        flex: 1,
        backgroundColor: '#fefefe',
        paddingHorizontal:20

    },
})