
import apiUrl from "./api.jsx"
import axios from "axios"

const productsAPI = () => {

  // lấy danh sách sản phẩm từ database
  const getProductsList = async (setProducts) => {
    try {
      const user = await axios.get(apiUrl + "get-products-list")
                  .then(respone => setProducts(respone.data))
    } catch (error) {
      console.log(error)
    }
  };

  // thêm sản phẩm mới lên database
  const postProduct = async (formData) => {
    formData.action = "addProduct"
    try {
      const user = await axios.post(apiUrl + "add-product", formData)
      const respone = await user.data
      return respone
    } catch (error) {
      console.log(error)
    }
  };


  return {
    getProductsList,
    postProduct,
  };
}

  export default productsAPI