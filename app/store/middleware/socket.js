import {CONNECT_WS, DISCONNECT_WS} from "../socket/types"
import {UPDATE_SPAN, EXIT_SPAN, UPLOAD_PREVIEW} from "../span/types"
import {io} from "socket.io-client"
import {setConnected, errorWS, connectWS} from "../socket/actions"
import {setUserId, setSpan, setSpanError, insertPreview, setPreview, setNextSpan, updateUserCount} from "../span/actions"
import config from "../../config.js"

var socket;

const onConnect = (store)=>{

	socket.emit("/span/connect", async(data)=>{

		try{

			store.dispatch(setUserId(data.user_id))
		}
		catch(e){

			throw e;
		}
	});
	
	store.dispatch(setConnected(true))
}

const onDisconnect = (store, host, reason)=>{

	console.log("DISCONNECT")

	if(reason == "io server disconnect"){
		
		store.dispatch(connectWS(host))	
	}		
	else{

	 	store.dispatch(setConnected(false))	
	}
}

const onError = (store) =>{

	console.log("SOCKET ERROR")
	
	store.dispatch(errorWS());
}

const refresh = (reference_id=null, iteration=null) =>{

    const state = store.getState().span

    reference_id =  reference_id == null ? state.reference_id : reference_id
	iteration = iteration == null ? state.iteration : iteration
	
	const user_id = state.user_id
	const coords = state.coordinates

	socket.emit("/span/update", {user_id: user_id, reference_id: reference_id, coords: coords, iteration: iteration}, async(data)=>{

		try{

			if(data.err_code==null){

				if(data.time_stamp==null){

					store.dispatch(setSpan(data.reference_id, data.time_stamp))
				}
			}				
			else{

				store.dispatch(setSpanError(data.err_code))
			}
		}
		catch(e){

			throw e;
		}
	})
}

const onEvent = (store) =>{

	return (event, data)=>{

		switch(event){

	 		case "/span/add_to": 

				store.dispatch(setSpan(data.reference_id, data.time_stamp))
				
				refresh(data.reference_id, data.iteration)
				
				break;

			case "/span/preview":

				store.dispatch(insertPreview(data.path, data.user_id))
				
				break;

			case "/span/next":

				store.dispatch(setNexSpan(data.bounds,data.time_stamp,data.last_user))
				
				break;

			case "/span/rejoin":

				if(data.err_code!=null){

					store.dispatch(setSpanError(data.err_code))
				}

				break;

			case "/span/user_count":

				store.dispatch(updateUserCount(data.new_count))

			case "/span/refresh":

				refresh()

				//store.dispatch(removeNearby(data.user_id))

				break;

			case "/span/send_coords":

				//store.dispatch(insertCoords(data.coords, data.user_id))				

				break;

			default:

				break;
			
		}
	}
	
}

const wsMiddleware = store => next => action =>{

	switch(action.type){

		case CONNECT_WS:

			console.log(action.payload)

			if(socket != null){

				socket.disconnect();
			}

			socket = io(action.payload, {

				forceNew: true,
				transports:["websocket"],
				connect_timeout: config.connection_timeout
			})

			console.log(action.payload)
			
			socket.on("connect",  ()=>{onConnect(store)});
			socket.on("disconnect", (reason)=>{onDisconnect(store, action.payload, reason)});
			//socket.on("connect_failed", ()=>{onError(store)});
			socket.on("connect_error", ()=>{onError(store)});
			socket.onAny(()=>{onEvent(store)});

			break;	

		case DISCONNECT_WS:

			if(socket!=null)socket.disconnect()
			
			socket = null;

			break;

		case UPDATE_SPAN:

			socket.emit("/span/update", action.payload, async(data)=>{

				try{

					console.log(data)

					if(data.err_code==null){

						if(data.time_stamp==null){

							store.dispatch(setSpan(data.reference_id, data.time_stamp))
						}
					}				
					else{

						store.dispatch(setSpanError(data.err_code))
					}

				}
				catch(e){

					throw e;
				}
			})
			

			return next(action)

			break;


		case UPLOAD_PREVIEW:

			socket.emit("/span/upload", action.payload, async(data)=>{

				try{

					if(data.err_code != null){

						store.dispatch(setSpanError(data.err_code))
					}
					else{

						store.dispatch(setPreview(data.path))
					}
				}
				catch(e){

					throw e;
				}
			})

			break;

		case EXIT_SPAN:

			socket.emit("/span/exit", action.payload, ()=>{

				socket.disconnect()
			})
		
			return next(action)

			break;

		default:

			return next(action)

			break;
	}
}

export default wsMiddleware;
