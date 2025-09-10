import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateTripPlan = async (tripData: any) => {
  const location = tripData?.locationInfo?.name || tripData?.destination || tripData?.location || 'New York';
  const traveler = tripData?.travelers?.title || tripData?.traveler || 'Solo';
  const budget = tripData?.budget || 'Moderate';
  const days = tripData?.days || 3;
  
  const prompt = `Create a detailed travel plan for ${location} for ${days} days with ${budget} budget for ${traveler} traveler(s). 

Provide the response in this exact JSON format:
{
  "tripDetails": {
    "destination": "${location}",
    "duration": "${days} days",
    "budget": "${budget}",
    "travelerType": "${traveler}"
  },
  "flights": [
    {
      "airline": "Airline Name",
      "flightNumber": "Flight Number",
      "departure": "Departure City",
      "arrival": "${location}",
      "departureTime": "Time",
      "arrivalTime": "Time",
      "price": "Flight Price",
      "duration": "Flight Duration"
    }
  ],
  "hotels": [
    {
      "name": "Hotel Name",
      "address": "Hotel Address",
      "price": "Price per night",
      "rating": 4.5,
      "description": "Hotel description"
    }
  ],
  "itinerary": {
    "day1": {
      "places": [
        {
          "name": "Place Name",
          "details": "Place description",
          "ticketPrice": "Entry fee",
          "timeToVisit": "Duration",
          "bestTime": "Best time to visit"
        }
      ]
    }
  }
}

Only return valid JSON, no other text.`;

  console.log('Sending prompt:', prompt);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    console.log('Raw AI response:', text.substring(0, 200));
    
    // Clean the response - remove markdown code blocks
    if (text.includes('```json')) {
      text = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      text = text.split('```')[1].split('```')[0].trim();
    }
    
    // Extract JSON object
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      text = text.substring(jsonStart, jsonEnd + 1);
    }
    
    console.log('Cleaned JSON:', text.substring(0, 200));
    
    if (!text.startsWith('{')) {
      return { error: 'No valid JSON found', message: text };
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating trip plan:', error);
    return { error: 'Generation failed', message: (error as Error).message };
  }
};

export default { generateTripPlan };