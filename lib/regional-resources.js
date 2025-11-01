/**
 * Regional Resources System
 * Provides location-specific mental health resources, helplines, and support
 */

// State-wise mental health resources
const STATE_RESOURCES = {
  "Maharashtra": {
    region: "west",
    helplines: [
      {
        name: "Connecting Trust",
        number: "022-25521111",
        hours: "12 PM - 8 PM",
        languages: ["English", "Hindi", "Marathi"],
        type: "crisis"
      },
      {
        name: "iCall - TISS",
        number: "9152987821",
        email: "icall@tiss.edu",
        hours: "8 AM - 10 PM (Mon-Sat)",
        languages: ["English", "Hindi", "Marathi", "Gujarati"],
        type: "counseling"
      },
      {
        name: "Mpower 1on1",
        number: "1800-120-820050",
        hours: "24/7",
        languages: ["English", "Hindi", "Marathi"],
        type: "crisis"
      }
    ],
    organizations: [
      {
        name: "TISS - Tata Institute of Social Sciences",
        city: "Mumbai",
        services: ["Counseling", "Crisis Intervention", "Training"],
        website: "http://www.tiss.edu"
      },
      {
        name: "Mpower",
        city: "Mumbai",
        services: ["Mental Health Clinics", "Counseling", "Awareness"],
        website: "https://mpowerminds.com"
      }
    ],
    localPractices: [
      "Yoga centers in Mumbai and Pune",
      "Vipassana meditation centers in Igatpuri",
      "Art therapy workshops"
    ]
  },
  
  "Tamil Nadu": {
    region: "south",
    helplines: [
      {
        name: "Sneha",
        number: "044-24640050",
        hours: "24/7",
        languages: ["English", "Tamil", "Hindi"],
        type: "crisis"
      },
      {
        name: "Speak2Us",
        number: "8056000467",
        hours: "24/7",
        languages: ["English", "Tamil"],
        type: "youth"
      }
    ],
    organizations: [
      {
        name: "Sneha India",
        city: "Chennai",
        services: ["Suicide Prevention", "Emotional Support", "Crisis Intervention"],
        website: "http://www.snehaindia.org"
      },
      {
        name: "Schizophrenia Research Foundation (SCARF)",
        city: "Chennai",
        services: ["Mental Health Treatment", "Research", "Rehabilitation"],
        website: "https://scarfindia.org"
      }
    ],
    localPractices: [
      "Bharatanatyam dance therapy",
      "Traditional Tamil music meditation",
      "Temple wellness programs"
    ]
  },
  
  "Karnataka": {
    region: "south",
    helplines: [
      {
        name: "Parivarthan",
        number: "080-65333323",
        hours: "24/7",
        languages: ["English", "Kannada", "Hindi"],
        type: "counseling"
      },
      {
        name: "Sahai",
        number: "080-25497777",
        hours: "10 AM - 6 PM",
        languages: ["English", "Kannada"],
        type: "crisis"
      }
    ],
    organizations: [
      {
        name: "NIMHANS - National Institute of Mental Health",
        city: "Bangalore",
        services: ["Mental Health Treatment", "Research", "Training"],
        website: "https://nimhans.ac.in"
      },
      {
        name: "Parivarthan Counselling Centre",
        city: "Bangalore",
        services: ["Individual Counseling", "Family Therapy", "De-addiction"],
        website: "http://www.parivarthan.org"
      }
    ],
    localPractices: [
      "Yoga institutes in Bangalore and Mysore",
      "Mindfulness centers",
      "Art therapy"
    ]
  },
  
  "Delhi": {
    region: "north",
    helplines: [
      {
        name: "Vandrevala Foundation",
        number: "9999666555",
        hours: "24/7",
        languages: ["English", "Hindi", "Punjabi", "Urdu"],
        type: "crisis"
      },
      {
        name: "iCall",
        number: "9152987821",
        hours: "8 AM - 10 PM",
        languages: ["English", "Hindi"],
        type: "counseling"
      }
    ],
    organizations: [
      {
        name: "VIMHANS - Institute of Mental Health",
        city: "Delhi",
        services: ["Mental Health Treatment", "De-addiction", "Counseling"],
        website: "https://vimhans.in"
      },
      {
        name: "The Mind Clan",
        city: "Delhi",
        services: ["Online Therapy", "Counseling", "Support Groups"],
        website: "https://themindclan.com"
      }
    ],
    localPractices: [
      "Pranayama and meditation centers",
      "Sufi music therapy",
      "Support groups in community centers"
    ]
  },
  
  "West Bengal": {
    region: "east",
    helplines: [
      {
        name: "Kolkata Sanved",
        number: "033-24637401",
        hours: "10 AM - 6 PM",
        languages: ["English", "Bengali", "Hindi"],
        type: "crisis"
      },
      {
        name: "Samaritans Kolkata",
        number: "033-24637401",
        hours: "24/7",
        languages: ["English", "Bengali"],
        type: "crisis"
      }
    ],
    organizations: [
      {
        name: "Sanved",
        city: "Kolkata",
        services: ["Crisis Support", "Counseling", "Workshops"],
        website: "http://www.sanved.org"
      },
      {
        name: "iCALL - Kolkata Chapter",
        city: "Kolkata",
        services: ["Phone Counseling", "Email Support"],
        website: "http://icallhelpline.org"
      }
    ],
    localPractices: [
      "Rabindra Sangeet music therapy",
      "Traditional Bengali wellness practices",
      "Community cultural programs"
    ]
  },
  
  "Telangana": {
    region: "south",
    helplines: [
      {
        name: "Roshni Trust",
        number: "040-66202000",
        hours: "11 AM - 9 PM",
        languages: ["English", "Telugu", "Hindi"],
        type: "crisis"
      },
      {
        name: "Mitram Foundation",
        number: "080-25722573",
        hours: "10 AM - 6 PM",
        languages: ["English", "Telugu"],
        type: "counseling"
      }
    ],
    organizations: [
      {
        name: "Roshni Trust",
        city: "Hyderabad",
        services: ["Suicide Prevention", "Counseling", "Support Groups"],
        website: "http://roshnihyd.org"
      }
    ],
    localPractices: [
      "Telugu classical music meditation",
      "Yoga centers",
      "Traditional healing practices"
    ]
  },
  
  "Gujarat": {
    region: "west",
    helplines: [
      {
        name: "Saath",
        number: "079-26305544",
        hours: "12 PM - 8 PM",
        languages: ["English", "Gujarati", "Hindi"],
        type: "counseling"
      }
    ],
    organizations: [
      {
        name: "Saath Charitable Trust",
        city: "Ahmedabad",
        services: ["Community Mental Health", "Counseling", "Youth Programs"],
        website: "https://saath.org"
      }
    ],
    localPractices: [
      "Community wellness programs",
      "Garba therapy (festival season)",
      "Yoga and meditation centers"
    ]
  },
  
  "Kerala": {
    region: "south",
    helplines: [
      {
        name: "Maithri",
        number: "0484-2540530",
        hours: "24/7",
        languages: ["English", "Malayalam", "Hindi"],
        type: "crisis"
      }
    ],
    organizations: [
      {
        name: "Maithri",
        city: "Kochi",
        services: ["Suicide Prevention", "Emotional Support", "Crisis Intervention"],
        website: "https://maithrikochi.org"
      }
    ],
    localPractices: [
      "Ayurvedic mental wellness treatments",
      "Traditional Kerala healing",
      "Yoga and meditation retreats"
    ]
  },
  
  "Punjab": {
    region: "north",
    helplines: [
      {
        name: "Fortis Stress Helpline",
        number: "0172-5021000",
        hours: "24/7",
        languages: ["English", "Punjabi", "Hindi"],
        type: "crisis"
      }
    ],
    organizations: [
      {
        name: "Department of Psychiatry, PGI",
        city: "Chandigarh",
        services: ["Mental Health Treatment", "Counseling", "Research"],
        website: "https://pgimer.edu.in"
      }
    ],
    localPractices: [
      "Gurbani kirtan music therapy",
      "Community wellness through Gurdwaras",
      "Yoga centers"
    ]
  }
}

