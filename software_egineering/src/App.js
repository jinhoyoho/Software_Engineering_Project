import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Main from "./routes/Main";
import Upload from "./routes/Upload";
import Mail from "./routes/Mail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
      </Routes>
      <Routes>
        <Route path="main" element={<Main />}></Route>
      </Routes>
      <Routes>
        <Route path="upload" element={<Upload />}></Route>
      </Routes>
      <Routes>
        <Route path="DirectMessage" element={<Mail />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
