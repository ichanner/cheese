import mongoose from "mongoose"
import {v4} from "uuid"

const Schema = mongoose.Schema


const processSchema = new Schema({

	users: {type: [String], default: []},
	process_id: {type: String}
})

const savedGroupSchema = new Schema({

	span_id: {type: String, default: v4(), index: "text"},
	iterations: {type: Number, default: 0},
	is_private: {type: Boolean, default: false},
	points: {type: [Object], default: []},
	users: {type: [String], default:[]},
	coords: {type: [Number], index: "2dsphere"},
})

const spanSchema = new Schema({

	span_id: {type: String, default: v4(), index: "text"},
	iteration: {type: Number, default: 0}, //current iteration
	users:{type: [String], default: []}, //list of user ids
	user_count: {type: Number, default: 0}, 
	last_user: {type: String, default: null},
	last_timestamp: {type: Number, default: null},
	points: {type: [Object], default: []}, //list of media
	old_points: {type: [Object], default: []},
	time_stamp: {type: Number, default: null}, //expiry
	coords: {type: [Number], index: "2dsphere"}, //center
	date: {type: Date, default: Date.now}
	
})

const userSchema = new Schema({

	user_id: {type: String, required: true, index: "text"},
	coords: {type: [Number], default: [null, null], index: "2dsphere"},
	reference_id: {type: String, default: null, index: "text"},
	iteration: {type: Number, default: 0},
	date: {type: Date, default: Date.now}
})


const accountSchema = new Schema({

	user_id: {type: String, default: v4()},
	user_name: {type: String, required: true},
	user_pfp: {type: String, default: "/uploads/resources/default.jpg"},
	//user_score: {type: Number, default: 0},
	//user_spans: {type: [String], default: []}
	//user_notify_queue: {type: [String], default: []},
})

export const savedGroupModel = mongoose.model("SavedGroup", savedGroupSchema, "saved_groups")
export const accountModel = mongoose.model("Account", accountSchema, "accounts")
export const spanModel = mongoose.model("Span", spanSchema, "spans")
export const userModel = mongoose.model("User", userSchema, "users")
export const processModel = mongoose.model("Process", processSchema, "processes")