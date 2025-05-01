import React, { useState } from 'react';
import './Products.css'


const Products = ({products, setProducts}) => {
  const [formData, setFormData] = useState({ code: '', name: '', unit: '', inventory: '' });
  const [showPopup, setShowPopup] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5); // ← thêm


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  // search
  const [searchTerm, setSearchTerm] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    if (name === "searchId") setSearchId(value);
    if (name === "searchName") setSearchName(value);
    setCurrentPage(1);
  };

    // Lọc theo mã và tên sản phẩm
    const filteredProducts = products.filter(product =>
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      

  const handleAddProduct = (e) => {
    e.preventDefault()
    alert("Thêm sản phẩm thành công")
    // setProducts(prev => [...prev, formData]);
    // .... thêm login api post sản phẩm mới lên google sheet appscript
    setFormData({ code: '', name: '', unit: '', inventory: '' });
    setShowPopup(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // reset về trang đầu
  };

  return (
    <div className="products-container">
      <h2>📦 Danh mục sản phẩm</h2>
      <div className='search-input'>
        <input
            type="text"
            placeholder="Tìm theo mã hoặc tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
            }}
            />
      </div>
      <div className='add-button-container'>
          <button className="add-button" onClick={() => setShowPopup(true)}>+ Thêm mới sản phẩm</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Đơn vị tính</th>
            <th>Tồn kho</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product, index) => (
            <tr key={index}>
              <td>{product.productCode}</td>
              <td>{product.productName}</td>
              <td>{product.unit}</td>
              <td>{product.inventory}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <div className='pagination-button'>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>⬅ Trang trước</button>
            <div className='pagination-center'>
                <span>Trang {currentPage} / {totalPages}</span>
                <div className='pagination-page-division'>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value={3}>3 hàng/Trang</option>
                        <option value={5}>5 hàng/Trang</option>
                        <option value={10}>10 hàng/Trang</option>
                        <option value={20}>20 hàng/Trang</option>
                    </select>
                </div>
            </div>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Trang sau ➡</button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Thêm sản phẩm mới</h3>
            <input name="id" placeholder="Mã sản phẩm" value={formData.code} onChange={handleChange} />
            <input name="name" placeholder="Tên sản phẩm" value={formData.name} onChange={handleChange} />
            <input name="unit" placeholder="Đơn vị tính" value={formData.unit} onChange={handleChange} />
            <input name="stock" placeholder="Tồn kho" value={formData.inventory} onChange={handleChange} />
            <div className="popup-actions">
              <button onClick={handleAddProduct}>Lưu</button>
              <button onClick={() => setShowPopup(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
