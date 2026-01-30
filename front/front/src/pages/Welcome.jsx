import Header from  "../components/Welcome/Header.jsx";
import Main from  "../components/Welcome/Main.jsx";
import "../assets/Welcome/welcome.css";
function Welcome() {
  return (
    <div className="welcome-page">
      <Header />
      <Main />
    </div>
  );
}
export default Welcome;