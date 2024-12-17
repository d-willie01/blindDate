import axios from 'axios'
import AsycStorage from '@react-native-async-storage/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL ='https://stream-ses0.onrender.com/'
//const BASE_URL = 'http://localhost:3000' 


const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

getStoredTokens = async() => {

    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    return {accessToken, refreshToken}

}

const saveTokens = async(accessToken, refreshToken) => {

    if(accessToken)
    {
        await AsycStorage.setItem('accessToken', accessToken);
    }
    if(refreshToken)
    {
        await AsycStorage.setItem('refreshToken', refreshToken)
    }
}

api.interceptors.request.use(
    async (config) =>
    {
        
        const {accessToken} = await getStoredTokens();
        

        if(accessToken)
        {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,

    async(error) =>
    {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry && error.response?.status === 404)
        {
            originalRequest._retry = true

            try {
                const {refreshToken} = await getStoredTokens();

                if(!refreshToken)
                {
                    throw new Error("no refresh token")
                }

                const response = await axios.post(`${BASE_URL}/auth/refreshToken`, {refreshToken})

                const newAccessToken = response.data.token;

                await saveTokens(newAccessToken, null)

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return api(originalRequest);



            } catch (error) {
                

                //console.log("Token refresh failed:", error)

                return Promise.reject(error)


            }
        }
        return Promise.reject(error)
    }
    
)

export default api;