import {CONNECT_WS, DISCONNECT_WS, ERROR_WS, EVENT_WS, SET_CONNECTED} from "./types";

initialState = {

	connected: false,
	connection_error: false
}

const socketReducer = (state=initialState, action) =>{

	switch(action.type){

		case SET_CONNECTED:

			return {

				...state,
				connected: action.payload,
				connection_error: (action.payload ? false : state.connection_error)
			}

			break;

		case DISCONNECT_WS:

			return{

				...state,
				connection_error: false,
				connected: false
			}

			break;

		case ERROR_WS:

			return {

				...state,
				connection_error: true
			}

			break;

		default:

			return state;

			break;
	}
}

export default socketReducer;