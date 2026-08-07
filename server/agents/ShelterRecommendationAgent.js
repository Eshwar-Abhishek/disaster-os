/**
 * RESQ Agent #9: Shelter Recommendation Agent
 * Evaluates and ranks emergency shelters based on:
 * Distance, Available Capacity, Food, Water, Medical Support,
 * Wheelchair Accessibility, and Pet-Friendly Status.
 */

class ShelterRecommendationAgent {
  async process(preferences = {}, sheltersList = []) {
    const { 
      userLat = 17.3850, 
      userLng = 78.4867, 
      requirePetFriendly = false, 
      requireWheelchair = false,
      requireMedical = false 
    } = preferences;

    const ranked = sheltersList.map(shelter => {
      // Haversine distance calculation in KM
      const dLat = (shelter.latitude - userLat) * Math.PI / 180;
      const dLng = (shelter.longitude - userLng) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * Math.PI / 180) * Math.cos(shelter.latitude * Math.PI / 180) * 
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = (6371 * c).toFixed(1);

      const availableCapacity = Math.max(0, shelter.capacity - shelter.occupied);
      let score = 100;

      // Distance penalty (-10 points per km)
      score -= (parseFloat(distanceKm) * 10);

      // Capacity bonus
      if (availableCapacity > 100) score += 20;
      else if (availableCapacity === 0) score -= 50;

      // Feature matching
      if (shelter.food_available) score += 15;
      if (shelter.water_available) score += 15;
      if (shelter.medical_support) score += 20;

      if (requirePetFriendly) {
        score += shelter.pet_friendly ? 30 : -40;
      }
      if (requireWheelchair) {
        score += shelter.wheelchair_accessible ? 30 : -40;
      }
      if (requireMedical) {
        score += shelter.medical_support ? 30 : -30;
      }

      return {
        ...shelter,
        distanceKm,
        availableCapacity,
        matchScore: Math.max(0, Math.round(score)),
        recommendationReason: `Distance: ${distanceKm}km, Occupancy: ${shelter.occupied}/${shelter.capacity}, Medical: ${shelter.medical_support ? 'Yes' : 'No'}, Pet Friendly: ${shelter.pet_friendly ? 'Yes' : 'No'}`
      };
    });

    // Sort descending by match score
    ranked.sort((a, b) => b.matchScore - a.matchScore);

    return {
      agentName: 'Shelter Recommendation Agent',
      timestamp: new Date().toISOString(),
      recommendedShelters: ranked,
      bestMatch: ranked[0] || null
    };
  }
}

module.exports = new ShelterRecommendationAgent();
