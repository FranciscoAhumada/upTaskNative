import React, {useState} from 'react';
import { View } from 'react-native';
import {Container, Button, Text,H1,Input, Form, Item, Toast} from 'native-base';
import globalStyle from '../style/global';
import {useNavigation} from '@react-navigation/native'

import {gql, useMutation} from '@apollo/client';

const NUEVA_CUENTA = gql`
    mutation crearUsuario ($input :UsuarioInput){
        crearUsuario(input: $input)
    }
`;


const CrearCuenta = () => {

    const [nombre, guardarNombre] = useState('');
    const [email, guardarEmail] = useState('');
    const [password, guardarPassword] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    const navigation = useNavigation(); 

    const [crearUsuario] = useMutation(NUEVA_CUENTA);

    const handlerSubmit = async () => {
        if(nombre === '' || email === '' || password === ''){
            guardarMensaje('Todos los campos son obligatorios')
            return;
        }
        if(password.length<6){
            guardarMensaje('El passwor debe tener minimo 6 caracteres')
            return;
        }
        try {
            const {data} = await crearUsuario({
                variables : {
                    input :{
                        nombre,
                        email,
                        password
                    }
                }
            });
            guardarMensaje(data.crearUsuario);
            navigation.navigate('Login');
        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error: ', ''))
        }
    }

    const mostrarAlerta = () => {
        Toast.show({
            text : mensaje,
            buttonText : 'OK',
            duration : 5000
        })
    }

    return (
        <Container style={[globalStyle.contenedor,{backgroundColor: '#e84347'}]}>
            <View style={globalStyle.contenido}>
                <H1 style={globalStyle.titulo}>UpTask</H1>
                <Form inlineLabel last>
                    <Item style={globalStyle.input}>
                        <Input
                            placeholder='Nombre'
                            onChangeText={(texto)=>guardarNombre(texto) }
                        />
                    </Item>
                    <Item style={globalStyle.input}>
                        <Input
                            placeholder='Email'
                            onChangeText={(texto)=>guardarEmail(texto) }
                        />
                    </Item>
                    <Item style={globalStyle.input}>
                        <Input
                            placeholder='Password'
                            secureTextEntry={true}
                            onChangeText={(texto)=>guardarPassword(texto) }
                        />
                    </Item>
                </Form>
                <Button
                    square
                    block
                    style={globalStyle.boton}
                    onPress={()=>handlerSubmit()}
                >
                    <Text style={globalStyle.botonTexto}>Crear Cuenta</Text>
                </Button>
                {mensaje && mostrarAlerta()}
            </View>
        </Container>
    )
}

export default CrearCuenta;