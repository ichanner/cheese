import dotenv from "dotenv"

const env = dotenv.config()

if(env.error){

	throw new Error("ENV file not found")
}

const config = {

	api_prefix: "/",
	upload_prefix: "/content",

	port: process.env.PORT,

	db_uri: process.env.DB_URI,

	db_options:{

		useNewUrlParser: true,
		useUnifiedTopology: true
	},

	//Errors:

	too_far: 0, //reference id is set to null
	outside_of_ring: 1, //reference id is set to null
	not_allowed_in_ring: 2, //just a message
	expired: 3, //same thing as leaving group	

	//Privacy levels:

	deleted: -1,
	private: 0,
	no_map: 1,
	public: 2,

 	upload_path: "/uploads",
 	upload_limit: 3e+7, //30 mb
 	expiry_offset: 10, //15 secs
 	expiry_threshold: 10,
	max_distance: 6, //in meters
	dist_limit: 4829, //3 miles (human eye limitation)
	min_users: 2
}

export default config