import './App.css';
import 'primeicons/primeicons.css';
import { Route, Routes } from "react-router-dom"

import Login from './comp/Home-page/Login';
import Nav from './comp/Nav';
import Account from "./comp/Admin/Accounts/Accounts"
import Home  from './comp/Apartments/Home';
import Start from './comp/Start';


function App() {
  return (<>
     <Routes>
       <Route path="/" element={<Start />} />
       <Route path="/login" element={<Login />} />
       <Route path="/apartment" element={<Home/>} />
       <Route path="/manager" element={<Nav/>} />
       <Route path="/manager/expenses" element={<Account/> } />
     </Routes>
    
    </>);
}

export default App;
