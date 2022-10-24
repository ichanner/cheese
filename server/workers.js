import workerpool from "workerpool"
import config from "./config.js"
import * as turf from '@turf/turf'


function test(a){

	return a;
}

function extractCoords(obj){

	let list = []

	for(let i = 0; i < obj.length; i++){

		list.push(obj[i].coords) 
	}

	return list
}

function swapPoints(points, a, b){

	let val = points[a]
	points[a] = points[b]
	points[b] = val

	return points
}

function removeOverlap(newPoints, otherSpans){

	newPoints = extractCoords(newPoints)

	let toRemove = []

	let polygon = turf.polygon(newPoints, {})

	for(let i; i < otherSpans.length; i++){

		let reference_id = otherSpans[i].span_id
		let coords = otherSpans[i].points.coords
		let inside = turf.pointsWithinPolygon(coords, polygon)

		if(inside.length >= otherSpans[i].points.length/2){

			toRemove.push(reference_id)
		}
	}	

	return toRemove
}


function closeGroup(points){
	
	let lowest = points[0].coords[0]

	let centered = []

	for(let i = 1; i < points.length; i++){

		centered.push(points[i].coords)

		if(points[i].coords[0] < lowest){

			lowest = points[i].coords[0]

			points = swap(points, 0, i)
		}
		else if(points[i].coords[0] == lowest){

			if(points[i].coords[1] < points[0].coords[1]){

				points = swap(points, 0, i)
			}
		}
	}

	let centroid = turf.centroid(centered) 

	let initialPoint = points[0]

	points.shift()

	points.sort((a,b)=>{

		let val = (turf.bearing(initialPoint.coords, a.coords) - turf.bearing(initialPoint.coords, b.coords))

		if(val==0){

			if(turf.distance(initialPoint.coords, a.coords) <= turf.distance(initialPoint.coords, b.coords)){

				return -1;
			}
			else{

				return 1;
			}
		}
		else if(val>0){

			return 1;
		}
		else{

			return -1;
		}

	})

	points.splice(0, 0, initialPoint.coords)

	points.push(initialPoint.coords) //close polygon

	return {points, centroid}
}

function isPointInside(point, points){

	let new_points = extractCoords(points)

	const inside = turf.pointsWithinPolygon(point, new_points)

	return (inside.length > 0) 
}

function sortClusters(points, user_id, iteration, coords){
	
	let newPoints = []

	for(let point of points){

		newPoints.push(turf.point(point.coords, 
		{
			 iteration: point.iteration, 
			 user_id: point.user_id,
			 reference_id: point.reference_id
		}))
	}
	
	let collection = turf.featureCollection(newPoints); 
	let clustered = turf.clustersDbscan(collection, config.max_distance, {units: "meters"})
	
	let cluster = null;
	let cluster_reference_id = null
	let cluster_iteration = 0 
	let cluster_users_to_add = []
			
	for(let i = 0; i < clustered.features.length; i++){ //loop through all clusters

		var data = clustered.features[i].properties

		if(data.user_id == user_id){ //Identify user's cluster

			cluster = clustered.features[i].properties.cluster

			if(cluster !== undefined){

				for(let j = 0;  j < clustered.features.length; j++){

					if(clustered.features[j].properties.cluster == cluster){ //find other users with the same cluster and their corresponding group id

						data = clustered.features[j].properties

						if(data.iteration > iteration) continue

						
					 
						cluster_reference_id = data.reference_id
						cluster_iteration = data.iteration

						if(cluster_reference_id == null && iteration == 0) cluster_users_to_add.push(data.user_id)
					}
				}
			}
			
			break;
		}
	}

	return {cluster_reference_id, cluster_iteration, cluster_users_to_add, cluster}
}



workerpool.worker({

	sortClusters: sortClusters,
	isPointInside: isPointInside,
	closeGroup: closeGroup,
	removeOverlap: removeOverlap,
	test: test
})

/*

if(data.user_id != user_id)
		{
			let dist = turf.distance(coords, data.coords, {units: "meters"})

			if(dist <= config.max_distance){

				if(!(data.iteration > iteration)){

					near_by.push(data.user_id)
				}
				else{

					iteration_error=true
				}
			}
		}

	*/