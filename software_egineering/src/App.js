import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Main from "./routes/Main";
import Upload from "./routes/Upload";

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
    </Router>
  );
}

export default App;
