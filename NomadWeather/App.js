import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "965baaa0494452968254df43bcc1f8c9";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}


export default function App() {
  const [region, setRegion] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setRegion(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
    console.log(json);
  }

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{region}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>

        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItmes: 'center' }}>
            <ActivityIndicator color="white" size="large" style={{ marginTpop: 10 }} />
          </View>
        ) : (
          days.map((day, index) =>
            <View key={index} style={styles.day}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color='white' />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>)
        )
        }

      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
    color: "white",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    fontWeight: 600,
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: 500,
  },
  tinyText: {
    fontSize: 20,
    color: "white",
  }
})

