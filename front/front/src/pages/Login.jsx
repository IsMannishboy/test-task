import "../assets/Login/login.css";
import login_image from "../assets/Login/Rectangle 291.png";
import header from "../assets/Login/Header-layout1 (1).png";
function Login() {
    
    

    async function GetCSRF(){
        var URL = "https://dragonfly-unexcusing-brittanie.ngrok-free.dev"

        try{
           const res = await  fetch(`${URL}/csrf`,{
                method:"GET",
                credentials: "include" 

            })
            if(!res.ok){
                alert("error:",res.status)
                return
            }
            const data =await  res.json()
            localStorage.setItem("csrf",data.csrfToken)
        }catch(err){
            console.log("csrf err:",err)
        }
    }

    async function HandleSubmit(event) {
         var URL = "https://dragonfly-unexcusing-brittanie.ngrok-free.dev"

        event.preventDefault();
        await GetCSRF()
        const data = {"email":event.target.elements[0].value,"password":event.target.elements[1].value}
        const err = emailparser(data.email)
        if(err != null){
            alert("invalid email")
            return
        }else{
             console.log(data)
        try{
            await fetch(`${URL}/auth/login`,{
                method:"POST",
                credentials:"include",
                headers:{
                              "Content-Type": "application/json",
                               "X-CSRF-Token":localStorage.getItem("csrf")
                              
                },
                body:JSON.stringify(data)
            }).then((res)=>{
                console.log(res)
                if(res.status ==404){
                    alert("user not found")
                    return
                }else if(res.status == 401){
                    alert("wrong password")
                    return
                }else if(res.status == 403){
                    alert("this email already used")
                    return
                }
                window.location.href = "main"
            })
        }catch(err){
            console.log("submit err:",err)
        }
        }
       
    }
function emailparser(email){
    let monkey = 0;
    for(let i = 0;i < email.length;i++){
        if(email[i] == '@'){
            if(monkey == 0){
                monkey++
            }else{
                return "wrong email"
            }
        }
    }
    if(monkey != 1){
        return "wrong email"
    }
}

    return (
        
        <div className="page">
            <img className="header" src={header}></img>
            <div className="main">
                <div className="form-div">
                    <div className="form">
                        <h1 className="text">Login</h1>
                      <form id="form" onSubmit={HandleSubmit}>
                    <p className="text">Email:</p>
                    <input type="text" placeholder="Enter your email" />
                    
                    <p className="text">Password:</p>
                    <input type="password" placeholder="Enter your password" />
                        <p>Forgot password?</p>
                    <button type="submit">Login</button>
                                            <p>Dont have account?<a href="/register">sign up</a></p>

                    </form>
                    </div>
                </div>

                </div>
        </div>
    )
}
export default Login;