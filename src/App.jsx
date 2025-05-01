import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import getUsers from "./apis/getUsers.jsx"
import productsAPI from "./apis/productsAPI.jsx";
import AuthForm from "./components/registerandlogin/AuthForm.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx"


function App() {

  const { getProductsList, postProduct } = productsAPI()

  const [usersData, setUsersData] = useState([])
  const [products, setProducts] = useState([]);

  getUsers(setUsersData)
  getProductsList(setProducts)

  useEffect(() => {
    getUsers();
    getProductsList();
  }, []);


return (
  <div>
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm usersData={usersData}/>}/>
        <Route path="/dashboard" element={<Dashboard products={products} setProducts={setProducts}/>}/>
      </Routes>
    </Router>
  </div>
)}
export default App
