import React, {Component, useState} from "react"
import {connect} from "react-redux"
import {Camera, CameraType, FlashMode} from "expo-camera"
import * as Location from "expo-location"
import * as TaskManager from "expo-task-manager"
import {Feather, MaterialIcons, Ionicons, AntDesign} from '@expo/vector-icons'
import CircularProgress from "@ichanner8/react-native-circular-progress-indicator"
import {PanGestureHandler, LongPressGestureHandler, Gesture, State, GestureHandlerRootView} from "react-native-gesture-handler"
import {TouchableOpacity, Dimensions, Image, ImageBackground, Animated, View, Text, ActivityIndicator, Platform, SafeAreaView} from "react-native"
import styles from "./Camera.styles.js"
import {connectWS, disconnectWS} from "../store/socket/actions"
import {setUserCount, updateSpan, exitSpan} from "../store/span/actions"
import config from "../config.js"
import {interpolate, Extrapolate} from "react-native-reanimated"
import Slider from "@react-native-community/slider"


//TODO:


//Send file
//Display media in background
//Delete button

//go to next page with all preiviews 
//map spans


const Camera_ = Animated.createAnimatedComponent(Camera)
const Icon = Animated.createAnimatedComponent(MaterialIcons)
const LOCATION_TASK_NAME = config.location_task_name

class Capture extends Component{

	constructor(props){

		super(props)

		this.rotate_icon_val = new Animated.Value(0);
    this.camera = null;
    this.progress = React.createRef()
    this.timer = null
    

    this.startY = 0;
    this.offsetY = Dimensions.get("window").height
    
    this.width = Dimensions.get("window").width
    this.height = Dimensions.get("window").height

    console.log(this.width)

		this.state = {

      camera_uri: null,
			camera_type: CameraType.back,
			camera_ready: false,
			flash: FlashMode.off,
			flash_icon: "md-flash-off-outline",
      media_uri: null,
      image_padding: 0,
      ratio: "4:3",
      zoom:0,
      recording: false
		}
	}

	async componentDidMount(){


    //Handle Camera Perms
    await this.requestCameraPermissions()
    await this.initServer();

    await this.initLocationUpdates()

	}

  async componentWillUnmount(){

    console.log("Unmounted")
   
    clearInterval(this.timer)
   
    this.props.exitSpan(this.props.reference_id)
   
    await Location.stopLocationUpdatesAsync(config.location_task_name);
  }

  componentDidUpdate(prevProps){

    if(this.props != prevProps){

      this.updateTimer(prevProps)
      this.updateError(prevProps)
    }
    
  }

  updateError(prevProps){

    if(this.props.error != prevProps.error){

       if(this.props.error == config.expired){

          this.close("Group has expired")
       }
    }

    if(this.props.connection_error != prevProps.connection_error){

        if(this.props.connection_error==true){

            alert("Unable to connect") //add retry button
        }
    }
  }

  updateTimer(prevProps){

    if(this.props.time_stamp != null && prevProps.time_stamp == null){

      this.timer = setInterval(()=>{

          const date = new Date()
          const timer = Math.round((nextProps.time_stamp - data.getTime())/1000)

          this.setState({timer: timer})

      },1000);
    
    }
    if(this.state.timer <= 0){

        this.close(true)
    }
  }

  async recordVideo(nativeEvent){
   
    this.progress.play()

    this.setState({recording:true})

    const {uri} = await this.camera.recordAsync({maxDuration: config.max_duration})

    this.setState({media_uri: uri})
   
 }


 stopRecording(){

    this.setState({recording:false})

    this.progress.reAnimate()

    this.camera.stopRecording()
 }

  async takePicture(){

    const {uri} = await this.camera.takePictureAsync()

     this.setState({media_uri: uri})
  }

  async close(err=null){


    this.props.navigation.navigate({name:"Discover", params:{err_msg: err==null ? null : err}})
    
  }

	flipCamera(){

    Animated.timing(this.rotate_icon_val, {toValue: 1, duration: 1000, useNativeDriver: true}).start(()=>{

       this.rotate_icon_val = new Animated.Value(0)
    })
	
		this.setState({camera_type: (this.state.camera_type == CameraType.back) ? CameraType.front : CameraType.back});
	}


