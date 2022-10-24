
import {userModel, spanModel} from "./schemas.js"
import {finalizeGroup} from "./services/spans.js"

const updateCount = spanModel.watch([

	{

		$match:{

			$and:[

				{"updateDescription.updatedFields.time_stamp": {$exists: false}},
				{"updateDescription.updatedFields.user_count": {$exists: true}},
				{operationType: "update"}
			]
		}
	}

], {fullDocument: "updateLookup"})

const userUpdate = spanModel.watch([

	{

		$match:{

			$and:[

				{"updateDescription.updatedFields.reference_id": {$exists: false}},
				{operationType: "update"}
			]
		}
	}

], {fullDocument: "updateLookup"})


const userDeleted = userModel.watch([], {fullDocument: "updateLookup"})

export default (io)=>{


	userUpdate.on("change", (change)=>{

		const nearby = change.fullDocument.nearby
		const user_id = change.fullDocument.user_id

		io.emit("/span/refresh", {user_id: user_id}).to(nearby)
	})

	userDeleted.on("change", (change)=>{

		if(change.operationType == "deleted"){

			const nearby = change.fullDocument.nearby
			const user_id = change.fullDocument.user_id

			io.emit("/span/refresh", {refresh_flag: true, user_id: user_id}).to(nearby)
		}
	})

	updateCount.on("change", async(change)=>{

		const new_count = change.updateDescription.updatedFields.user_count
		const reference_id = change.fullDocument.span_id
		const last_user = change.fullDocument.last_user

		if(new_count <= 0){

			const {bounds, time_stamp, next_iteration} = await finalizeGroup(reference_id)

			io.emit('/span/next', {bounds: bounds, time_stamp: time_stamp, last_user: last_user, iteration: next_iteration}).to(reference_id)
			
			await removeFromGroup(last_user, reference_id, true)
		}

		io.emit('/span/user_count', {user_count: new_count}).to(reference_id)
	})

}