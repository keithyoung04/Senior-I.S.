//import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState} from "react";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import { jwtDecode } from "jwt-decode"
//import { tokens } from "react-native-paper/lib/typescript/styles/themes/v3/tokens";

interface AuthProps{
    authState: {token: string | null; authenticated: boolean };
    onRegister: (email: string, password: string) => Promise<any>;
    onLogin:  (email: string, password: string) => Promise<any>;
    onLogout: () => Promise<any>;
    loading: boolean
    userId: string | null
}

const TOKEN_KEY = 'my-jwt';
const REFRESH_KEY = 'my-refresh';
const USER_ID = "userID";
//export const API_URL = "http://140.103.82.206:8080";

 export const AuthContext = createContext<AuthProps | undefined>(undefined)


export default function AuthProvider ({ children }: any) {

    const [authState, setAuthState] = useState<{token: string | null; authenticated: boolean; }>({token: null , authenticated: false});

    const [IsLoading, SetLoading] = useState(true)

    const [ID, setID] = useState<string | null>(null);


    useEffect(() => {
        const loadToken = async () => {
            SetLoading(true)
            console.log("Initial Loading....", IsLoading)
            try{
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const ID = await SecureStore.getItemAsync(USER_ID)
            SetLoading(false)
            console.log("Loading....", IsLoading)
            console.log(`Token from initial useEffect in SecureStore: ${token}`)
            console.log("ID from initial useEffect: ", ID)
            if(token){
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated: true
                });
                setID(ID)  //SetLoading(false)
            }
            //loadToken()
        }
        catch (error:any){
            console.log("Error in initial useEffect:", error)
        }
            //return token;
        };
        loadToken();
        console.log("authstate in opening useeffect: ", authState.authenticated)
        //SetLoading(false);
    }, [])


    const register = async (email: string, password:string) => {
        try {
            //SetLoading(true)
            const result =  await axios.post("http://192.168.1.95:8080/register", {email, password});
            SetLoading(false);
            return result;
        } catch (error) {
            return {error}
        }
    }
    /*
    - set refresh token to secure store when login
    - set limit for access token
    - when access token expires. Call the refresh token
    - once we have the refresh token make another call for the access token
    */

    const login = async (email: string, password: string) => {
        try {
            SetLoading(true)
            const response = await axios.post("http://192.168.1.95:8080/login", {email, password}, {timeout: 15000})
           if(response.data.accessToken){ setAuthState({
                token: response.data.accessToken,
                authenticated: true
            });

            const decoded = jwtDecode(response.data.accessToken)
            const decodedID = String(decoded.id.id)
            setID(decodedID)
          
            console.log("decoded: ", decodedID)
        }
            
            console.log(`Result from login request: ${response.data.accessToken}`);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
             
            while(IsLoading){
                // stores access token in secure store
                await SecureStore.setItemAsync(TOKEN_KEY, response.data.accessToken);
                await SecureStore.setItemAsync(USER_ID, ID);
                /* 
                - stores refresh token in secure store
                - refresh token will be pulled from secure store once accessToken has expired
                - when accessToken expires refreshToken will be used to 

                */
                //await SecureStore.setItemAsync(REFRESH_KEY, response.data.refreshToken)
            }
            console.log("SetItemAsync: ", SecureStore.setItem(TOKEN_KEY, response.data.accessToken))
            console.log("Settting ID via SetItemAsync: ", SecureStore.setItem(USER_ID, ID))
            
        } catch (error:any) {
            if(error.response){
                console.log("error response data: ", error.response.data);
            } else if (error.request){
                console.log("error request: ", error.request)
            }
            else{
                console.log("Error message: ", error.message.data)
            }
            console.log("error config: ", error.config.data);
        }
        finally{
            SetLoading(false);
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        axios.defaults.headers.common["Authorization"] = "";

        setAuthState({
            token: null,
            authenticated: false
        });
    };
  

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState: authState,
        loading: IsLoading,
        userId: ID,
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )


}

export const useAuthContext = () => {
        const context = useContext(AuthContext);
        if (context === undefined)
            throw new Error("useAuthContext should be used within a AuthContextProvider ");
        return context;
    }
