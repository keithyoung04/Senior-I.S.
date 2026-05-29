import React, { useCallback, useMemo, useRef, useState } from "react";
import { TextInput, View, Text, StyleSheet, Button } from "react-native";
import axios from "axios";
import { useForm, Controller, SubmitHandler, SubmitErrorHandler} from "react-hook-form";
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioButton } from 'react-native-paper';
import { GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { push } from "expo-router/build/global-state/routing";
import { DarkTheme } from "@react-navigation/native";



const schema = z.object({
    level: z.string(),
    users_id: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    description: z.string(),

})

type FormFields = z.infer<typeof schema>;


//Needs to props to pass (latitude,longitude) and description

/*
steps for populating the form
- pass latitude and longitude from onLongpress event from index in props. 
- add tier button on form
- pass in url parameter for user id



*/

/*
- Things to work on for 3/15/26
- figure out how to pass hidden inputs in react hook form for react native (users_id and latitude & longitude) check
- maybe I can just get the latitude and longitude data and plug it directly into the post and the rest of the data comes from the form (check)
- figure out how to customize the radio buttons (check)
- must render after press and data submission
- take form outside of map and conditionally render it 


*/
export default function MyForm ({latitude, userId, longitude, loading, setloading}){

    //const [description, setDescription] = useState("");
     const [level, setLevel] = useState(String);
     const bottomSheetRef = useRef<BottomSheet>(null);
     const handleSheetChanges = useCallback((index: number) => {
        if (index === -1){
            setloading(false);
        }
        console.log("handleSheetChanges", index);
     },[]);
     const snapPoints = useMemo(() => ['20%', '25%', '50%', '70%'], []);
     const disableLoad = () => {
        setloading(false)
     }


    const { control, 
        handleSubmit
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        values: {
            "level": level,
            "users_id": userId,
            "latitude": latitude,
            "longitude": longitude,
            "description":""

        }
    });

    // Will turn in async POST request for the form submission
    const onSubmit: SubmitHandler<FormFields> = async (data:any) => {
        try {
            const response = await axios.post(`http://192.168.1.95:8080/users`, data)
            console.log("response from post request: ", response);
            
        } catch (error:any) {
            console.log("Pipoint post error is: ", error.response)
            console.log("Pipoint post error is: ", error.request)
            console.log("Pipoint post error is: ", error.data)

            
        }
    }
    
    const onError: SubmitErrorHandler<FormFields> = (errors) => {
        console.log("Error: ", errors);
    }

  return (
    <>
    {loading ?
    <BottomSheet enablePanDownToClose={true} snapPoints={snapPoints} index={1} ref={bottomSheetRef} onChange={handleSheetChanges} backgroundStyle={{backgroundColor: "white"}}>
    <BottomSheetView style= {styles.contentContainer}>
        <View style={{borderCurve: 'circular', borderBlockColor: "black", transform: [{scale: 1}], marginBottom: 20}}>
        <Controller
         control={control}
         rules={{required: true}}
         name="description"
         render = {({ field: { onChange, onBlur, value,} }) => (
            <>
            <Text style={{textAlign: 'center', marginBottom: 20, fontSize: 16, borderWidth: 3}}>Description</Text>
            <Text style={{marginBottom: 20}}>Select a level based on severity of the incident{'\n'} - Level 1 = small incidents{'\n'} - Level 2 = concerning incidents{'\n'} - Level 3 = Severe or urgent incidents</Text>
            <TextInput
            style = {styles.description}

                 onBlur={onBlur}
                 onChangeText={onChange}
                 value={value}
                 placeholderTextColor={"black"}
                 placeholder="Enter a description" />
                 </>
         )}
        />
        </View>
        <View style={{transform:[{scale: 1}], borderWidth: 3, borderRadius:"120%" , width:"60%", alignItems: 'center', marginBottom: 20 }}>
        <Controller
        control = {control}
        rules={{required: true}}
        name = "level"
        render = {({ field: { value } }) => (
            <>
            <View>
            <Text style={{padding: 10}}>Level 1</Text>
            <RadioButton
            value = {value}
            uncheckedColor="blue"
            color="red"
            status = { level === "1" ? 'checked': 'unchecked'}
            onPress={() => {setLevel("1")}} 
            />
            </View>
            
            </>
        )}
         />
         </View>
         <View style={{transform:[{scale: 1}], borderWidth: 3, borderRadius: "120%", width:"60%", alignItems: 'center', marginBottom: 20 }}>
         <Controller
        control = {control}
        rules={{required: true}}
        name = "level"
        render = {({ field: { value } }) => (
            <>
            <Text style={{padding: 10}}>Level 2</Text>
            <RadioButton
            value = {value}
            uncheckedColor="blue"
            color="red"
            status = { level === "2" ? 'checked': 'unchecked'}
            onPress={() => {setLevel("2")}} 
            />
            </>
        )}
         />
         </View>
        <View style={{transform:[{scale: 1}], borderWidth: 3, borderRadius: "120%", width:"60%", alignItems: 'center', marginBottom: 20 }}>
        <Controller
        control = {control}
        rules={{required: true}}
        name = "level"
        render = {({ field: { value } }) => (
            <>

            <Text style={{padding: 10}}>Level 3</Text>
            <RadioButton
            value = {value}
            uncheckedColor="blue"
            color="red"
            status = { level === "3" ? 'checked': 'unchecked'}
            onPress={() => {setLevel("3")}} 
            />

            </>
        )}
         />
         </View>
        <Button title= "Submit" onPress={(e) => handleSubmit(onSubmit, onError)(e).then(setloading(false)).catch(()=> {
            console.log('error: ', e)
        })}></Button>

   
    </BottomSheetView>
    </BottomSheet>
   :
   null
    }
    {/*<GestureHandlerRootView style={styles.container}>
    <BottomSheet ref={bottomSheetRef} onChange={handleSheetChanges} snapPoints={snapPoints}>
        <BottomSheetView style={styles.contentContainer}>
            <Text>Hello world</Text>
    </BottomSheetView>
    </BottomSheet>
    </GestureHandlerRootView>*/}
    </>
    
  )
}

const styles = StyleSheet.create({
   
    container: {
    position: 'absolute',
    backgroundColor: "blue",
    marginBottom: 50
  },
    description: {
        borderWidth: 1,
        padding: 30,
        alignSelf:"center",
        alignContent:"center",
        color: "black",
        opacity: 0.3

    },
    contentContainer: {
        flex:1,
        padding: 36,
        alignItems: "center",
    },
    
});
