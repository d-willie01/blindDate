import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : 'https://stream-ses0.onrender.com'
  }
  return 'https://stream-ses0.onrender.com' // Default to production URL for native
}

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

const getStoredTokens = async() => {
    const accessToken = await AsyncStorage.getItem('accessToken')
    const refreshToken = await AsyncStorage.getItem('refreshToken')
    return {accessToken, refreshToken}
}

const saveTokens = async(accessToken, refreshToken) => {
    if(accessToken) {
        await AsyncStorage.setItem('accessToken', accessToken)
    }
    if(refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken)
    }
}

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('accessToken')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        } catch (error) {
            return Promise.reject(error)
        }
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            // Handle specific error cases
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized
                    console.error('Unauthorized access');
                    break;
                case 403:
                    // Handle forbidden
                    console.error('Forbidden access');
                    break;
                case 500:
                    // Handle server error
                    console.error('Server error');
                    break;
            }
        }
        return Promise.reject(error);
    }
)

export default api;