import React, {useState} from 'react';
import { View } from 'react-native';
import {Container, Button, Text,H1,Input, Form, Item, Toast} from 'native-base';
import globalStyle from '../style/global';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import {gql, useMutation} from '@apollo/client';

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario ($input : AutenticarInput){
        autenticarUsuario(input:$input){
        token
        }
    }
`;


const Login = () => {

    const [email, guardarEmail] = useState('');
    const [password, guardarPassword] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    const navigation = useNavigation(); 

    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

    const handlerSubmit = async () => {
        if(email === '' || password === ''){
            guardarMensaje('Todos los campos son obligatorios')
            return;
        }

        try {
            const {data} = await autenticarUsuario({
                variables: {
                    input : {
                        email,
                        password
                    }
                }
            });
            const {token} = data.autenticarUsuario;
            await AsyncStorage.setItem('token', token);
            navigation.navigate('Proyectos');
        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error: ', ''));
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
                <Form>
                    <Item inlineLabel last style={globalStyle.input}>
                        <Input
                            placeholder='Email'
                            onChangeText={(texto)=>guardarEmail(texto.toLocaleLowerCase())}
                            value={email}
                        />
                    </Item>
                    <Item inlineLabel last style={globalStyle.input}>
                        <Input
                            placeholder='Password'
                            secureTextEntry={true}
                            onChangeText={(texto)=>guardarPassword(texto)}
                        />
                    </Item>
                </Form>
                <Button
                    square
                    block
                    style={globalStyle.boton}
                    onPress = {()=>handlerSubmit()}
                >
                    <Text style={globalStyle.botonTexto}>Iniciar Sesión</Text>
                </Button>
                <Text 
                    style={globalStyle.enlace}
                    onPress={()=>navigation.navigate('CrearCuenta')}
                >
                    Crear Cuenta
                </Text>
                {mensaje && mostrarAlerta()}
            </View>
        </Container>
    )
}

export default Login;