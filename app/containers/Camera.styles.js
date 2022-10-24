import {StyleSheet, Dimensions} from "react-native"

const styles = StyleSheet.create({
  
  loading_container:{

    flex:1,
    flexDirection: "row",
    justifyContent: "center"
  },

  container: {
    
    flex: 1,
    backgroundColor: 'black'
  },

  preview:{

    flex: 1
  },

  count:{

    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center"

  },

  top_container:{

    flex:1,
    flexDirection: "column",
    flexWrap: "wrap"

  },

  top_right_container:{
    
    padding:25,
    alignItems: "flex-start",
    justifyContent: "flex-end"
  },

  close:{
  
    padding:25
  
  },

  bottom_container: {
    
    flex:1,
    justifyContent: "flex-end",
    alignItems:"center",
  },

  capture_button:{

    padding:30
  },

  info_box:{

    backgroundColor: 'rgba(50,50,50,0.5)',
    borderRadius:20,
    horizontalPadding:20,
    padding:10,
    marginBottom:100
  },

  info_text:{
    
    fontSize: 20,
  },

  zoom_slider:{

    transform:[{rotate:'270deg'}],
    right:-(Dimensions.get("window").width/2)+10
  },

  flip:{
    
    paddingTop: 15
  },

  flash:{

    paddingTop:15
  }


});

export default styles









/*

  capture_button:{

    backgroundColor: "#fff",
    borderRadius: 60,
    padding: 40,
    horizontalPadding: 50,
    margin: 20  
  },

*/