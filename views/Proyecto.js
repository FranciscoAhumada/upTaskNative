import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import { Text, Container, Button, H2,Content, List, Form, Item, Input, Toast } from 'native-base';
import globalStyle from '../style/global';
import {gql, useMutation, useQuery} from '@apollo/client';
import Tarea from '../components/Tarea';

const NUEVA_TAREA = gql`
    mutation nuevaTarea($input: TareaInput){
        nuevaTarea(input:$input){
            nombre
            id
            proyecto
            estado
        }
    }
`;

const OBTENER_TAREAS = gql`
    query obtenerTareas($input : ProyectoIDInput){
        obtenerTareas(input:$input){
            id
            nombre
            estado
        }
    }
`;

const Proyecto = ({route}) => {

    const {id} = route.params;

    const [nombre, guardarNombre] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    const {data, loading, error} = useQuery(OBTENER_TAREAS,{
        variables:{
            input:{
                proyecto : id
            }
        }
    });

    console.log(data);

    const [nuevaTarea] = useMutation(NUEVA_TAREA, {
        update(cache, {data:{nuevaTarea}}){
            const {obtenerTareas} = cache.readQuery({
                query : OBTENER_TAREAS,
                variables:{
                    input:{
                        proyecto : id
                    }
                }
            });
            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables:{
                    input:{
                        proyecto : id
                    }
                },
                data:{
                    obtenerTareas : [...obtenerTareas, nuevaTarea]
                }
            })
        }
    });
    
    const handlerSubmit = async () => {
        if(nombre === ''){
            guardarMensaje('Debe ingresar nombre de tarea');
            return;
        }
        guardarMensaje(null);
        try {
            const {data} = await nuevaTarea({
                variables:{
                    input: {
                        nombre,
                        proyecto : id
                    }
                }
            });
            console.log(data);
            guardarNombre('');
            guardarMensaje('Tarea Creada Correctamente');
            setTimeout(() => {
                guardarMensaje(null);
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    }

    const mostrarAlerta = () => {
        Toast.show({
            text : mensaje,
            buttonText : 'OK',
            duration : 5000
        })
    }

    if(loading) return <Text>Cargando ...</Text>

    return (
        <Container style={[globalStyle.contenedor, {backgroundColor: '#e84347'}]}>
            <Form style={{marginHorizontal: '2.5%', marginTop:20}}>
                <Item inlineLabel last style={globalStyle.input}>
                    <Input
                        placeholder = 'Nombre tarea'
                        value = {nombre}
                        onChangeText = {texto => guardarNombre(texto)}
                    />
                </Item>
                <Button
                    style={globalStyle.boton}
                    square
                    block
                    onPress = {()=>handlerSubmit()}
                >
                    <Text style={globalStyle.botonTexto}>Crear Tarea</Text>
                </Button>
            </Form>
            <H2 style={globalStyle.subTitulo}>Tareas : {route.params.nombre}</H2>
            <Content>
                <List style={styles.contenido}>
                    {data.obtenerTareas.map(tarea =>(
                        <Tarea
                            key={tarea.id}
                            tarea={tarea}
                            proyectoId={id}
                        />
                    ))}
                </List>
            </Content>
            {mensaje && mostrarAlerta()}
        </Container>
    )
}

const styles = StyleSheet.create({
    contenido:{
        backgroundColor : '#FFF',
        marginHorizontal: '2.5%'
    }
})

export default Proyecto;