import { useAuthContext } from "@/src/utils/authContext";
import React from "react";
import {View, Text, Button} from "react-native";


export default function Logout(){

    const {onLogout} = useAuthContext()

    return(
        <View>
            <Text> Logout</Text>
            <Button title="Logout" onPress={onLogout}></Button>
        </View>
    )
}