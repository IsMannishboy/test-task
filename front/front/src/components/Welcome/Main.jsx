import getstarted from "../../assets/Welcome/Button.svg";
import "../../assets/Welcome/main.css";
function Main(){
    return(
        <main className="welcome-main">
            <div className="welcome-main-content">
                <h1 className="welcome-main-title">The chemical  negatively charged</h1>
                <p className="welcome-main-description">
                  Numerous calculations predict, and experiments confirm, that the force field reflects the beam, while the mass defect is not formed. The chemical compound is negatively charged. Twhile the mass defect is 
                </p>
                <button className="welcome-main-getstarted-button">
                   <a href="/main"> <img src={getstarted} alt="Get Started Button" className="welcome-main-getstarted-image"/></a>
                </button>
            </div>
        </main>
    )
}
export default Main;