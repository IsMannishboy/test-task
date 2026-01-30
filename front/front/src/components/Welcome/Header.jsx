import login_button from "../../assets/Welcome/login.png";
import signup_button from "../../assets/Welcome/signup.png";
import "../../assets/Welcome/header.css";
import { useState,useEffect } from "react";
function Header(){
    const [isLoggedIn,setIsLoggedIn] = useState(false);
   useEffect(() => {
    fetch("/auth/check_jwt", {
      method: "GET",
      credentials: "include" 
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.status)
          setIsLoggedIn(true);
        }
      });
  }, []); 
    return(
     <div>
       {!isLoggedIn && (
               <div className="welcome-header">
            <div className="welcome-header-buttons">
               
                <div><button className="welcome-header-login-button">
                     <a href="/login"><img src={login_button} alt="Login Button" className="welcome-header-image"/></a>
               </button>
               <button className="welcome-header-signup-button">
               <a href="/register"> <img src={signup_button} alt="Signup Button" className="welcome-header-image"/></a>
               </button></div>
            </div>
        </div>
               )
               }
     </div>
        

    )
}
export default Header;