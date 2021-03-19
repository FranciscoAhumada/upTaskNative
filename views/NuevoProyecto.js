import React, {useState} from 'react';
import {View} from 'react-native';
import { Container,Button, Text, H1 , Form, Item, Input, Toast } from 'native-base';
import globalStyle from '../style/global';
import {useNavigation} from '@react-navigation/native';
import {gql, useMutation} from '@apollo/client';

const NUEVO_PROYECTO = gql`
    mutation nuevoProyecto ($input: ProyectoInput){
        nuevoProyecto(input : $input){
            nombre
            id
        }
    }
`;

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos{
        obtenerProyectos {
            id
            nombre
        }
    }
`;


const NuevoProyecto = () => {

    const navigation = useNavigation(); 

    const [nombre, guardarNombre] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
        update(cache, {data: {nuevoProyecto}}){
            const {obtenerProyectos}  = cache.readQuery({query : OBTENER_PROYECTOS});
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data : {obtenerProyectos: obtenerProyectos.concat([nuevoProyecto])}
            })
        }
    });

    const handlerSubmit = async () => {
        if(nombre === ''){
            guardarMensaje('El nombre del proyecto es obligatorio');
            return;
        }
        try {
            const {data} = await nuevoProyecto({
                variables:{
                    input :{
                        nombre
                    }
                }
            });
            guardarMensaje('Proyecto Creado Correctamente');
            navigation.navigate('Proyectos');
        } catch (error) {
            guardarMensaje(error.message.repleace('GraphQl error: ', ''));
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
        <Container style={[globalStyle.contenedor, {backgroundColor: '#E84347'}]}>
            <View style={globalStyle.contenido}>
                <H1 style={globalStyle.subTitulo}>Nuevo proyecto</H1>
                <Form>
                    <Item inlineLabel last style={globalStyle.input}>
                        <Input
                            placeholder='Nombre del Proyecto'
                            onChangeText={texto=>guardarNombre(texto)}
                        />
                    </Item>
                </Form>
                <Button
                    style={[globalStyle.boton, {marginTop:30}]}
                    square
                    block
                    onPress={()=>handlerSubmit()}
                >
                    <Text style={globalStyle.botonTexto}>Crear Proyecto</Text>
                </Button>
                {mensaje && mostrarAlerta()}
            </View>
        </Container>
    )
}

export default NuevoProyecto;