import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import Login from './views/Login';
import CrearCuenta from './views/CrearCuenta';
import Proyectos from './views/Proyectos';
import NuevoProyecto from './views/NuevoProyecto';
import Proyecto from './views/Proyecto';
import {Root} from 'native-base';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
    <Root>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen
            name='Login'
            component={Login}
            options={{
              title: 'Iniciar Sesión',
              headerShown: false
            }}
          />
          
          <Stack.Screen
            name='CrearCuenta'
            component={CrearCuenta}
            options={{
              title: 'Crear Cuenta',
              headerStyle:{
                backgroundColor : '#28303B'
              },
              headerTintColor : '#FFF',
              headerTitleStyle : {
                fontWeight : 'bold'
              }
            }}
          />
          
          <Stack.Screen
            name='Proyectos'
            component={Proyectos}
            options={{
              title: 'Proyectos',
              headerStyle:{
                backgroundColor : '#28303B'
              },
              headerTintColor : '#FFF',
              headerTitleStyle : {
                fontWeight : 'bold'
              }
            }}
          />
          
          <Stack.Screen
            name='NuevoProyecto'
            component={NuevoProyecto}
            options={{
              title: 'Nuevo Proyecto',
              headerStyle:{
                backgroundColor : '#28303B'
              },
              headerTintColor : '#FFF',
              headerTitleStyle : {
                fontWeight : 'bold'
              }
            }}
          />
          
          <Stack.Screen
            name='Proyecto'
            component={Proyecto}
            options={({route})=>({
              title: route.params.nombre,
              headerStyle:{
                backgroundColor : '#28303B'
              },
              headerTintColor : '#FFF',
              headerTitleStyle : {
                fontWeight : 'bold'
              }
            })}
          />

        </Stack.Navigator>
      </NavigationContainer>
      </Root>
    </>
  );
};

export default App;
