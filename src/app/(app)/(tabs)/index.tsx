import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import CountryPicker from "@/components/CountryPicker";
import CityPicker from "@/components/CityPicker";
import WeatherModal from "@/components/WeatherModal";
import { router } from "expo-router";

interface CountryData {
  code: string;
  name: string;
  flag: string;
}

interface CityData {
  name: string;
  stateCode: string;
  countryCode: string;
  isCountry?: boolean;
  latitude?: number;
  longitude?: number;
}

export default function Index() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null
  );
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
    setSelectedCity(null);
  };

  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city);
  };

  console.log("selectedcountry", selectedCountry);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
              Weather App
            </Text>
            <Text className="text-gray-600 text-center text-base">
              Search and select location to get weather information
            </Text>
          </View>

          {/* Location Selection Card */}
          <View className="bg-white rounded-2xl shadow-lg shadow-gray-200 p-6 mb-6">
            {/* Country Selection */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2 text-sm">
                Select Country
              </Text>
              <CountryPicker
                selectedCountry={selectedCountry}
                onSelectCountry={handleCountrySelect}
              />
            </View>

            {/* City Selection */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2 text-sm">
                Select City
                {selectedCountry && ` in ${selectedCountry.name}`}
              </Text>
              <CityPicker
                // selectedCountry={selectedCountry}
                selectedCity={selectedCity}
                onSelectCity={handleCitySelect}
                countryCode={selectedCountry?.code || ""}
              />
            </View>

            {/* Selected Location Display */}
            {selectedCountry && selectedCity && (
              <View className="mt-4 p-4 bg-blue-50 rounded-xl">
                <Text className="text-gray-700 font-medium mb-2 text-sm">
                  Selected Location:
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">{selectedCountry.flag}</Text>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-semibold text-lg">
                      {selectedCity.name}
                    </Text>
                    <Text className="text-gray-600 text-base">
                      {selectedCountry.name} ({selectedCountry.code})
                    </Text>
                    {selectedCity.stateCode && (
                      <Text className="text-gray-500 text-sm">
                        State: {selectedCity.stateCode}
                      </Text>
                    )}
                    {selectedCity.latitude && selectedCity.longitude && (
                      <Text className="text-gray-500 text-sm">
                        Coordinates: {selectedCity.latitude.toFixed(4)},{" "}
                        {selectedCity.longitude.toFixed(4)}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Get Weather Button */}
          <TouchableOpacity
            onPress={() => {
              if (selectedCity) {
                const cityData = JSON.stringify(selectedCity);
                router.push(`/weather?id=${encodeURIComponent(cityData)}`);
              }
            }}
            disabled={!selectedCountry || !selectedCity}
            className={`rounded-xl py-4 px-6 mb-4 ${
              !selectedCountry || !selectedCity ? "bg-gray-300" : "bg-blue-500"
            }`}
          >
            <Text className="text-white font-semibold text-center text-base">
              Get Weather
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}