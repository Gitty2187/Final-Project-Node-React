import './App.css';
import 'primeicons/primeicons.css';
import { Route, Routes } from "react-router-dom"

import Login from './comp/Home-page/Login';
import Account from "./comp/Admin/Accounts/Accounts"
import Home  from './comp/Apartments/Home';
import Start from './comp/Start';
import AllApartmets from './comp/Admin/Apartments/AllApartments';
import ToastContainer from './comp/Toast/ToastContainer';
import RegisterPage from './comp/Home-page/RegisterPage';
import NoticeList from './comp/Notices/NoticeList'
import StepperRegistration from './comp/Home-page/Register building/StepperRegistration';


function App() {
  return (<>
  <ToastContainer />
     <Routes>
      
       <Route path="/" element={<Start />} />
       <Route path="/login" element={<Login />} />
       <Route path="/apartment" element={<Home/>} />
       <Route path="/apartment/bulletin" element={<NoticeList/>} />
       <Route path="/manager/apartments" element={<AllApartmets/>} />
       <Route path="/manager/expenses" element={<Account/> } />
       <Route path="/register" element={<RegisterPage />} />
       <Route path="/register_building" element={<StepperRegistration />} />
     </Routes>
    
    </>);
}

export default App;
