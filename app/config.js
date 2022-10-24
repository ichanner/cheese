const config = {


	domain: "http://10.0.0.36:3000/",
	connection_timeout: 5000, //(miliseconds, 5 secs)
	dist_interval: 0,//0.6096, //(2 feet)
	update_interval: 0, //5000,
	acccuracy_threshold: 6,
	max_location_updates: 200,
	location_task_name: "background-location-task",

	//Errors:
	error_messages: ["Get closer to two or more people", "You're outside the bounds", "Not allowed here", "Expired"],
	too_far: 0, //reference id is set to null
	outside_of_ring: 1, //reference id is set to null
	not_allowed_in_ring: 2, //just a message
	expired: 3 //same thing as leaving group
}

export default config