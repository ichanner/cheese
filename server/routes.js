

import {Router} from "express"
import path from "path"


const router = new Router()

router.get("/test", (req, res)=>{

	res.sendFile(path.resolve('test.html'));
})

router.get("/map/getMapView", async(req, res)=>{

})

router.post("/profile/addCoins", async(req, res)=>{

})

router.get("/profile/getCoins", async(req, res)=>{

})

router.get("/profile/getFriends", async(req, res)=>{

})

router.post("/profile/addFriend", async(req, res)=>{

})

router.post("/profile/removeFriend", async(req, res)=>{

})

router.post("/profile/view", async(req, res)=>{

})

router.post("/profile/create", async(req, res)=>{


})

router.post("/profile/auth", async(req, res)=>{


})

export default router