import { useState } from 'react';
import './Dashboard.css';
import Products from '../products/Products.jsx';

const Dashboard = ({products, setProducts}) => {
  const [activeTab, setActiveTab] = useState("products");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <Products products={products} setProducts={setProducts}/>
      case "import":
        return <h2>📥 Nhập kho</h2>;
      case "export":
        return <h2>📤 Xuất kho</h2>;
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
