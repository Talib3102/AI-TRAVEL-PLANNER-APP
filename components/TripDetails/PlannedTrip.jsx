import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';

// Define how each place should be rendered
const renderPlace = ({ item }) => (
  <View style={styles.activity}>
    <Text style={styles.activityTitle}>{item.name}</Text>
    <Text>Details: {item.details}</Text>
    <Text>Ticket Price: {item.ticketPrice}</Text>
    <Text>Time to Visit: {item.timeToVisit}</Text>
    <Text>Best Time: {item.bestTime}</Text>
  </View>
);

const PlannedTrip = ({ details }) => {
  console.log("details from plan trip", details);
  const [placeImages, setPlaceImages] = useState({});

  // PHOTO FETCHING FUNCTION - Get Google Photos for places
  const getPlacePhoto = async (placeName) => {
    try {
      // Clean the place name - remove parentheses and extra descriptions
      let cleanedName = placeName
        .split('(')[0] // Remove everything after first parenthesis
        .split(' or ')[0] // Take first option if multiple options
        .trim();
      
      console.log('Original place name:', placeName);
      console.log('Cleaned place name:', cleanedName);
      
      // STEP 1: Search for the place using Google Places Text Search API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(cleanedName)}&inputtype=textquery&fields=photos&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      // STEP 2: Convert response to JSON
      const data = await response.json();
      console.log('API response for', placeName, ':', data);
      
      // STEP 3: Check if we got photo data
      if (data.candidates && data.candidates[0]?.photos) {
        // STEP 4: Extract photo_reference
        const photoReference = data.candidates[0].photos[0].photo_reference;
        console.log('Found photo for', placeName, 'with reference:', photoReference);
        // STEP 5: Build photo URL
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      } else {
        console.log('No photos found for:', placeName);
      }
    } catch (error) {
      console.log('Error fetching place photo for', placeName, ':', error);
    }
    return null;
  };

  // TRIGGER PHOTO FETCHING for all places
  useEffect(() => {
    const fetchAllImages = async () => {
      const sortedDays = Object.entries(details).sort(([a], [b]) => {
        const dayNumA = parseInt(a.replace('day', ''));
        const dayNumB = parseInt(b.replace('day', ''));
        return dayNumA - dayNumB;
      });

      for (const [day, dayData] of sortedDays) {
        if (dayData.places) {
          for (let placeIndex = 0; placeIndex < dayData.places.length; placeIndex++) {
            const place = dayData.places[placeIndex];
            const imageKey = `${day}-${placeIndex}`;
            const imageUrl = await getPlacePhoto(place.name);
            console.log('Image URL for', place.name, ':', imageUrl);
            if (imageUrl) {
              setPlaceImages(prev => ({ ...prev, [imageKey]: imageUrl }));
            }
          }
        }
      }
    };

    if (Object.keys(details).length > 0) {
      fetchAllImages();
    }
  }, [details]);

  // Sort days to ensure proper sequence (day1, day2, day3)
  const sortedDays = Object.entries(details).sort(([a], [b]) => {
    const dayNumA = parseInt(a.replace('day', ''));
    const dayNumB = parseInt(b.replace('day', ''));
    return dayNumA - dayNumB;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏕️ Plan Details</Text>
      {sortedDays.map(([day, dayData], index) => (
        <View key={index} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>Day {day.replace('day', '')}</Text>
          {dayData.places && dayData.places.map((place, placeIndex) => {
            const imageKey = `${day}-${placeIndex}`;
            return (
              <View key={placeIndex} style={styles.activity}>
                {/* DISPLAY PLACE IMAGE */}
                <Image 
                  source={placeImages[imageKey] ? { uri: placeImages[imageKey] } : require('./../../assets/images/travel.jpg')} 
                  style={styles.placeImage} 
                />
                <View style={styles.placeInfo}>
                  <Text style={styles.activityTitle}>{place.name}</Text>
                  <Text>Details: {place.details}</Text>
                  <Text>Ticket Price: {place.ticketPrice}</Text>
                  <Text>Time to Visit: {place.timeToVisit}</Text>
                  <Text>Best Time: {place.bestTime}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default PlannedTrip;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
    marginBottom: 10,
  },
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activity: {
    marginBottom: 15,
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    overflow: 'hidden',
  },
  placeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeInfo: {
    flex: 1,
    padding: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});