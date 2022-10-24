import React, { Component } from 'react';
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {View} from "react-native";
import {Provider} from 'react-redux'
//import {Signup} from "./containers/Signup.js"
import Discover from "./containers/Discover.js"
import Capture from "./containers/Capture.js"
//import {Preview} from "./containers/Preview.js"
import store from "./store/index"
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator()

export default function App() {
  
  const router_options = {headerShown:false}

  return (

    <Provider store={store}>

        <NavigationContainer>

            <View style={{flex:1}}>

              <Stack.Navigator>

               <Stack.Screen name="Discover" component={gestureHandlerRootHOC(Discover)} initialParams={{err_msg: null}} options={router_options}/>

                <Stack.Screen name="Camera" component={gestureHandlerRootHOC(Capture)} options={router_options}/>
     
              </Stack.Navigator>

            </View>

        </NavigationContainer>

    </Provider>

 
  );

}


/*

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Camera, useCameraDevices, checkCameraPermission } from 'react-native-vision-camera';

   "plugins": [
      [
        "@viro-community/react-viro",
        {
          "androidXrMode": ["AR", "OVR_MOBILE"]
        }
      ]

    ],


const SystemCamera = () => {



    const devices = useCameraDevices();
    const device = devices.back;

    const [isCameraInitialized, setIsCameraInitialized] = useState(false);

    let cameraRef = useRef(null);


    const onCameraInitialized = useCallback(() => {
        setIsCameraInitialized(true);
    }, []);

 

    if (device == null) return;
    return (
    
                <View style={{ flex: 1 }}>
                    <Camera
                        hdr={true}
                        photo={true}
                        ref={cameraRef}
                        isActive={true}
                        focusable={true}
                        enableZoomGesture={true}
                        device={device}
                        onInitialized={onCameraInitialized}
                    >
                     
                    </Camera>
                </View>
           
    )
}

export default SystemCamera;
*/