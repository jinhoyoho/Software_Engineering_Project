import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./routes/Login";
import Main from "./routes/Main";
import Upload from "./routes/Upload";
import Mail from "./routes/Mail";
import Guest from "./routes/Guest";
import Reply from "./routes/Reply";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
      </Routes>
      <Routes>
        <Route path="/main/:username" element={<Main />}></Route>
      </Routes>
      <Routes>
        <Route path="/upload/:username" element={<Upload />}></Route>
      </Routes>
      <Routes>
        <Route path="/DirectMessage/:username" element={<Mail />}></Route>
      </Routes>
      <Routes>
        <Route path="/guest" element={<Guest />}></Route>
      </Routes>

      <Routes>
        <Route path="/reply/:username/:touser" element={<Reply />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
