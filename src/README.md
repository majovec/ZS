# Finance pod kontrolou - PWA

**Progressive Web App** verze aplikace "Finance pod kontrolou" pro projekt @znovusilnejsi.

Offline-first finanční aplikace s AI poradcem, který běží přímo v tvém prohlížeči.

---

## 🚀 Instalace a spuštění

### 1. Instalace závislostí

```bash
npm install
```

### 2. Konfigurrace Firebase

Vytvořit soubor `src/services/firebase.config.ts` a vyplnit Firebase konfiguraci:

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "1:YOUR_APP_ID:web:YOUR_WEB_ID",
}
```

### 3. Vývoj

```bash
npm run dev
```

Aplikace poběží na `http://localhost:5173`

### 4. Build pro produkci

```bash
npm run build
```

Výsledek je v `dist/` složce.

### 5. Deployment na GitHub Pages

```bash
npm run deploy
```

---

## 📱 Funkce

### ✅ Implementováno

- **Firebase Auth** - Přihlášení/Registrace
- **Firestore Database** - Ukládání dat
- **Offline Mode** - Service Worker + IndexedDB
- **Dashboard** - Přehled měsíčních příjmů/výdajů
- **Transakce** - Přidání zápisu, OCR účtenek (ML Kit)
- **Kategorie** - Výchozí kategorie + vlastní
- **Rozpočet** - Měsíční rozpočet na kategorie
- **Cíle** - Finanční cíle (splácení dluhu, rezerva)
- **Investice** - Spoření a investice
- **Grafy** - Recharts (bar chart, pie chart)
- **AI Rádce** - Chatbot s rule-based odpověďmi
- **Easter Eggs** - Logo tap, long-press na Účet
- **PWA** - Instalovatelné na home screen, offline, push notifikace

### ⏳ TODO (Nice to have)

- Lokální Gemma model (TensorFlow.js)
- Web Push Notifikace (Firebase Messaging)
- Synchronizace dat offline ↔ online
- Google Cloud Vision API (OCR)
- Dark/Light mode toggle
- Multi-currency support

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **State Management:** Zustand
- **Styling:** Inline CSS + theme system
- **Database:** Firestore (Offline-first)
- **Auth:** Firebase Auth
- **Charts:** Recharts
- **AI/ML:** TensorFlow.js (pro Gemma model)
- **Build:** Vite
- **PWA:** vite-plugin-pwa

---

## 📂 Struktura projektu

```
src/
├── components/        # UI komponenty (Button, Card, Input)
├── pages/            # Stránky aplikace (Dashboard, Chat, Goals, atd.)
├── services/         # Firebase, Firestore, AI, OCR
├── store/            # Zustand store (state management)
├── models/           # TypeScript typy a interfaces
├── theme/            # Barvy, spacing, typography
├── utils/            # Utility funkce
├── App.tsx           # Hlavní komponenta
└── main.tsx          # Entry point
```

---

## 🔑 Firebase Setup

1. Vytvoř projekt na https://firebase.google.com
2. Vytvořit Firestore Database (production mode)
3. Vytvořit Authentication (Email/Password provider)
4. Vytvořit Cloud Messaging (pro notifikace)
5. Stáhni Firebase config a vložit do `src/services/firebase.ts`

### Firestore Collection struktura

```
users/
  {userId}/
    categories/
    transactions/
    goals/
    investments/
    monthlyBudgets/
```

---

## 🎨 Design

- **Barva:** Černo-zlatá (#0A0A0A + #D4AF37)
- **Responsive:** Mobile-first design
- **Accessibility:** WCAG 2.1 compliance

---

## 📱 PWA Installation

### Desktop (Chrome)
- Adresář bar → ikona instalace → "Install Finance pod kontrolou"

### Mobilní (Android)
- Dotykem (Share) → "Add to Home Screen"

### iOS
- Safari → Share → Add to Home Screen

---

## 🔐 Bezpečnost

- ✅ Firebase Authentication
- ✅ Firestore Security Rules (uživatel vidí jen svá data)
- ✅ Offline-first (data nejsou vysílána pokud nejsi přihlášen)
- ✅ HTTPS only (PWA requirement)

---

## 🐛 Troubleshooting

### Service Worker se neregistruje
```bash
# Vymaž service worker cache
Ctrl+Shift+Del → Service Workers
```

### Firebase connection error
- Ověř Firebase config
- Ověř Firestore Security Rules
- Ověř internet connection

### Build error
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📧 Kontakt

Projekt: @znovusilnejsi
Web: znovusilnejsi.cz

---

**Vytvořeno s ❤️ pro ty, kteří si chcou vzít své finance pod kontrolu.**

Znovu Silnější! 💪
