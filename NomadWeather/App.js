import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "965baaa0494452968254df43bcc1f8c9";

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

        {days.length === 0 ? (<View style={styles.day}>
          <ActivityIndicator color="white" size="large" style={{ marginTpop: 10 }} />
        </View>) : (
          days.map((day, index) =>
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>)
        )}

      </ScrollView>
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
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
  }
})

