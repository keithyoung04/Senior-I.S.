//import { useAuth } from "@/src/utils/authContext";
import {  Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabsLayout (){

    return(
        
        <Tabs>
            <Tabs.Screen name="index" options={{headerShown: false, title: "Map"}}>
            </Tabs.Screen>

            <Tabs.Screen name="logout" options={{headerShown: false, title: "Logout"}}></Tabs.Screen>
        </Tabs>
    )
}

