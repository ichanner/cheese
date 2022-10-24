
import {SET_USER_ID, INSERT_PREVIEW, SET_SPAN, SET_SPAN_ERROR, SET_NEXT_SPAN, UPDATE_USER_COUNT, SET_ITERATION, SET_PREVIEW,UPDATE_SPAN, EXIT_SPAN} from "./types"
import config from "../../config.js"

const initialState = {

	error: 0,
	previews: [],
	localPreview: null,
	user_id: null,
	reference_id: null,
	user_count: 0,
	time_stamp: null,
	last_user: null,
	bounds:[],
	iteration: 0,  //unsafe
	coordinates: null
	//nearby_users:[]
}

const spanReducer = (state=initialState, action) =>{


	switch(action.type){

		case SET_USER_ID:

			return{

				...state,
				user_id: action.payload
			}

			break;

		case SET_SPAN:

			return {

				...state,
				time_stamp: time_stamp,
				reference_id: reference_id,
				error: null
			}

			break;

		case INSERT_PREVIEW:

			if(state.user_id != action.payload.user_id){

				return{

					...state,
					previews: [...state.previews, action.payload.path]
				}
			}

			break;

		case SET_SPAN_ERROR:
  			
  			let err = action.payload

  			if(err == config.too_far || err == config.outside_of_ring){

  				return{

  					...state,
  					error: action.payload,
  					reference_id: null
  				}
  			}
  			else if(err == config.expired){

  				return {

					error: action.payload,
					previews: [],
					localPreview: null,
					user_id: null,
					reference_id: null,
					user_count: 0,
					time_stamp: null,
					last_user: null,
					bounds:[],
					iteration: 0, 
					coordinates: {}
				}
  			}
  			else{

  				return {

					...state,
					error: action.payload
				}
  			}

			break;

		case SET_NEXT_SPAN:


			if(state.user_id != action.payload.last_user){

				return {

					...state,
					time_stamp: action.payload.time_stamp,
					bounds: [action.payload.bounds]
				}
			}	
			else{

				return{

					...state,
					last_user: action.payload.last_user
				}
			}

			break;

		case UPDATE_USER_COUNT:

			return{

				...state,
				user_count: action.payload
			}

			break;

		case SET_ITERATION:

			return {

				...state,
				iteration: action.payload
			}

			break;

		case SET_PREVIEW:

			return{

				...state,
				localPreview: action.payload
			}

			break;

		case EXIT_SPAN:

			return{

				error: null,
				previews: [],
				localPreview: null,
				user_id: null,
				reference_id: null,
				user_count: 0,
				time_stamp: null,
				last_user: null,
				bounds: [],
				iteration: 0, 
				coordinates: null
			}

			break;

		case UPDATE_SPAN:

			return {

				...state,
				coordinates: action.payload.coords
			}

			break;

		default:

			return state;

			break;
	}
}

export default spanReducer;
