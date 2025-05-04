import { useState } from 'react';
import './Dashboard.css';
import Products from '../products/Products.jsx';
import ImportStock from '../importstock/ImportStock.jsx';
import ExportStock from '../exportStock/ExportStock.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = ({products, setProducts}) => {
  const [activeTab, setActiveTab] = useState("products");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
    toast.error("Bãn đã đăng xuất khỏi hệ thống",{
      position: "top-center",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "colored",
    })
  };

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <Products products={products} setProducts={setProducts}/>
      case "import":
        return <ImportStock products={products} setProducts={setProducts}/>;
      case "export":
        return <ExportStock products={products}/>;
      default:
        return <h2>Chào mừng bạn đến Dashboard</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <button
            className="toggle-button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className={`fas ${isSidebarOpen ? 'fa-solid fa-angles-left' : 'fa-solid fa-angles-right'}`}></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab("products")}>
            <i className="fas fa-list"></i>
            {isSidebarOpen && <span>Danh mục sản phẩm</span>}
          </button>
          <button onClick={() => setActiveTab("import")}>
            <i className="fas fa-arrow-down"></i>
            {isSidebarOpen && <span>Nhập kho</span>}
          </button>
          <button onClick={() => setActiveTab("export")}>
            <i className="fas fa-arrow-up"></i>
            {isSidebarOpen && <span>Xuất kho</span>}
          </button>
        </nav>

        <button className="logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          {isSidebarOpen && <span> Đăng xuất</span>}
        </button>
      </aside>

      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