	toggleFlash(){

		if(this.state.flash == FlashMode.on){

			this.setState({flash: FlashMode.off, flash_icon: "md-flash-off-outline"})
		}
		else{

			this.setState({flash: FlashMode.on, flash_icon: "md-flash-outline"})
		}
	}

  initZoom(event){
     

    const nativeEvent = event.nativeEvent

    if(nativeEvent.state == State.BEGAN){

        this.startY = nativeEvent.absoluteY

        let offset = this.startY - (this.startY * 0.7)

        this.offsetY = interpolate(this.state.zoom, [0, 1], [0, offset], Extrapolate.CLAMP)
    }
  }

  updateZoom(event){
      
      const nativeEvent = event.nativeEvent

      if(nativeEvent.state == State.ACTIVE){

        let offset = this.startY * 0.7

        let zoom = interpolate((nativeEvent.absoluteY-this.offsetY), [offset, this.startY], [1, 0], Extrapolate.CLAMP)

        this.setState({zoom: zoom})
        
      }
  }

  async requestCameraPermissions(){

    await Camera.requestCameraPermissionsAsync()

    const {status} = await Camera.getCameraPermissionsAsync();

    if(status !== 'granted'){

      this.close()
    }
  }

	async initializeCamera(){

		this.setState({camera_ready: true})

    //aspect ratio patch
		
    if(Platform.OS == 'android'){

        var supportedRatios = await this.camera.getSupportedRatiosAsync();

        var aspectRatio = this.height/this.width

        var max = null
        var bestAspectRatio = "4:3"
        var ratioNumber = 4/3

        for(var ratio of supportedRatios){

           let sizes = ratio.split(":")
           let newRatio = (parseInt(sizes[0])/parseInt(sizes[1]))
           let difference = aspectRatio-newRatio

           if(max == null){

              max = difference
           }
           else if(difference >= 0 && difference < max){

              max = difference
              bestAspectRatio = ratio
              ratioNumber = newRatio
           }
        }

        let padding = Math.floor((this.height - ratioNumber * this.width)/2)/2

        console.log("ANDROID BEST ASPECT RATIO: " + bestAspectRatio)

        this.setState({padding: padding, ratio: bestAspectRatio})
    }
  }

  async initServer(){

    try{

      this.props.connectWS(config.domain)
    }
    catch(e){

      throw new Error(e)
    }
  }

