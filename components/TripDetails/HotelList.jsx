import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '@/constants/Colors'

export default function HotelList({ hotelList }) {
  // State to store fetched hotel images with their index as key
  const [hotelImages, setHotelImages] = useState({});

  // PHOTO FETCHING FUNCTION - This is where we get Google Photos
  const getHotelPhoto = async (hotelName) => {
    try {
      // STEP 1: Search for the hotel using Google Places Text Search API
      // This line searches for the hotel by name and requests photo data
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(hotelName)}&inputtype=textquery&fields=photos&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      // STEP 2: Convert the response to JSON format
      const data = await response.json();
      
      // STEP 3: Check if we got photo data from the API response
      if (data.candidates && data.candidates[0]?.photos) {
        // STEP 4: Extract the photo_reference from the first photo
        const photoReference = data.candidates[0].photos[0].photo_reference;
        // STEP 5: Build the actual photo URL using the photo_reference
        // This creates a direct link to the Google-hosted hotel image
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      }
    } catch (error) {
      console.log('Error fetching hotel photo:', error);
    }
    return null; // Return null if no photo found or error occurred
  };

  // TRIGGER PHOTO FETCHING - This runs when hotelList changes
  useEffect(() => {
    if (hotelList && hotelList.length > 0) {
      // Loop through each hotel in the list
      hotelList.forEach(async (hotel, index) => {
        // FETCH PHOTO: Call our photo fetching function for each hotel
        const imageUrl = await getHotelPhoto(hotel.name);
        if (imageUrl) {
          // STORE PHOTO: Save the fetched image URL in state with hotel index
          setHotelImages(prev => ({ ...prev, [index]: imageUrl }));
        }
      });
    }
  }, [hotelList]);

  if (!hotelList || hotelList.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🏨 Hotel Recommendations</Text>
        <Text>No hotel recommendations available</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏨 Hotel Recommendations</Text>
      <FlatList 
        style={styles.hotelList}
        data={hotelList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <View style={styles.hotelCard}>
            {/* DISPLAY PHOTO: Use fetched Google photo if available, otherwise use fallback */}
            <Image 
              source={hotelImages[index] ? { uri: hotelImages[index] } : require('./../../assets/images/travel.jpg')} 
              style={styles.hotelImage} 
            />
            {/* Hotel information section */}
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{item.name}</Text>
              <Text style={styles.hotelAddress}>{item.address}</Text>
              <View style={styles.ratingPriceContainer}>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
                <Text style={styles.price}>💰 {item.price}</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        nestedScrollEnabled={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  hotelList: {
    marginTop: 8
  },
  hotelCard: {
    marginRight: 20,
    width: 180,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    overflow: 'hidden'
  },
  hotelImage: {
    width: 180,
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  hotelInfo: {
    padding: 10
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  hotelAddress: {
    fontSize: 12,
    color: Colors.GRAY,
    marginBottom: 8
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rating: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  price: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.PRIMARY
  }
})