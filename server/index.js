import express from "express"
import {createServer} from "http"
import cors from "cors"
import config from "./config.js"
import mongoose from "mongoose"
import router from "./routes.js"
import {userModel, spanModel} from "./schemas.js"
import {v4} from "uuid"
import {Server} from "socket.io"
import path from "path"
import fs from "fs"
import * as turf from '@turf/turf'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import registerSocket from "./sockets.js"
import initSubcribers from "./subscribers.js"
import cluster from "cluster"
import os from "os"
import {setupMaster, setupWorker} from "@socket.io/sticky"
import {createAdapter, setupPrimary} from "@socket.io/cluster-adapter"
import {handleDisconnect} from "./services/spans.js"
import cron from "node-cron"

const __filename= fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PORT = config.port || 3000

mongoose.connect(config.db_uri, config.db_options).then((conn, err)=>{

	if(err) throw new Error(err.message)
})



const app = express()

app.enable('trust proxy')
app.use(cors())
app.use(express.json())

app.use("/assets", express.static(path.join(__dirname, "assets")))
app.use(config.upload_prefix, express.static(path.join(__dirname, "uploads")))
app.use(config.api_prefix, router)

app.get("/status", async(req, res)=>{

	res.status(200).end()
})

app.get("/content", (req, res)=>{

  	res.status(403).end()
})

app.head("/status", (req, res)=>{

	res.status(200).end()
})

app.use((err, req, res, next)=>{

	var err = new Error("Not Found!");

	err.status = 404;

	next(err);
});

app.use((err, req, res, next)=>{

	res.status(err.status || 500);

	res.json({

		error: err.message || "Server Error!"

	}).end();
});


if(cluster.isPrimary){

	const server = createServer(app)

	setupMaster(server,{

		loadBalancingMethod: "least-connection"
	})

	setupPrimary()

	cluster.setupPrimary({

		serialization: "advanced"
	})

	server.listen(PORT, ()=>{

		console.log("The server has been initialized on port " + PORT)
	});

	let numCPUS = os.cpus().length

	for(var i = 0; i < numCPUS; i++){

		cluster.fork()
	}

	cluster.on("exit", async(worker)=>{
	
		console.log("Worker " + worker.process.pid +  " died")
	
		cluster.fork()
	})
}
else{ 

	const server = createServer(app)

	const io = new Server(server, {

		maxHttpBufferSize: config.upload_limit
	}) 

	io.adapter(createAdapter())
	
	setupWorker(io)

	initSubcribers(io)

	io.on("connection", async(socket)=>{

		socket.use((socket, next)=>{

			socket.io = io

			next()
		})
		 	
		socket.on("error", (err)=>{

			console.error("THERE WAS AN ERROR")

			throw new Error(err.message)
		})


		registerSocket(socket)
	})
}