// National helplines (available everywhere)
const NATIONAL_HELPLINES = [
  {
    name: "National Suicide Prevention Helpline",
    number: "9152987821",
    hours: "24/7",
    languages: ["English", "Hindi"],
    type: "crisis",
    coverage: "National"
  },
  {
    name: "AASRA - Crisis Helpline",
    number: "9820466726",
    hours: "24/7",
    languages: ["English", "Hindi"],
    type: "crisis",
    coverage: "National"
  },
  {
    name: "Vandrevala Foundation",
    number: "9999666555",
    hours: "24/7",
    languages: ["English", "Hindi", "Regional Languages"],
    type: "crisis",
    coverage: "National"
  },
  {
    name: "Mann Talks (Shantakaram Foundation)",
    number: "+918686139139",
    hours: "10 AM - 6 PM",
    languages: ["English", "Hindi"],
    type: "counseling",
    coverage: "National"
  },
  {
    name: "Sumaitri",
    number: "011-23389090",
    hours: "2 PM - 10 PM",
    languages: ["English", "Hindi"],
    type: "crisis",
    coverage: "National"
  }
]

// Traditional Indian wellness practices by region
const TRADITIONAL_WELLNESS_PRACTICES = {
  north: [
    {
      name: "Pranayama and Breathwork",
      description: "Ancient breathing techniques for stress relief and mental clarity",
      benefits: ["Reduces anxiety", "Improves focus", "Calms mind"]
    },
    {
      name: "Kirtan and Bhajan",
      description: "Devotional music and chanting for emotional release",
      benefits: ["Community connection", "Emotional expression", "Spiritual peace"]
    }
  ],
  south: [
    {
      name: "Classical Music Therapy",
      description: "Carnatic music and ragas for mood regulation",
      benefits: ["Mood enhancement", "Stress reduction", "Emotional balance"]
    },
    {
      name: "Temple Meditation",
      description: "Structured meditation practices in sacred spaces",
      benefits: ["Mental peace", "Spiritual grounding", "Community support"]
    }
  ],
  east: [
    {
      name: "Tagore Music and Poetry",
      description: "Rabindra Sangeet for emotional well-being",
      benefits: ["Artistic expression", "Cultural connection", "Emotional release"]
    },
    {
      name: "Community Cultural Programs",
      description: "Durga Puja and cultural celebrations for social bonding",
      benefits: ["Social support", "Cultural pride", "Community belonging"]
    }
  ],
  west: [
    {
      name: "Garba and Folk Dance",
      description: "Rhythmic movement and community dance for joy",
      benefits: ["Physical activity", "Social connection", "Stress relief"]
    },
    {
      name: "Vipassana Meditation",
      description: "Silent meditation retreats for deep mental clarity",
      benefits: ["Self-awareness", "Mental discipline", "Inner peace"]
    }
  ],
  northeast: [
    {
      name: "Nature-Based Wellness",
      description: "Connection with nature and tribal healing practices",
      benefits: ["Grounding", "Peace", "Cultural identity"]
    }
  ]
}

