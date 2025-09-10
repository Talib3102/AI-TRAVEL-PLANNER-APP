import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '@/constants/Colors';

const FlightInfo = ({ flightData }) => {
  if (!flightData || flightData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>✈️ Flights</Text>
        <Text style={styles.para}>No flight information available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.flexContainer}>
        <Text style={styles.title}>✈️ Flights</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            // Handle booking URL if available
            if (flightData[0]?.booking_url) {
              Linking.openURL(flightData[0].booking_url);
            }
          }}
        >
          <Text style={styles.buttonTxt}>Book Here</Text>
        </TouchableOpacity>
      </View>
      {flightData.map((flight, index) => (
        <View key={index} style={styles.flightContainer}>
          <Text style={styles.para}>Airline: {flight.airline}</Text>
          <Text style={styles.para}>Flight: {flight.flightNumber}</Text>
          <Text style={styles.para}>Route: {flight.departure} → {flight.arrival}</Text>
          <Text style={styles.para}>Time: {flight.departureTime} - {flight.arrivalTime}</Text>
          <Text style={styles.para}>Price: {flight.price}</Text>
          <Text style={styles.para}>Duration: {flight.duration}</Text>
        </View>
      ))}
    </View>
  );
};

export default FlightInfo;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderColor: Colors.GRAY,
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  para: {
    fontSize: 16,
    marginTop: 7,
  },
  button: {
    padding: 8,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
  },
  buttonTxt: {
    color: Colors.WHITE,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  flightContainer: {
    marginTop: 15,
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
