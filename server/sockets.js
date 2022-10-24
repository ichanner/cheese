
import config from "./config.js"
import fs from "fs"
import {updateReference, rejoinSpan, removeFromGroup, isNearby, finalizeGroup, createUser, handleDisconnect} from "./services/spans.js"
import {span_res, upload_res} from "./responses.js"

export default (socket)=>{

	socket.on("disconnecting", async(reason)=>{
		
		try{

			console.log("Socket disconnected reason: " + reason)

			await handleDisconnect(socket.id)
		}
		catch(e){

			socket.disconnect()

			throw new Error(e.message)
		}
	})

	socket.on("/span/connect", async(callback)=>{

		try{

			const user_id = socket.id

			console.log("SOCKET CONNECTED " + user_id)

			await createUser(user_id)

			callback({user_id: user_id})
		}
		catch(e){

			socket.disconnect()

			throw new Error(e.message)
		}
	
	})

	socket.on("/span/exit", async(payload, callback)=>{

		try{	
			
			socket.leave(payload.reference_id)

			callback()
		}
		catch(e){

			socket.disconnect()

			throw new Error(e.message)
		}
	})

	socket.on("/span/rejoin", async(payload, callback)=>{

		try{

			const {err} = await rejoinSpan(payload.reference_id, payload.user_id)

			callback({err_code: err})
		}
		catch(e){

			socket.disconnect()

			throw new Error(e.message);
		}

	})

	socket.on("/span/update", async(payload, callback)=>{

		try{

			const user_id = payload.user_id
			const coords = payload.coords

			if(payload.reference_id != null){

				socket.to(payload.reference_id).emit("/span/send_coords", {user_id: user_id, coords: coords})
			}

			const {reference_id, time_stamp, users_to_add, err_code, iteration} = await updateReference(
					
					payload.reference_id, 
					user_id, 
					coords, 
					payload.iteration
				); 

			if(err_code==null){

				if(socket.rooms.size == 0 ) {

					socket.join(reference_id) 
				}

				if(time_stamp!=null){

					if(users.length > 0){

						socket.io.to(users_to_add).emit("/span/add_to", {reference_id: referenece_id, time_stamp: time_stamp})
					}

					callback(span_res(null, reference_id, iteration, time_stamp))
				}
				else{

					callback(span_res(null))
				}
			}
			else{
				
				await removeFromGroup(user_id, reference_id)

				callback(span_res(err_code))
			}
		}
		catch(e){

			socket.disconnect()

			console.log(e)

			throw new Error(e);
		}

	})



	socket.on("/span/upload", async(payload, callback)=>{

	    try{
		
			const user_id = payload.user_id
			const reference_id = payload.reference_id
			const coords = payload.coords
			const iteration = payload.iteratation //TODO: make it safer	
			const file = payload.file
		
			const err = await isNearby(reference_id, user_id, coords)

			if(err==null){

				const path = await processUpload(user_id, reference_id, coords, file, iteratation)

				if(path != null){

					socket.emit("/span/preview", {path: path, user_id: user_id}).to(reference_id)

					callback(upload_res(null, path))
				}
				else{

					await removeFromGroup(user_id, reference_id)

					callback(upload_res(config.expired))
				}	
			}
			else{

				await removeFromGroup(user_id, reference_id)
			
				callback(upload_res(err))
			}
			
		}
		catch(e) {

			socket.disconnect()

			throw new Error(e.message);
		}
	})
}
