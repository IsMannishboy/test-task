const b = require('bcrypt');
const jwt = require('jsonwebtoken');

class Auth {
    secret
    constructor(secret){
        this.secret = secret
    }
    MakeJWT(payload){
       return {"access":jwt.sign(payload,this.secret,{expiresIn:'1h'}),
       "refresh":jwt.sign(payload,this.secret,{expiresIn:'1d'})}
    }
    VerifyJWT(tokens){   
        try{
            return {"token":jwt.verify(tokens.acess,this.secret),"msg":null}
        }catch(err){
            if (err.name === "TokenExpiredError" || err.name == "JsonWebTokenError") {
                try{
                     const payload = jwt.verify(tokens.refresh,this.secret)
                     const newaccess = jwt.sign({id:payload.id,username:payload.username},this.secret,{expiresIn:'1h'})
                     return {"token":newaccess,"msg":"access token refreshed"}
                }catch(err){
                    if(err.name === "TokenExpiredError"){
                        return {"token":"","msg":"refresh expired"}
                    }
                    return  {"token":"","msg":"unexpected error"}
                }
          
        }else{
            return {"token":"","msg":"unexpected error2"}
        }
    }
    }
    
}
module.exports = Auth;