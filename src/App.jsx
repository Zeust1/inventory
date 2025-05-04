import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usersAPI from "./apis/usersAPI.jsx"
import productsAPI from "./apis/productsAPI.jsx";
import AuthForm from "./components/registerandlogin/AuthForm.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx"


function App() {
  const [usersData, setUsersData] = useState([])
  const [products, setProducts] = useState([]);

  const { getUsers, postUsers } = usersAPI()
  const { getProductsList, postProduct } = productsAPI()

  useEffect(() => {
    getUsers(setUsersData)
    getProductsList(setProducts)
  }, []);
  
return (
  <div>
    <ToastContainer position="top-right" autoClose={5000} />
    <Router>
      <Routes>       
        <Route path="/" element={<AuthForm usersData={usersData}/>}/>
        <Route path="/dashboard" element={<Dashboard products={products} setProducts={setProducts}/>}/>
      </Routes>
    </Router>
  </div>
)}
export default App
