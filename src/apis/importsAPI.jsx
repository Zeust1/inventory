import apiUrl from "./api";
import axios from "axios"

const importsAPI = () => {

    const postImportStock = async (data) => {
        const payload = {
            action: "importStock",
            dataImport: data
        }
        try {
          const api  = await axios.post(apiUrl + "import-stock", payload)
          const respone = await api.data
          return respone
        } catch (error) {
          console.log(error)
        }
    };

    return{
        postImportStock
    }

}

export default importsAPI