class RegionalResourceProvider {
  /**
   * Get resources based on user's state/city
   * @param {string} state - User's state
   * @param {string} city - User's city (optional)
   * @returns {Object} Localized resources
   */
  getLocalResources(state, city = null) {
    const stateResources = STATE_RESOURCES[state] || null
    
    return {
      state,
      city,
      hasLocalResources: !!stateResources,
      localHelplines: stateResources?.helplines || [],
      localOrganizations: city 
        ? (stateResources?.organizations || []).filter(org => org.city === city)
        : (stateResources?.organizations || []),
      nationalHelplines: NATIONAL_HELPLINES,
      region: stateResources?.region || "general",
      traditionalPractices: stateResources?.localPractices || [],
      regionalWellness: TRADITIONAL_WELLNESS_PRACTICES[stateResources?.region] || []
    }
  }

  /**
   * Get emergency contacts based on crisis level
   * @param {string} state - User's state
   * @param {string} crisisLevel - Crisis severity
   * @returns {Array} Priority-ordered helplines
   */
  getEmergencyContacts(state, crisisLevel = "MODERATE") {
    const resources = this.getLocalResources(state)
    const allHelplines = [...resources.nationalHelplines, ...resources.localHelplines]
    
    // Filter crisis helplines for high urgency
    if (crisisLevel === "CRISIS" || crisisLevel === "HIGH") {
      return allHelplines
        .filter(h => h.type === "crisis")
        .sort((a, b) => {
          // Prioritize 24/7 helplines
          if (a.hours.includes("24/7") && !b.hours.includes("24/7")) return -1
          if (!a.hours.includes("24/7") && b.hours.includes("24/7")) return 1
          return 0
        })
    }
    
    return allHelplines
  }

