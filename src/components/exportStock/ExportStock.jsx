import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import './ExportStock.css';

const ExportStock = ({ products }) => {
  const [rows, setRows] = useState([
    { productCode: '', productName: '', unit: '', quantity: 1, exportedTo: '', reason: '' },
  ]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Exported Data:', rows);
    // Submit to backend or Apps Script
  };

  return (
    <div className="export-form-container">
      <h2>📤 Xuất kho sản phẩm</h2>
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
                      <div><strong>{option.productCode}</strong></div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{option.productName}</div>
                    </li>
                  );
                }}
              />
              <input type="text" value={row.productName} readOnly />
              <input type="text" value={row.unit} readOnly />
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
        <button type="submit" className="submit-button">Lưu phiếu xuất</button>
      </form>
    </div>
  );
};

export default ExportStock;
