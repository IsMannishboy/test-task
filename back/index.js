const REVERSEPROXY = "dragonfly-unexcusing-brittanie.ngrok-free.dev"
const express = require('express');
const router = express.Router();
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var SECRET = "1234"
const bcrypt = require("bcrypt");
const path = require("path");

const auth = require('./auth');
Auth = new auth(SECRET);

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(csurf({cookie:{
    httpOnly:true
}}));


const db = require('./models');

const SPA = "D:/node/front/front/dist"

router.use(express.static(SPA));

router.get("/csrf", (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

router.post("/auth/login",async (req,res)=>{
    try{
        const {email,password} = req.body
        console.log("email:",email,"password:",password)
    const user = await  db.User.findOne({where:{email}})
    if(!user){
        console.log("user not found")
        return res.status(404).json({message:"user not found"})
    }
    const ismatch =  await bcrypt.compare(password,user.password)
    if(!ismatch){
        console.log("401")
        return res.status(401).json({message:"wrong password"})
    }
    const {access,refresh} = Auth.MakeJWT({id:user.id,username:user.username})
    res.cookie("access", access, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(Date.now() + 60 * 60 * 1000)
    })
    res.cookie("refresh", refresh, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() +  24 * 60 * 60 * 1000)

    })
    res.setStatus(200)
    return res.json({message:"login successful"})
    }catch(err){
        console.log("error:",err)
        return res.status(500).json({message:"Internal server error"})
    }



})
router.post("/auth/register",async (req,res)=>{
   try{
     const {email,password} = req.body
     console.log("new user:",{email,password})
    const hashedPassword = await bcrypt.hash(password,10)
    const find = await  db.User.findOne({where:{email}})
    if(find){
        console.log(find)
        return res.status(403).json({"error":"this email already used"})
    }
    const user = await db.User.create({email:email,password:hashedPassword})
    const {access,refresh} = Auth.MakeJWT({id:user.id,username:user.username})
    console.log({access,refresh})
    res.cookie("access", access, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(Date.now() + 60 * 60 * 1000)
    })
    res.cookie("refresh", refresh, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() +  24 * 60 * 60 * 1000)

    })
    res.status(200)
    return res.json({message:"user created"})
   }catch(err){
        if(err.msg == "SequelizeUniqueConstraintError"){
            return res.status(403).json({
                message:"this email already used"
            })
        }
        return res.status(500).json({
            message:err.msg
        })
   }



})
router.get("/auth/check_jwt", (req, res) => {
    const accessToken = req.cookies.access;
    const refreshToken = req.cookies.refresh;
    console.log("check jwt request")
    if (!accessToken && !refreshToken) {
        console.log("no tokens")
        return res.status(401).json({ valid: false, message: "No tokens provided" });
    }

    const token = Auth.VerifyJWT({ access: accessToken, refresh: refreshToken });
    console.log(token)
    if (token != null) {    
        console.log(token.msg);
        if (token.msg === "access token refreshed") {
            res.cookie("access", token.token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                expires: new Date(Date.now() + 60 * 60 * 1000)
            });
            return res.status(200).json({ valid: true, message: "Access token refreshed" });
        } else if (token.msg === "refresh expired") {
            return res.status(401).json({ valid: false, message: "Refresh token expired" });
        }
    } else {
        return res.status(200).json({ valid: true });
    }
});
router.get("/deals", async (req,res)=>{
    try {
        const deals = await db.Deal.findAll({limit:6}); 
       return res.json(deals); 
    } catch (error) {
        console.error("error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})
router.get("/deals/images/:image",(req,res)=>{
      try {
        const imageName = req.params.image;
        console.log("image request:",imageName)
        const imagePath = path.join(__dirname, "../front/front/src/assets/deals", imageName); 
        res.sendFile(imagePath, (err) => {
            if (err) {
                console.error("file sending error:", err);
                res.status(404).send("image not found");
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("internal server error");
    }
})

router.get(/.*/,(req,res)=>{
    res.sendFile(SPA+'/index.html')
})
app.use("/",router)
db.sequelize.sync().then(() => {
    app.listen(80,"0.0.0.0", () => {
        console.log('Server is running on port 3000');
    })});   