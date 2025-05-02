import axios from "axios";
import apiUrl from "./api.jsx";

const usersAPI = () => {

    const getUsers = async (setUsersData) => {
        try {
          const user = await axios.get(apiUrl + "get-users")
                      .then(respone => setUsersData(respone.data))
        } catch (error) {
            console.log(error)
        }
      };

    
    const postUser = async ({email, password, otp}) => {

        const body = {
                        action: "registerUser",
                        email,
                        password,
                        otp
                    }

        try {
          const user = await axios.post(apiUrl + "register", body)
          const respone = await user.data
          return respone
        } catch (error) {
            console.log(error)
        }
      };


      const sendOtpToEmail = async (email, otp) => {
        const payload = {action: "sendOtp", email, otp}
        try {
          const response = await axios.post(apiUrl + "sendOtp", payload);
          return response  
        } catch (error) {
          console.log(error)
        }
      };

    return{
        getUsers,
        postUser,
        sendOtpToEmail
    };
}

export default usersAPI