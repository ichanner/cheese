import {SET_USER_ID, INSERT_PREVIEW, SET_SPAN, SET_SPAN_ERROR, SET_NEXT_SPAN, UPDATE_USER_COUNT, UPLOAD_PREVIEW, SET_PREVIEW,SET_ITERATION, UPDATE_SPAN, EXIT_SPAN} from "./types"


export const setIteration = (iteration) =>{

	return (dispatch)=>{

		dispatch({type: SET_ITERATION, payload: iteration})
	}
}



export const updateSpan = (reference_id, user_id, coords, iteration) =>{

	return (dispatch)=>{

		dispatch({type: UPDATE_SPAN, payload: {reference_id: reference_id, user_id: user_id, coords: coords, iteration: iteration}})
	}
}

export const exitSpan = (reference_id) =>{

	return(dispatch)=>{

		dispatch({type: EXIT_SPAN, payload:{reference_id:reference_id}})
	}
}

export const uploadPreview = (reference_id, user_id, coords, iteration, file) =>{

	return(dispatch)=>{

		dispatch({type: UPLOAD_PREVIEW, payload:{reference_id: reference_id, user_id: user_id, coords: coords, file: file}})
	}
}

export const setUserId = (user_id) =>{

	return {type: SET_USER_ID, payload: user_id}
}

export const insertPreview = (path, user_id) =>{

	return {type: INSERT_PREVIEW, payload:{path: path, user_id: user_id}}
}

export const setSpan = (reference_id, time_stamp) =>{

	return {type: SET_SPAN, payload:{reference_id: reference_id, time_stamp: time_stamp}}
}

export const setSpanError = (err) =>{

	return {type: SET_SPAN_ERROR, payload: err}
}

export const setNextSpan = (bounds, time_stamp, last_user) =>{

	return {type: SET_NEXT_SPAN, payload:{bounds: bounds, time_stamp: time_stamp, last_user: last_user}}
}

export const updateUserCount = (new_count) =>{

	return {type: UPDATE_USER_COUNT, payload: new_count}
}

export const setPreview = (path) =>{

	return {type: SET_PREVIEW, payload: path}
}
