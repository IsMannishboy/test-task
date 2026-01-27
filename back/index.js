const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const auth = require('./auth');
const csurf = require('csurf');

const Auth = require('./auth');
Auth = new auth(SECRET);

const app = express();
app.use(express.json());
app.use(csurf({cookie:true}));
app.use(cookieParser())

const SECRET = "1234"

const db = require('./models');

const SPA = "../front/front/dist/index.html"

router.use(express.static(SPA));

router.get("/csrf", (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})
router.post("/auth/login",async (req,res)=>{
    try{
        const {username,password} = req.body
    const user = await  db.User.FindOne({where:{username}})
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    const ismatch =  await bcrypt.compare(password,user.password)
    if(!ismatch){
        return res.status(401).json({message:"Invalid credentials"})
    }
    const {access,refresh} = Auth.MakeJWT({id:user.id,username:user.username})
    res.cookie("access", access, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
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
        return res.status(500).json({message:"Internal server error"})
    }



})
router.post("/auth/register",async (req,res)=>{
   try{
     const {username,password} = req.body
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await db.User.Create({username,password:hashedPassword})
    const {access,refresh} = Auth.MakeJWT({id:user.id,username:user.username})
    res.cookie("access", access, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() + 60 * 60 * 1000)
    })
    res.cookie("refresh", refresh, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expites: new Date(Date.now() +  24 * 60 * 60 * 1000)

    })
    res.setStatus(200)
    return res.json({message:"user created"})
   }catch(err){
    return res.status(500).json({message:"Internal server error"})
   }



})

router.get("/main",(req,res)=>{
    const token = Auth.VerifyJWT({access:req.cookies.access,refresh:req.cookies.refresh})
    if(token.msg != null){
        if(token.msg == "access token refreshed"){
            res.cookie("access", token.token, {
                httpOnly: true,
                secure: false,  
                sameSite: "strict",
                expires: new Date(Date.now() + 60 * 60 * 1000)
            })
            res.setStatus(200)
            return  res.sendFile(SPA)
        }else if(token.msg == "refresh expired"){
            res.status(401)
            return res.json({"msg":"login again"})
        }
    }else{
       return res.sendFile(SPA)
    }
})
router.get("/check_jwt",(req,res)=>{
    const token = Auth.VerifyJWT({access:req.cookies.access,refresh:req.cookies.refresh})
    if(token.msg != null){
        if(token.msg == "access token refreshed"){
            res.cookie("access", token.token, {
                httpOnly: true,
                secure: false,  
                sameSite: "strict",
                expires: new Date(Date.now() + 60 * 60 * 1000)
            })
            res.setStatus(200)
            return  res.json({"valid":true})
        }else if(token.msg == "refresh expired"){
            res.status(401)
            return res.json({"valid":false})
        }
    }else{
            res.setStatus(200)
            return  res.json({"valid":true})
    }
})
router.get(/.*/,(req,res)=>{
    res.sendFile(SPA)
})
app.use('/', router);   
db.sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })});   