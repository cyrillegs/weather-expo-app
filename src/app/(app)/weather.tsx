import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    pressure_msl: number;
    cloud_cover: number;
    weather_code: number;
    is_day: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
    weather_code: number[];
  };
}

const getWeatherIcon = (code: number) => {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "🌤️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 55) return "🌧️";
  if (code >= 56 && code <= 57) return "🌨️";
  if (code >= 61 && code <= 65) return "🌧️";
  if (code >= 66 && code <= 67) return "🌨️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95 && code <= 99) return "⛈️";
  return "🌤️";
};

export default function WeatherPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cityData, setCityData] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      try {
        const decodedId = decodeURIComponent(params.id as string);
        const parsedCityData = JSON.parse(decodedId);
        setCityData(parsedCityData);
        fetchWeatherData(parsedCityData);
      } catch (error) {
        console.error("Error parsing city data:", error);
        Alert.alert("Error", "Invalid city data");
        router.back();
      }
    }
  }, [params.id]);

  const fetchWeatherData = async (city: any) => {
    if (!city.latitude || !city.longitude) {
      Alert.alert("Error", "Location coordinates not available");
      setIsLoading(false);
      return;
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=weather_code,temperature_2m_min,temperature_2m_max,precipitation_sum,sunrise,sunset&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,pressure_msl,weather_code,is_day&timezone=auto`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) setWeatherData(data);
      else Alert.alert("Error", "Failed to fetch weather data");
    } catch (error) {
      console.error("Weather API error:", error);
      Alert.alert("Error", "Failed to fetch weather data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4 text-lg">
          Loading weather data...
        </Text>
      </SafeAreaView>
    );
  }

  if (!weatherData || !cityData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Text className="text-gray-600 text-lg text-center mb-4">
          Unable to load weather data
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-500 rounded-xl py-3 px-6"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center shadow-sm"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Weather</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-6 pb-8">
          {/* Current Weather */}
          <View className="items-center mb-4">
            <Text className="text-3xl font-bold text-gray-800 mb-1">
              {cityData.name}
            </Text>
            <Text className="text-[70px] font-bold text-gray-800 my-1">
              {Math.round(weatherData.current.temperature_2m)}°
            </Text>
            <Text className="text-[50px] text-gray-800 mb-1">
              {getWeatherIcon(weatherData.current.weather_code)}
            </Text>
            <Text className="text-base text-gray-600">
              Feels like {Math.round(weatherData.current.apparent_temperature)}°
            </Text>
          </View>

          {/* Current Details */}
          <View className="bg-blue-300 rounded-3xl p-5 mb-6">
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <MaterialCommunityIcons
                  name="water-percent"
                  size={26}
                  color="#1e3a8a"
                />
                <Text className="text-blue-900 mt-2">Humidity</Text>
                <Text className="text-blue-900 font-bold text-lg">
                  {weatherData.current.relative_humidity_2m}%
                </Text>
              </View>

              <View className="items-center flex-1 border-x border-blue-400">
                <MaterialCommunityIcons
                  name="weather-windy"
                  size={26}
                  color="#1e3a8a"
                />
                <Text className="text-blue-900 mt-2">Wind</Text>
                <Text className="text-blue-900 font-bold text-lg">
                  {weatherData.current.wind_speed_10m} km/h
                </Text>
              </View>

              <View className="items-center flex-1">
                <MaterialCommunityIcons name="gauge" size={26} color="#1e3a8a" />
                <Text className="text-blue-900 mt-2">Pressure</Text>
                <Text className="text-blue-900 font-bold text-lg">
                  {weatherData.current.pressure_msl}
                </Text>
              </View>
            </View>
          </View>

          {/* Today’s Details */}
          <View className="bg-white rounded-3xl p-5 mb-6 shadow-lg">
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              Today's Details
            </Text>
            <View className="space-y-4">
              <WeatherDetail
                icon="thermometer"
                label="Temperature Range"
                value={`${Math.round(weatherData.daily.temperature_2m_max[0])}° / ${Math.round(weatherData.daily.temperature_2m_min[0])}°`}
              />
              <WeatherDetail
                icon="weather-pouring"
                label="Precipitation"
                value={`${weatherData.daily.precipitation_sum[0]} mm`}
              />
              <WeatherDetail
                icon="weather-sunset-up"
                label="Sunrise"
                value={weatherData.daily.sunrise[0].split("T")[1]}
              />
              <WeatherDetail
                icon="weather-sunset-down"
                label="Sunset"
                value={weatherData.daily.sunset[0].split("T")[1]}
              />
            </View>
          </View>

          {/* 7-Day Forecast */}
          <View className="bg-white rounded-3xl p-5 shadow-lg">
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              7-Day Forecast
            </Text>
            {weatherData.daily.weather_code.map((code, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <Text className="text-gray-600 text-base w-20">
                  {index === 0
                    ? "Today"
                    : index === 1
                    ? "Tomorrow"
                    : `In ${index + 1} days`}
                </Text>
                <Text className="text-3xl">{getWeatherIcon(code)}</Text>
                <Text className="text-gray-600 text-base flex-1 text-center">
                  {Math.round(weatherData.daily.temperature_2m_max[index])}° /{" "}
                  {Math.round(weatherData.daily.temperature_2m_min[index])}°
                </Text>
                <Text className="text-gray-800 font-bold text-base w-12 text-right">
                  {Math.round(weatherData.daily.temperature_2m_max[index])}°
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const WeatherDetail = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <View className="flex-row justify-between items-center">
    <View className="flex-row items-center">
      <MaterialCommunityIcons name={icon} size={24} color="#4B5563" />
      <Text className="text-gray-600 ml-2">{label}</Text>
    </View>
    <Text className="text-gray-800 font-semibold">{value}</Text>
  </View>
);
