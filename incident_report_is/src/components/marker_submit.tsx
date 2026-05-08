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



const schema = z.object({
    level: z.string(),
    users_id: z.number(),
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
export default function MyForm ({latitude, longitude, level, setLevel, loading, setLoading}){

    //const [description, setDescription] = useState("");
     //const [level, setLevel] = useState(Number);
     const bottomSheetRef = useRef<BottomSheet>(null);
     const handleSheetChanges = useCallback((index: number) => {
        if (index === -1){
            setLoading(false);
        }
        console.log("handleSheetChanges", index);
     },[]);
     const snapPoints = useMemo(() => ['8%', '25%', '50%', '70%'], []);
     const disableLoad = () => {
        setLoading(false)
     }


    const { control, 
        handleSubmit
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        values: {
            "level": '1',
            "users_id": 1,
            "latitude": latitude,
            "longitude": longitude,
            "description":""

        }
    });

    // Will turn in async POST request for the form submission
    const onSubmit: SubmitHandler<FormFields> = async (data:any) => {
        console.log(data);
    }
    
    const onError: SubmitErrorHandler<FormFields> = (errors) => {
        console.log("Error: ", errors);
    }

  return (
    <>
    {loading ?
    <BottomSheet enablePanDownToClose={true} snapPoints={snapPoints} index={1} ref={bottomSheetRef} onChange={handleSheetChanges}>
    <BottomSheetView style= {styles.contentContainer}>
        <Controller
         control={control}
         rules={{required: true}}
         name="description"
         render = {({ field: { onChange, onBlur, value,  } }) => (
            <>
            <Text>Description</Text>
            <TextInput
            style = {styles.description}

                 onBlur={onBlur}
                 onChangeText={onChange}
                 value={value}
                 placeholder="Enter a description" />
                 </>
         )}
        />
        <Controller
        control = {control}
        rules={{required: true}}
        name = "level"
        render = {({ field: { value } }) => (
            <>
            <Text>Level 1</Text>
            <RadioButton
            value = {value}
            status = { level === 1 ? 'checked': 'unchecked'}
            onPress={() => {setLevel(1)}} 
            /></>
        )}
         />
         <Controller
        control = {control}
        rules={{required: true}}
        name = "level"
        render = {({ field: { value } }) => (
            <>
            <Text>Level 2</Text>
            <RadioButton
            value = {value}
            status = { level === 2 ? 'checked': 'unchecked'}
            onPress={() => {setLevel(2)}} 
            />
            </>
        )}
         />
        <Controller
        control = {control}
        rules={{required: true}}
        name = "level"
        render = {({ field: { value } }) => (
            <>
            <Text>Level 3</Text>
            <RadioButton
            value = {value}
            status = { level === 3 ? 'checked': 'unchecked'}
            onPress={() => {setLevel(3)}} 
            />
            </>
        )}
         />
        <Button title= "Submit" onPress={(e) => handleSubmit(onSubmit, onError)(e).then(setLoading(false)).catch(()=> {
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
    backgroundColor: 'black',
  },
    description: {
        borderWidth: 1,
        padding: 10,
        alignSelf:"center",
        alignContent:"center"
    },
    contentContainer: {
        flex:1,
        padding: 36,
        alignItems: "center",
    },
    
});
