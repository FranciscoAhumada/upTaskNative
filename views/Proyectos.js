import React, {useState} from 'react';
import { StyleSheet } from 'react-native';
import {Container, Button, Text, H2, Content, ListItem, Left, Right, List} from 'native-base';
import globalStyle from '../style/global';
import {useNavigation} from '@react-navigation/native';
import {gql, useQuery} from '@apollo/client';

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos{
        obtenerProyectos {
            id
            nombre
        }
    }
`;

const Proyectos = () => {

    const navigation = useNavigation(); 

    const { data, loading, error } = useQuery(OBTENER_PROYECTOS);

    return (
        <Container style={[globalStyle.contenedor, {backgroundColor: '#E84347'}]}>
            <Button
                style={[globalStyle.boton, {marginTop:30}]}
                square
                block
                onPress={()=>navigation.navigate('NuevoProyecto')}
            >
                <Text style={globalStyle.botonTexto}>Nuevo Proyecto</Text>
            </Button>
            <H2 style={globalStyle.subTitulo}>Selecciona un proyecto</H2>
            <Content>
                <List style={styles.contenido}>
                    {data && data.obtenerProyectos &&
                        data.obtenerProyectos.map(proyecto=>(
                        <ListItem
                            key = {proyecto.id}
                            onPress={()=>navigation.navigate('Proyecto', proyecto)}
                        >
                            <Left>
                                <Text>{proyecto.nombre}</Text>
                            </Left>
                            <Right>

                            </Right>
                        </ListItem>
                    ))}
                </List>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    contenido : {
        backgroundColor : '#FFF',
        marginHorizontal : '2.5%'
    }
})

export default Proyectos;