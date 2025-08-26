import { Routes, Route } from "react-router";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Homepage from "./pages/homepage";

function App() {
  
return(
<>
  <Routes>
    <Route path="/" element={<Homepage></Homepage>}></Route>
    <Route path="/login" element={<Login></Login>}></Route>
    <Route path="/signup" element={<Signup></Signup>}></Route>
  </Routes>
</>

);

}
 

export default App;
