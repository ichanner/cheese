import {CONNECT_WS, DISCONNECT_WS, ERROR_WS, EVENT_WS, SET_CONNECTED} from "./types";

export const connectWS = (host) =>{

	return (dispatch)=>{

		dispatch({type: CONNECT_WS, payload: host})
	}	
}

export const disconnectWS = () =>{

	return (dispatch)=>{

		dispatch({type: DISCONNECT_WS})
	}	
}

export const errorWS = () =>{

	return {type: ERROR_WS};
}

export const setConnected = (connected) =>{

	return {type: SET_CONNECTED, payload: connected}
}
