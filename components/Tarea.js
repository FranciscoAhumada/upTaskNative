import React, {useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import { Text, ListItem, Left, Right, Icon, Toast} from 'native-base';
import {gql, useMutation} from '@apollo/client';

const ACTUALIZAR_TAREA = gql`
    mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean){
        actualizarTarea(id:$id, input:$input, estado:$estado){
            nombre
            id
            proyecto
            estado
        }
    }
`;

const ELIMINAR_TAREA = gql`
    mutation eliminarTarea($id: ID!){
        eliminarTarea(id:$id)
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


const Tarea = ({tarea, proyectoId}) => {

    const [actualizarTarea] = useMutation(ACTUALIZAR_TAREA);
    const [eliminarTarea] = useMutation(ELIMINAR_TAREA, {
        update(cache){
            const {obtenerTareas} = cache.readQuery({
                query : OBTENER_TAREAS,
                variables:{
                    input:{
                        proyecto : proyectoId
                    }
                }
            });
            cache.writeQuery({
                query:OBTENER_TAREAS,
                variables:{
                    input:{
                        proyecto : proyectoId
                    }
                },
                data : {
                    obtenerTareas:obtenerTareas.filter( tareaActual => tareaActual.id !== tarea.id)
                }
            })
        }
    });

    const cambiarEstado = async () => {
        const {id} = tarea;
        try {
            const {data} = await actualizarTarea({
                variables:{
                    id,
                    input:{
                        nombre : tarea.nombre
                    },
                    estado : !tarea.estado
                }
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    const mostrarEliminar = () => {
        Alert.alert('Eliminar Tarea', '¿Desea Eliminar la Tarea?',[
            {
                text : 'Cancelar',
                style : 'cancel'
            },
            {
                text : 'Confirmar',
                onPress:()=>eliminarTareaDB()
            }
        ])
    }

    const eliminarTareaDB = async () => {
        const {id} = tarea;
        try {
            const {data} = await eliminarTarea({
                variables:{
                    id
                }
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <ListItem
                onPress={()=>cambiarEstado()}
                onLongPress={()=>mostrarEliminar()}
            >
                <Left>
                    <Text>{tarea.nombre}</Text>
                </Left>
                <Right>
                    {tarea.estado ? (
                        <Icon
                            name='ios-checkmark-circle'
                            style={[styles.icono,styles.completo]}
                        />
                    ):(
                        <Icon
                            name='ios-checkmark-circle'
                            style={[styles.icono,styles.incompleto]}
                        />
                    )}
                </Right>
            </ListItem>
        </>
    )
}

const styles = StyleSheet.create({
    icono : {
        fontSize : 32,
    },
    completo : {
        color : 'green'
    },
    incompleto : {
        color : '#E1E1E1'
    }
});

export default Tarea;