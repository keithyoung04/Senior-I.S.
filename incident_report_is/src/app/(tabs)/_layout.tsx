//import { useAuth } from "@/src/utils/authContext";
import {  Tabs } from "expo-router";

export default function TabsLayout (){

    return(
        <Tabs>
            <Tabs.Screen name="index">
            </Tabs.Screen>

            <Tabs.Screen name="logout"></Tabs.Screen>
        </Tabs>
    )
}

