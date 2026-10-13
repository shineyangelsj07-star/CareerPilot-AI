# CareerPilot AI – Smart Placement & Internship Assistant

> **AI-Powered Mobile Placement Assistant engineered for Engineering Students (CSE / AIML)**  
> Built with React 19, TypeScript, Express, Tailwind CSS, and Google Gemini 3.8 Flash (`gemini-3.8-flash`). Designed with an Android flagship interface ready for Capacitor APK packaging.

---

## 🌟 Overview & Key Features

1. **Welcome & Onboarding Wizard:**
   - Captures student profile: Name, College, Department/Branch (CSE-AIML, CSE Core, IT, ECE), Year of Study, Target Role, Daily Study Hours commitment, and baseline Technical Skills.

2. **Home Placement Dashboard:**
   - Real-time **Placement Readiness Index (%)** dynamically computed from completed roadmap milestones, solved problem counts, and practice consistency.
   - **Daily Study Streak Tracker** with flame counter.
   - **Today's Focus Tasks** generated from the active 6-week curriculum with 1-click completion.
   - **Coding Statistics Summary** (Easy, Medium, Hard breakdown).

3. **AI Learning Roadmap (6-Week Curriculum):**
   - Personalized week-by-week study schedule tailored to student proficiency and role.
   - Covers Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, SQL, and AIML Fundamentals.
   - Interactive topic completion checkboxes, category filters, and 1-click Gemini AI roadmap regeneration.

4. **AI Resume ATS Analyzer:**
   - Multi-factor diagnostic scoring (0–100) benchmarked against Tier-1 campus hiring filters.
   - Section breakdown: Technical Skills, Project Impact, Contact & Summary, ATS Formatting.
   - Detected technical keywords vs. missing high-yield keywords.
   - Google XYZ Formula rewrites: *Accomplished [X], as measured by [Y], by doing [Z]*.
   - AI-optimized professional summary with 1-click copy.

5. **Transparent Job Description (JD) Skill Matcher:**
   - Compares candidate's skills and resume against any arbitrary job or internship description.
   - **Non-fabricated transparent scoring rubric**:
     - Core Tech Stack Coverage (40%)
     - CS Fundamentals & Problem Solving (30%)
     - Practical Implementation & Projects (20%)
     - Qualifications & Tools (10%)
   - Displays matched skills (green chips), missing required skills (amber/red chips), targeted 7-day bridge learning steps, and predicted interview questions.

6. **AI Interview Coach & Live Mock Interview Simulation:**
   - **Subject Q&A Mode:** Practice questions across C, Python, Java, DSA, DBMS, SQL, OS, Computer Networks, and AIML at Beginner, Intermediate, and Advanced tiers.
   - **Live Simulated 3-Round Mock Interview:** One question at a time across Algorithm logic, Database design, and OS concurrency.
   - Constructive AI feedback on correctness, clarity, missed edge-cases, upfront Big-O complexity expectations, and model answers.

7. **Coding Practice Tracker & Scratchpad:**
   - Record problem name, platform (LeetCode, GeeksforGeeks, CodeStudio), difficulty, topic, language, and Big-O Time/Space complexity.
   - Integrated Algorithm Scratchpad with syntax presets for C++, Java, Python, and SQL.
   - Integrated timed practice stopwatch for simulated coding assessments.

8. **STAR Project Portfolio Builder:**
   - Converts raw college project summaries into powerful resume bullet points using the **STAR method** (Situation, Task, Action, Result).
   - Generates viva voce and technical defense talking points (e.g. why tech stack chosen, concurrency bottlenecks, scaling to 100k users).

9. **College Project & Viva Hub:**
   - Built-in comprehensive IEEE-standard College Project Report (Abstract, Problem Statement, Objectives, Existing vs. Proposed Systems, Architecture, Results, Limitations, Future Scope).
   - 25+ curated Viva Voce technical questions and model answers for semester examinations.
   - Step-by-step Capacitor Android APK compilation commands.
   - Complete GitHub repository publishing instructions.

---

## 🛠️ Technology Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React icons.
- **Backend Server:** Node.js Express server (`server.ts`) hosting RESTful endpoints.
- **AI Engine:** Google Gemini 3.8 Flash (`@google/genai` TypeScript SDK) running securely server-side.
- **Persistence:** Local Storage persistence layer with structured TypeScript models and reset capabilities.
- **Mobile Packaging:** Android Flagship device frame with Capacitor compatibility (`com.careerpilot.app`).

### Architecture Diagram
```
+-------------------------------------------------------+
|          Android Client (React + Tailwind CSS)        |
|  - Home Dashboard      - AI Learning Roadmap          |
|  - Coding Tracker      - AI Interview Coach & Mock    |
|  - Resume ATS Scanner  - JD Skill Gap Matcher         |
+-------------------------------------------------------+
                          │
            HTTP JSON API │ (/api/*)
                          ▼
+-------------------------------------------------------+
|               Express Server (server.ts)              |
|  - API validation      - Prompt engineering           |
|  - Curated engine      - Telemetry headers            |
+-------------------------------------------------------+
                          │
               Secure SDK │ (@google/genai)
                          ▼
+-------------------------------------------------------+
|           Google Gemini 3.8 Flash Engine              |
|        (gemini-3.8-flash, JSON Schema Mode)           |
+-------------------------------------------------------+
```

---

## 🚀 How to Run Locally

### 1. Prerequisites
- Node.js 18+ or 20+
- (Optional) `GEMINI_API_KEY` in `.env` (automatically provided in Google AI Studio)

### 2. Install & Start
```bash
# Install dependencies
npm install

# Start the full-stack development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 How to Build Android APK (Capacitor)

Follow these simple steps to generate an installable Android `.apk`:

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor project
npx cap init "CareerPilot AI" "com.careerpilot.app" --web-dir dist

# 3. Build production web bundle
npm run build

# 4. Add Android native platform
npx cap add android

# 5. Sync web assets & open Android Studio
npx cap copy android
npx cap open android
```

In Android Studio:
1. Wait for Gradle sync to complete.
2. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Your compiled `.apk` will be in `android/app/build/outputs/apk/debug/app-debug.apk`. Transfer and install on any Android phone!

---

## 📚 Viva Voce Cheat Sheet (Key Questions)

1. **Why is the Gemini API called server-side?**  
   Calling AI models server-side protects the `GEMINI_API_KEY` from being exposed in client-side bundles or network tabs, prevents unauthorized usage, and provides a resilient fallback if API quotas are reached.

2. **How does Gemini 3.8 Flash guarantee valid JSON?**  
   We specify `responseMimeType: "application/json"` in the `generationConfig` along with strict TypeScript schema definitions in the system instructions.

3. **How does the JD Matcher prevent hallucinated scores?**  
   It utilizes a deterministic 4-part weighted rubric: Core Tech Stack Coverage (40%), CS Fundamentals (30%), Projects (20%), and Qualifications (10%), presenting exact matching and missing skill tokens to the user.

---

## 📄 License
Academic and educational license for college assignments and portfolio showcases.
