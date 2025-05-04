import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import exportsAPI from '../../apis/exportsAPI.jsx';
import './ExportStock.css';
import * as XLSX from 'xlsx'; // Thư viện để đọc file Excel
import axios from 'axios';

const ExportStock = ({ products }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]); // State để lưu dữ liệu từ file Excel
  const [rows, setRows] = useState([
    { productCode: '', productName: '', unit: '', quantity: 1, exportedTo: '', reason: '' },
  ]);

  const { postExportStock } = exportsAPI()
  const [fileName, setFileName] = useState("")
  const [ fileLength, setFileLength ] = useState(0)
  const handleChange = (index, field, value, selectedProduct = null) => {
    const newRows = [...rows];

    if (field === 'productCode') {
      const product = selectedProduct || products.find(p => p.productCode === value);
      newRows[index] = {
        ...newRows[index],
        productCode: value,
        productName: product?.productName || '',
        unit: product?.unit || ''
      };
    } else {
      newRows[index][field] = value;
    }

    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { productCode: '', productName: '', unit: '', quantity: 1, exportedTo: '', reason: '' }]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const submitExcel = () => {
    const newRows = data.map(item => ({
      productCode: item.productCode,
      productName: item.productName,
      unit: item.unit, // có thể điền thêm nếu file chứa cột đơn vị
      quantity: item.quantity,
      exportedTo: item.exportedTo,
      reason: item.reason
    }));
    setRows([...rows, ...newRows]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await postExportStock(rows);
  
    const delayPerToast = 500;
    let longestTimeout = 0;
  
    res.forEach((response, index) => {
      const delay = index * delayPerToast;
  
      if (response.status === "200") {
        setTimeout(() => toast.success(response.message), delay);
      } else {
        setTimeout(() => toast.error(response.message), delay);
      }
  
      longestTimeout = delay;
    });
  
    // Tắt loading sau khi tất cả toast đã hiện
    setTimeout(() => {
      setLoading(false);
    }, longestTimeout + 6000); // 3s là thời gian toast hiển thị
  };
  
   // Xử lý sự kiện khi chọn file Excel
   const handleFileChange =  (e) => {
    const file = e.target.files[0];
    const filename = file.name
    setFileName(filename)
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      // Đọc nội dung file thành ArrayBuffer
      const dataArray = new Uint8Array(evt.target.result);
      // Dùng SheetJS đọc workbook
      const workbook = XLSX.read(dataArray, { type: 'array' });
      // Lấy sheet đầu tiên
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // Chuyển sheet thành JSON (mảng đối tượng)
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      if(jsonData.length > 300){
      setFileLength(jsonData.length)
      return toast.error("File nhận tối đã 300 dòng (không tính hàng tiêu đề)")
      } else {
        setData(jsonData);  // cập nhật state để hiển thị
      }
    };
    reader.readAsArrayBuffer(file);
  };


const handleDownloadTemplate = () => {
  const sampleData = [
    {
      "productCode": "SP001",
      "productName": "Bút bi Thiên Long",
      "unit": "cái",
      "quantity": 10,
      "exportedTo": "Phòng Kế Toán",
      "reason": "Cấp mới"
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Mẫu Xuất Kho");

  XLSX.writeFile(workbook, "Mau_Xuat_Kho.xlsx");
};

  
  return (
    <div className="export-form-container">
      <h2>📤 Xuất kho sản phẩm</h2>
      <div className='import-xlsx'>
      <div className="file-upload-wrapper">
          <button
            type="button"
            className="download-template-button"
            onClick={handleDownloadTemplate}
          >
            📥 Tải file mẫu
          </button>
          <input
            type="file"
            id="excel-upload"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
          <label htmlFor="excel-upload" className="upload-label">
            {fileName ? fileName : "📤 Tải file Excel"}
          </label>
          {(fileName && fileLength <= 300) && <button onClick={submitExcel}>Xác nhận tải file Excel</button>}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-table-export">
          <div className="form-row-export header">
            <span>Mã SP</span>
            <span>Tên SP</span>
            <span>ĐVT</span>
            <span>Số lượng</span>
            <span>Xuất cho</span>
            <span>Lý do</span>
            <span>Thao tác</span>
          </div>

          {rows.map((row, index) => (
            <div className="form-row-export" key={index}>
              <Autocomplete
                freeSolo
                options={products}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : `${option.productCode} - ${option.productName}`
                }
                value={row.productCode}
                onChange={(e, newValue) => {
                  let code = '', product = null;
                  if (typeof newValue === 'string') {
                    code = newValue;
                  } else if (newValue && newValue.productCode) {
                    code = newValue.productCode;
                    product = newValue;
                  }
                  handleChange(index, 'productCode', code, product);
                }}
                onInputChange={(e, newInputValue) => handleChange(index, 'productCode', newInputValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Mã SP" variant="outlined" size="small" />
                )}
                renderOption={(props, option) => {
                  const { key, ...rest } = props;
                  return (
                    <li key={key} {...rest}>
                      <div>{option.productName}</div>
                    </li>
                  );
                }}
              />
              <input type="text" value={row.productName} onChange={(e) => handleChange(index, 'productName', e.target.value)} />
              <input type="text" value={row.unit} onChange={(e) => handleChange(index, 'unit', e.target.value)} />
              <input
                type="number"
                min="1"
                value={row.quantity}
                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
              />
              <input
                type="text"
                value={row.exportedTo}
                onChange={(e) => handleChange(index, 'exportedTo', e.target.value)}
              />
              <input
                list="reasonOptions"
                placeholder="Cấp mới / Đổi trả / Tuỳ chọn"
                value={row.reason}
                onChange={(e) => handleChange(index, 'reason', e.target.value)}
              />
              <datalist id="reasonOptions">
                <option value="Cấp mới" />
                <option value="Đổi trả" />
              </datalist>
              <div className="actions">
                <button type="button" onClick={() => addRow()}>➕</button>
                <button type="button" onClick={() => removeRow(index)}>➖</button>
              </div>
            </div>
          ))}
        </div>
          <button type='submit' className='submit-button' disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Loading...
              </>
            ) : (
              'Lưu phiếu xuất'
            )}
          </button>
      </form>
    </div>
  );
};

export default ExportStock;
