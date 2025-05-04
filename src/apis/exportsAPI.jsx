import apiUrl from "./api";
import axios from "axios"

const exportsAPI = () => {

    const postExportStock = async (data) => {
        const payload = {
            action: "exportStock",
            dataExport: data
        }
        try {
          const api  = await axios.post(apiUrl + "export-stock", payload)
          const respone = await api.data
          return respone
        } catch (error) {
          console.log(error)
        }
    };

    return{
        postExportStock
    }

}

export default exportsAPI