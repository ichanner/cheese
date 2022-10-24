export const media_res = (reference_id, user_id, coords, path, iteratation) =>{

	return {

	    span_id: reference_id,
		user_id: user_id, 
		coords: coords, 
		media_path: path,
		iteration: iteration
	};
}

export const upload_res = (err_code, path=null) =>{

	return{

		err_code: err_code,
		path: path
	};
}

export const span_res = (err_code, reference_id=null, iteration=null, time_stamp=null) => {

	return{

		err_code: err_code,
		reference_id: reference_id,
		iteration: iteration,
		time_stamp: time_stamp
	};
}