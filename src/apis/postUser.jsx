import apiUrl from "./api.jsx"

const postUser = async ({email, password, otp}) => {

    try {
      const user = await fetch(apiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
            otp: otp
        })
      })
    } catch (error) {
    }
  }

  export default postUser