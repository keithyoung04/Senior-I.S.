import React from "react";
import { TextInput, View, Text, StyleSheet, Button } from "react-native";
//import AuthContext from "./utils/authContext";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "../utils/authContext";
import { Redirect } from "expo-router";



type FormData = {
    email: string;
    password: string;
}

export default function Login () {
    //const { onLogin } = useContext(useAuth);
    const schema = z.object({
        email: z.string(),
        password: z.string(),  
    })

    const {
        control, 
        handleSubmit} = 
        useForm<FormData>({
        resolver: zodResolver(schema)});

    const { onLogin, authState} = useAuthContext();

  
    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try {
           const result =  await onLogin(data.email, data.password)
            if(result && result.error){
                alert(result.msg)
            }
        } catch (error:any) {
            console.log("error is: ", error.message)
            
        }
        console.log("Returning authstate from login submit: ", authState)
    };



    return(
       <View style={styles.container}>
        <Text>Login</Text>

        <Controller
            name="email"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
            <TextInput 
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholderTextColor={'grey'}
            placeholder="Enter Your Email"
            />
        )}
        />

        <Controller
            name="password"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
            <TextInput 
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholderTextColor={'grey'}
            placeholder="Enter Your Password"
            />
        )}
        />
        <View style={{borderWidth: 1, margin: 20, borderRadius: '60%', width:'40%'}}>
        <Button title="Submit" onPress={handleSubmit(onSubmit)}/>
        </View>
       </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        borderColor:"black",
    },
    input:{
        borderWidth:1,
        borderRadius:10,
        padding:10,
        width:"90%",
        marginTop: 18,
        borderColor:"gray"
    },
})




/*export default function SignIn() {

    const {authState} = useAuth()
    const {onLogin} = useAuth()
    const submit = async () => {
        const result = onLogin("aj@gmail.com", "keith")
        console.log("result: ", authState.authenticated)
        return result
    }
   return ( <View>
        <Text>SignIn</Text>
        <Button title="submit" onPress={async () => {await submit(); router.push("/(tabs)")}}/>
    </View>
   )
}*/