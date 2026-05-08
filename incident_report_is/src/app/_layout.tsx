import { Stack } from 'expo-router';
import AuthProvider, {useAuthContext} from '../utils/authContext';
import { SplashScreenController } from '../components/splash';


function InitialLayout() {
  const { authState} = useAuthContext();
  console.log("rootlayout authstate:", authState)
  //if(loading){return null};
  return ( 
    <Stack>
      <Stack.Protected guard={authState.authenticated} >
        <Stack.Screen name='(tabs)' options={{ headerShown: false}}/>
      </Stack.Protected>

      <Stack.Protected guard={!authState.authenticated}>
        <Stack.Screen name='login_page' options={{headerShown: false}}/>
      </Stack.Protected>
    </Stack>
  )
 
}

export default function RootLayout(){
  return (
    <AuthProvider>
      <SplashScreenController/>
      <InitialLayout/>
    </AuthProvider>
  )
}