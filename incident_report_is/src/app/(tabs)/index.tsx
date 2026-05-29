import React, {useEffect, useRef, useState} from "react";
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {StyleSheet, View, Text, GestureHandler} from "react-native";
import axios from "axios";
import { useAuthContext } from "@/src/utils/authContext";
import {io} from 'socket.io-client';
import MyForm from "@/src/components/marker_submit";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Pinpoint = {
    id: number,
    level: number
    latitude: number,
    longitude: number,
    description: string
}
export const socket = io('http://192.168.1.95:8080/points');

export default function Map (){


    const { userId, authState } = useAuthContext();

    //const paramID = String(userId)

    const [location, setLocation] = useState([]);
    const [pinPoint, setPoint] = useState<Pinpoint>();
    const [Latitude, setLatitude] = useState({});
    const [Longitude, setLongitude] = useState({});
    const [Loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
            const response = await axios.get(`http://192.168.1.95:8080/points/${userId}`);
            console.log(response.data);
            console.log("id from fetchmarkers: ", userId)
            setLocation(response.data.data);
                
            } catch (error:any) {
                console.log("error is: ", error.response)
                console.log("error is: ", error.request)
                console.log("error is: ", error.data)
                
            }
        }
        fetchMarkers();
    },[]);

    const INITIAL_REGION = {
        latitude: 40.811090709804176, 
        longitude: -81.93378494859077,
        latitudeDelta: .008,
        longitudeDelta: .008
    }

    const mapRef = useRef<any>(null);

    const schoolBoundaries = {
        southwestBoundary: {latitude: 40.804897596680135, longitude: -81.93830763367757},
        northeastBoundary: {latitude: 40.82142729199947, longitude:-81.92197166579486}
    };

    useEffect(() =>{
        if (mapRef.current){
            mapRef.current.setMapBoundaries(
                schoolBoundaries.southwestBoundary,
                schoolBoundaries.northeastBoundary
            )
        }
    },);

    
    return (
       <GestureHandlerRootView style={{flex: 1}}>
        <View style={styles.container}>
            <MapView 
            style={styles.map} 
            provider={PROVIDER_GOOGLE}
            initialRegion={INITIAL_REGION}
            region={INITIAL_REGION}
            ref={mapRef}
            showsUserLocation
            minZoomLevel={15}
            maxZoomLevel={20}
            onLongPress={e => {setLatitude(e.nativeEvent.coordinate.latitude); 
                setLongitude(e.nativeEvent.coordinate.longitude); 
                setLoading(true)
                console.log(e.nativeEvent.coordinate);

            }
             }
            showsMyLocationButton>
            {location.map((marker) => (
                <Marker key={marker.id} coordinate={marker}>
                    <Callout>
                        <Text>
                            {marker.description}
                        </Text>
                    </Callout>
                    
                </Marker>
                ))}
                </MapView>
          <MyForm latitude={Latitude} longitude={Longitude} userId={userId} loading={Loading} setloading={setLoading}/>
        </View>
    </GestureHandlerRootView> 
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%'
    },
});

/*
 {location.map((marker, index) => (
            <Marker key={index} coordinate={location} />
        ))}

*/