import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";
import Welcome from "./pages/Welcome";
function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // проверяем авторизацию (например, по /auth/check)
  useEffect(() => {
    fetch("/check_jwt", {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        if (res.status === 200) setIsAuth(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!isAuth ? <Login /> : <Navigate to="/main" />}
        />
        <Route
          path="/register"
          element={!isAuth ? <Register /> : <Navigate to="/main" />}
        />

        {/* Protected Route */}
        <Route
          path="/main"
          element={isAuth ? <Main /> : <Navigate to="/login" />}
        />

        {/* Redirect all other routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
