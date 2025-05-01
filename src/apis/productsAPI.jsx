
import apiUrl from "./api.jsx"

const productsAPI = () => {

  const getProductsList = async (setProducts) => {
    try {
      const user = await fetch(apiUrl + "?action=getProducts")
                  .then(respone => respone.json())
                  .then(data => {
                    setProducts(data)
                  })
    } catch (error) {
      console.log(error)
    }
  };

  const postProduct = async (setProducts) => {
    try {
      const user = await fetch(apiUrl + "?action=getProducts")
                  .then(respone => respone.json())
                  .then(data => {
                    setProducts(data)
                  })
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