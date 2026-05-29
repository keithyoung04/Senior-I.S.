import { useAuthContext } from "@/src/utils/authContext";
import React from "react";
import {View, Text, Button, TouchableOpacity} from "react-native";


export default function Logout(){

    const {onLogout} = useAuthContext()

    return(
        <View style={{justifyContent: "center"}}>
            <Text style={{ textAlign: "center", fontSize: 18, marginTop: 200, textAlignVertical: "center"}}> Logout</Text>
            <Button title="Logout" onPress={onLogout}></Button>
        </View>
    )
}