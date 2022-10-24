import {NavigationContainer} from "@react-navigation/native"
import {createDrawerNavigator} from "@react-navigation/drawer"
import {View, SafeAreaView, TouchableOpacity} from "react-native";
import React, { Component } from 'react'
import styles from "./Discover.styles"

export default class Discover extends Component{




  constructor(props){

    super(props)
  }

  componentDidMount(){

    this.props.navigation.addListener('focus', ()=>{

        const err = this.props.route.params.err_msg
   
        console.log(this.props.route.params.err_msg)
    
        if(err != null){

          alert(err)

        }

    })
  }

  toCamera(){

    this.props.navigation.navigate({name:"Camera"})
  }

  render(){

    return(

      <SafeAreaView style={{flex:1, backgroundColor:"black"}}>

        <View style={styles.bottom_container}>
              
          <TouchableOpacity style={styles.create_button} onPress={this.toCamera.bind(this)}>

          </TouchableOpacity>

        </View>

      </SafeAreaView>

    );

  }

}