  /**
   * Get culturally appropriate wellness suggestions
   * @param {string} state - User's state
   * @param {string} culturalPreferences - User's cultural interests
   * @returns {Array} Personalized wellness activities
   */
  getWellnessSuggestions(state, culturalPreferences = {}) {
    const resources = this.getLocalResources(state)
    const suggestions = []
    
    // Add regional practices
    suggestions.push(...resources.regionalWellness)
    
    // Add traditional practices based on preferences
    if (culturalPreferences.music) {
      suggestions.push({
        name: "Music-Based Therapy",
        description: `Explore ${resources.region} Indian classical music for emotional well-being`,
        benefits: ["Mood regulation", "Cultural connection", "Stress relief"]
      })
    }
    
    if (culturalPreferences.spirituality) {
      suggestions.push({
        name: "Meditation and Mindfulness",
        description: "Traditional Indian meditation practices rooted in your region",
        benefits: ["Mental clarity", "Spiritual peace", "Stress reduction"]
      })
    }
    
    if (culturalPreferences.yoga) {
      suggestions.push({
        name: "Yoga and Pranayama",
        description: "Structured yoga practice for mental and physical wellness",
        benefits: ["Flexibility", "Calm mind", "Energy balance"]
      })
    }
    
    return suggestions
  }

  /**
   * Format resource for display in chat
   * @param {Object} resource - Resource object
   * @param {string} type - Resource type
   * @returns {string} Formatted message
   */
  formatResourceForChat(resource, type = "helpline") {
    if (type === "helpline") {
      return `**${resource.name}**
📞 ${resource.number}${resource.email ? `\n📧 ${resource.email}` : ''}
🕒 ${resource.hours}
🗣️ Languages: ${resource.languages.join(", ")}
${resource.coverage ? `📍 ${resource.coverage}` : ''}`
    }
    
    if (type === "organization") {
      return `**${resource.name}** - ${resource.city}
🏥 Services: ${resource.services.join(", ")}
🌐 ${resource.website}`
    }
    
    if (type === "practice") {
      return `**${resource.name}**
${resource.description}
✨ Benefits: ${resource.benefits.join(", ")}`
    }
    
    return JSON.stringify(resource)
  }

  /**
   * Get festival-specific emotional support
   * @param {string} region - User's region
   * @param {number} month - Current month (0-11)
   * @returns {Object} Festival support info
   */
  getFestivalSupport(region, month) {
    const festivalStressors = {
      8: { // September
        festivals: ["Ganesh Chaturthi", "Onam"],
        support: "Festival seasons can be overwhelming with family gatherings and expectations. It's okay to set boundaries and take breaks when needed."
      },
      9: { // October
        festivals: ["Navratri", "Dussehra", "Durga Puja"],
        support: "The festive season brings joy but also pressure. Remember to balance celebrations with self-care. It's fine to participate at your own pace."
      },
      10: { // November
        festivals: ["Diwali", "Karva Chauth"],
        support: "Diwali preparations and family expectations can be stressful. Communicate your needs and don't hesitate to ask for help. Your well-being matters."
      }
    }
    
    return festivalStressors[month] || null
  }
}

// Singleton instance
const regionalResourceProvider = new RegionalResourceProvider()

export default regionalResourceProvider
export { RegionalResourceProvider, STATE_RESOURCES, NATIONAL_HELPLINES, TRADITIONAL_WELLNESS_PRACTICES }
