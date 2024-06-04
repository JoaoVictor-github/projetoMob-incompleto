import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira uma localização valida.');
      return;
    }
    try {
      const apiKey = '1993e977'; // Substitua pelo seu próprio API Key
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'O Lugar não foi encontrado. Verifique o cep e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do Endereço. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Encontre Sua Localização
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o cep do seu endereço"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <Button title="Buscar Localização" onPress={handleSearch} />

      {movieData && (
        <View style={styles.movieDataContainer}>
          <Text style={styles.subtitle}>{movieData.Title}</Text>
          <Text>Ano: {movieData.Year}</Text>
          <Text>Gênero: {movieData.Genre}</Text>
          <Text>Diretor: {movieData.Director}</Text>
          <Text>Prêmios: {movieData.Awards}</Text>
        </View> )}

      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.subtitle}>Veja Sua Localização Aqui!</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Você Esta Aqui!"
            />
          </MapView>
        </View>
      )}
        </View>
  ); 
};

const styles = StyleSheet.create({
  container: {
    flex: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#1C1C1C',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    margin: 20,
    padding: 15,
    textAlign: 'center',
    backgroundColor: '#836FFF',
    borderRadius: 20,
  },
  input: {
    borderWidth: 2,
    margin: 5,
    padding: 5,
    borderRadius: 10,
  },
  locationContainer: {
    marginTop: 20,
    width: '90%',
    backgroundColor: '#836FFF',
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  movieDataContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#836FFF',
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold', },
});

export default App;
