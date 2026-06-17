import { Tabs } from "expo-router";
import { Library, User,Book} from "lucide-react-native";


export default function RootLayout() {
  return (
    <Tabs screenOptions={{headerShown:false, tabBarShowLabel: false,}} >
       <Tabs.Screen name="index"   options={{ title:"library" ,tabBarIcon:({color , size})=>(<Library color={color} size={size}/>)}}/>
       <Tabs.Screen name="profile" options={{ title:"profile" ,tabBarIcon:({color,size})=>(<User color={color} size={size} />)}}/>
      <Tabs.Screen
  name="books"
  options={{
    href: null,
  }}
/>
    </Tabs>
  )
}

