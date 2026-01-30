import "../assets/Login/login.css";
import login_image from "../assets/Login/Rectangle 291.png";
import header from "../assets/Login/Header-layout1 (1).png";
import button from "../assets/Login/Group 308.png";
import forgpass from "../assets/Login/Forgot password_.png";
function Login() {
    const URL = "https://dragonfly-unexcusing-brittanie.ngrok-free.dev"
    

    async function GetCSRF(){
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
    async function handleSubmit(event) {
         
        event.preventDefault();
        await GetCSRF()
        const data = {"email":event.target.elements[0].value,"password":event.target.elements[1].value}
        console.log(data)
        const err = emailparser(data.email)
        if(err != null){
            alert(err)
            return
        }else{
            try{
            await fetch(`${URL}/auth/register`,{
                method:"POST",
                credentials:"include",
                headers:{
                              "Content-Type": "application/json",
                               "X-CSRF-Token":localStorage.getItem("csrf")
                              
                },
                body:JSON.stringify(data)
            }).then((res)=>{
                console.log(res)
                if(res.status == 403){
                    alert("this email already used")
                    return
                }else if(res.status == 500){
                    alert('server error')
                }
                window.location.href = "main"
            })
        }catch(err){
            console.log("submit err:",err)
        }
        }
        
    }
    return (
        
        <div className="page">
            <img className="header" src={header}></img>
            <div className="main">
                <div className="form-div">
                    <div className="form">
                        <h1 className="text">Register</h1>
                      <form id="form" onSubmit={handleSubmit}>
                    <p className="text">Email:</p>
                    <input type="text" placeholder="Enter your email" />
                    
                    <p className="text">Password:</p>
                    <input type="password" placeholder="Enter your password" />
                        <p>Forgot password?</p>
                    <button type="submit">Login</button>
                                            <p>Already have account?<a href="/login">login</a></p>

                    </form>
                    </div>
                </div>

                </div>
        </div>
    )
}
export default Login;