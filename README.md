# AI Mental Wellness Assistant 🧠💙

A culturally-sensitive AI-powered mental wellness companion designed specifically for Indian youth aged 16-25. The assistant, named "Sahayak" (Sanskrit for 'Helper'), provides confidential, empathetic, and culturally aware mental health support to help destigmatize mental wellness conversations.

## 🌟 Features

### Core Mental Wellness Features
- **AI-Powered Conversations**: Compassionate AI companion that understands Indian cultural context
- **Crisis Detection**: Real-time monitoring for signs of mental health crises with appropriate escalation
- **Mood Tracking**: Daily mood check-ins with detailed wellness factor tracking
- **Cultural Adaptation**: Responses tailored to Indian values, family dynamics, and social contexts
- **Resource Recommendations**: Curated mental health resources and crisis helplines

### User Experience Features
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark/Light Theme**: Customizable theme preferences with system detection
- **Conversation Management**: Organize chats with folders, pinning, and search functionality
- **Template System**: Pre-built conversation starters for common mental health topics
- **Cultural Profile Setup**: Personalized experience based on user's cultural background

### Technical Features
- **Real-time Chat Interface**: Smooth, responsive chat experience
- **Local Storage**: Persistent data storage for conversations and preferences
- **Crisis Escalation System**: Automated protocols for high-risk situations
- **Mental Wellness Analytics**: Track mood patterns and wellness trends

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **AI Integration**: Vercel AI SDK with Google AI
- **State Management**: React hooks and local storage
- **UI Components**: Custom component library with shadcn/ui
- **Analytics**: Vercel Analytics integration

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **pnpm** (recommended) or npm/yarn
- **Google AI API Key** (for AI-powered conversations)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd aiassistantuisplit
```

### 2. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your Google AI API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
```

### 4. Development Server
```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Building for Production

### Build the Application
```bash
# Using pnpm
pnpm build

# Using npm
npm run build

# Using yarn
yarn build
```

### Start Production Server
```bash
# Using pnpm
pnpm start

# Using npm
npm start

# Using yarn
yarn start
```

## 📁 Project Structure

```
aiassistantuisplit/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── mental-wellness/      # Main AI conversation endpoint
│   │   ├── mood-check/          # Mood tracking API
│   │   └── resources/           # Mental health resources API
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   ├── AIAssistantUI.jsx        # Main application component
│   ├── ChatPane.jsx             # Chat interface
│   ├── MoodTracker.jsx          # Mood tracking component
│   ├── CrisisAlert.jsx          # Crisis detection alerts
│   ├── CulturalProfileSetup.jsx # Cultural background setup
│   └── ...                     # Other components
├── hooks/                       # Custom React hooks
│   ├── use-crisis-detection.js  # Crisis monitoring hook
│   ├── use-mood-tracking.js     # Mood tracking hook
│   └── use-resources.js         # Resource management hook
├── lib/                         # Utility libraries
│   ├── mental-wellness.js       # AI prompt templates and chains
│   ├── crisis-escalation.js     # Crisis management system
│   ├── cultural-adaptation.js   # Cultural context engine
│   └── utils.ts                 # General utilities
└── styles/                      # Additional styles
```

## 🔧 Configuration

### Theme Configuration
The application supports automatic theme detection and manual theme switching. Themes are persisted in localStorage.

### Cultural Adaptation
The cultural adaptation engine can be configured for different regions and cultural contexts. The default configuration is optimized for Indian youth.

### Crisis Detection Settings
Crisis detection sensitivity and escalation protocols can be adjusted in the `crisis-escalation.js` file.

## 🧪 API Endpoints

### `/api/mental-wellness`
Main AI conversation endpoint that processes user messages and returns culturally-adapted responses.

**POST Request Body:**
```json
{
  "message": "User's message",
  "context": {
    "sessionId": "unique_session_id",
    "ageContext": "college student",
    "conversationHistory": "Previous conversation context",
    "moodIndicators": "Recent mood data"
  }
}
```

### `/api/mood-check`
Endpoint for processing mood check-ins and wellness factor tracking.

### `/api/resources`
Endpoint for fetching curated mental health resources based on user context.

## 🔒 Privacy & Security

- **Data Privacy**: All conversations are stored locally and not transmitted to external servers
- **Crisis Protocol**: Automated detection and escalation for high-risk situations
- **Confidentiality**: No personal data is shared without explicit user consent
- **Cultural Sensitivity**: Responses are tailored to respect cultural values and family dynamics

## 🆘 Crisis Resources

The application includes built-in crisis resources for immediate help:

- **National Suicide Prevention**: 9152987821
- **AASRA**: 9820466726
- **Vandrevala Foundation**: 9999666555
- **Sneha**: 044-24640050

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Mental Health Professionals**: For guidance on culturally-sensitive mental health support
- **Indian Youth Community**: For feedback and cultural insights
- **Open Source Community**: For the amazing tools and libraries that make this project possible

## ⚠️ Important Disclaimer

This AI assistant is designed to provide support and resources but is not a replacement for professional mental health care. If you or someone you know is in immediate danger, please contact emergency services or a mental health professional immediately.

## 📞 Support

For technical support or questions about the project, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Made with ❤️ for Indian youth mental wellness**