  async initLocationUpdates(){

    try{

      const {status} = await Location.requestForegroundPermissionsAsync()

      if(status === 'granted'){

        await Location.enableNetworkProviderAsync();

        await this.getCurrentLocation() //get first location

        TaskManager.defineTask(LOCATION_TASK_NAME, async({data, err})=>{

            if(err) throw new Error(err)

            console.log("TASK CALLED")

            let coords = data['locations'][0].coords

            if(coords.accuracy > config.acccuracy_threshold){
                
                console.log("LOCATION FAILED WITH ACCURACY : " + coords.accuracy)
                
                await this.getCurrentLocation()

            }
            else{

                this.props.updateSpan(this.props.reference_id, this.props.user_id, [coords.latitude, coords.longitude], this.props.iteration)
            }
        })

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {

            accuracy: Location.Accuracy.BestForNavigation,
            deferredUpdatesDistance: this.props.coordinates==null ? 0 : config.dist_interval,
            deferredUpdatesInterval: this.props.coordinates==null ? 0 : config.update_interval,
            foregroundService: {          
              
              notificationTitle: "Location",
              notificationBody: "Fetching Location..."
            }
        })

      }
      else{

        this.close();
      }
   }
   catch(e){

     throw new Error(e.message)
   }
  }

  async getCurrentLocation(setState=true){

    try{

      const location = await Location.getCurrentPositionAsync({

        accuracy: Location.Accuracy.BestForNavigation
     
      });

      let coords = location.coords

      if(coords.accuracy < config.acccuracy_threshold){

          if(setState){

             this.props.updateSpan(this.props.reference_id, this.props.user_id, [coords.latitude, coords.longitude], this.props.iteration)
          }
          else{

            return coords
          }
      }
      else{

        if(setState==false){

          if(this.props.coordinates != null){

            return this.props.coordinates
          }
          else{

            alert("Unable to determine orientation")
          }
        }
      }  
    
    }
    catch(e){

      throw new Error(e)
    }
  
  }


  getInfoBox(){

    if(this.props.error != null){

      return(

          <View style={styles.info_box}>
              
              <Text style={[styles.info_text, {color:"white"}]}> {config.error_messages[this.props.error]} </Text>
              
          </View>
      )
    }
    else if(this.state.timer <= 10){

      return(

        <View style={styles.info_box}> 

            <Text style={[styles.info_text, {color: ((this.state.timer<=3) ? "red" : "white")}]}> {this.state.timer +" Seconds Left"} </Text>

        </View>
      )
    }
    else{

        null;
    }

  }

  getCaptureButton(){

    if(this.props.error == null && this.props.coordinates != null){

      return(
        
        <TouchableOpacity style={styles.capture_button}  onLongPress={this.recordVideo.bind(this)} onPressOut={this.stopRecording.bind(this)} onPress={this.takePicture.bind(this)}>

            <CircularProgress ref={(progress)=>{this.progress=progress}} progressValueFontSize={1}  startPaused={true} initialValue={0} value={100} circleBackgroundColor={'white'} duration={10000} radius={50} activeStrokeColor={this.state.recording ? "red" : "white"} onAnimationComplete={()=>this.stopRecording()}/>

        </TouchableOpacity>
     
      );
    }
    else if(this.props.coordinates == null){

      return(

        <ActivityIndicator style={{marginBottom: 100}} size="large"/>
      )
    }
    else{

      return null
    }
  }

	render(){	

    if(this.props.user_id == null){

      return (

        <View style={styles.loading_container}>
            
            <ActivityIndicator size="large"/>

        </View>
      )
    }
    else{

        return(

          <SafeAreaView style={styles.container}>

          <PanGestureHandler onHandlerStateChange={this.initZoom.bind(this)} onGestureEvent={this.updateZoom.bind(this)}>

           <Camera_ ref={(camera)=>this.camera=camera} ratio={this.state.ratio} flashMode={this.state.flash} zoom={this.state.zoom} style={[styles.preview, {topMargin: this.state.padding, bottomMargin: this.state.padding}]} onCameraReady={()=>this.initializeCamera()} type={this.state.camera_type}>
              

              <View style={styles.top_container}>

                <TouchableOpacity style={styles.close} onPress={()=>{this.close()}}>
                
                  <AntDesign size={38} name="close" color="white" />
                  
                </TouchableOpacity> 

                <View style={styles.top_right_container}>

                  <Feather size={38} name="users" color="white" />

                  <Text style={[styles.count, {color:(this.props.user_count >= 3 ? "white" : "red")}]}> {this.props.user_count} </Text>

                  <View  style={styles.flip}>
              
                      <TouchableOpacity  onPress={this.flipCamera.bind(this)}>
                      
                          <Icon size={38} name="flip-camera-android" color="white"  style={{   

                            transform: [

                                {
                                  rotateZ: this.rotate_icon_val.interpolate({inputRange:[0,1], outputRange:["0deg", "360deg"]})
                                }
                            ]
                          
                          }}/>

                      </TouchableOpacity>

                  </View>

                  
                  <TouchableOpacity style={styles.flash} onPress={this.toggleFlash.bind(this)}>
                  
                    <Ionicons size={38} name={this.state.flash_icon} color="white" />
                    
                  </TouchableOpacity>

                </View>


              </View>


              {this.state.zoom != 0 ? <Slider style={styles.zoom_slider} thumbTintColor={"white"} maximumTrackTintColor={"white"} minimumTrackTintColor={"white"} value={this.state.zoom} onSlidingComplete={(zoom)=>{this.setState({zoom:zoom})}}></Slider> : null} 
                      

              <View style={styles.bottom_container}>

                {this.getInfoBox()}
                {this.getCaptureButton()}

              </View>

           </Camera_> 

           </PanGestureHandler>

          </SafeAreaView>

        );
    }

	}
	
}

const mapStateToProps = (state) =>{

	return {

    error: state.span.error,
		connected: state.socket.connected,
    connection_error: state.socket.connection_error,
    user_count: state.span.user_count,
    user_id: state.span.user_id,
    iteration: state.span.iteration,
    reference_id: state.span.reference_id,
    coordinates: state.span.coordinates //most recent and accurate coords
	}
}

const mapDispatchToProps = {

	connectWS,
  disconnectWS,
  updateSpan,
  exitSpan
}


export default connect(mapStateToProps, mapDispatchToProps)(Capture)
