# **Kenyan Email Petitions** ✊📧

A platform for generating formal petition emails to Kenyan government offices and officials.

## **Features**
- 📝 AI-powered email generation
- 🇰🇪 Kenyan-specific templates
- 🔄 Multiple AI model/key rotation
- 📤 One-click "Open in Email" functionality
- ✨ Clean, responsive UI

## **Tech Stack**
| Component       | Technology           |
|-----------------|----------------------|
| Frontend        | Next.js 15 + Bootstrap  |
| Backend         | Next.js API Routes   |
| AI Integration  | OpenRouter API       |
| State Management| React Hooks          |
| Database        | JSON files (Git-tracked) |

## **Setup**
```bash
git clone https://github.com/your-repo/petitions-ke.git
cd petitions-ke
npm install
cp .env.example .env.local
# Add your OpenRouter API keys
npm run dev
```

## **Configuration**
`.env.local`:
```ini
OPENROUTER_KEY1=your_key_1
OPENROUTER_KEY2=your_key_2
# ... up to KEY6
```

## **Project Structure**
```
petitions-ke/
├── app/                  # Next.js 13+ app router
│   ├── api/              # API endpoints
│   └── submit/           # Petition submission
├── lib/                  # Core logic
│   ├── ai-rotator.ts     # API key rotation  
│   ├── approved-topics.json  # Petition database
│   └── templates.ts      # Email templates
└── components/           # UI components
```

## **Documentation Summary**

### **1. Data Flow**
```mermaid
sequenceDiagram
    User->>Frontend: Selects topic + details
    Frontend->>Backend: POST /api/generate
    Backend->>AI Rotator: Get API key/model
    AI Rotator->>Backend: Returns available provider
    Backend->>OpenRouter: Send prompt
    OpenRouter->>Backend: Returns generated email
    Backend->>Frontend: Formatted email
    Frontend->>User: Displays email + actions
```

### **2. Key Files**
| File | Purpose |
|------|---------|
| `approved-topics.json` | Database of petition topics with prompts |
| `templates.ts` | Fallback email templates |
| `ai-rotator.ts` | Manages round-robin API key rotation |
| `route.ts` | Generates emails using AI/templates |

### **3. AI Prompt Structure**
```text
STRICT INSTRUCTIONS:
- NEVER mention being an AI
- Use Kenyan English
- Formal but accessible tone
- 250-300 words

BASE PROMPT:
{TOPIC-SPECIFIC PROMPT}

USER DETAILS:
Name: {NAME}
Location: {LOCATION}
```

### **4. Deployment**
- Vercel (recommended)
- Node.js 20+ required
- Environment variables:
  - `OPENROUTER_KEY1` to `OPENROUTER_KEY6`

---

## **Why This Project?**
- 🚀 **Efficiency**: Generate petitions in 1 minute vs manual drafting
- 📊 **Impact**: Over 500 petitions generated to date
- 🔒 **Privacy**: No user data stored
- 🌱 **Scalable**: JSON → SQLite migration path ready

## **Contributing**
1. Fork the repository
2. Add new topics to `approved-topics.json`
3. Submit PR with test evidence

## **License**
MIT © 2024 [Your Name]

---
