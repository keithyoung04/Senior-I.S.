import { SplashScreen } from "expo-router";
import { useAuthContext } from "../utils/authContext";
import { useEffect } from "react";


SplashScreen.preventAutoHideAsync();


export function SplashScreenController() {
    const { loading } = useAuthContext()

    console.log("Loading: ", loading)
    useEffect(() =>{
        if(!loading){
        SplashScreen.hide();
    }
    }, [loading])

    return null;
}