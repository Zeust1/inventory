
import apiUrl from "./api.jsx"

const getUsers = async (setUsersData) => {
    try {
      const user = await fetch(apiUrl + "?action=getUsers")
                  .then(respone => respone.json())
                  .then(data => {
                    setUsersData(data)
                  })
    } catch (error) {
      console.log(error)
    }
  }

  export default getUsers