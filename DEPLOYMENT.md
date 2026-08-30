# Finance pod kontrolou – nasazení

## 1. Instalace

```bash
npm install
npm run build
```

## 2. Firebase

V Firebase Console ověř:
- Email/Password Authentication je zapnutá.
- Firestore Database je vytvořená.
- Storage je vytvořený.
- Nasazení pravidel: `firebase deploy --only firestore:rules,storage`.

Pravidla v `firestore.rules` a `storage.rules` omezují data na přihlášeného vlastníka (`request.auth.uid == userId`).

## 3. AI

API klíč poskytovatele AI se **nesmí** vložit do frontendu.

Aplikace očekává bezpečný backend proxy endpoint v:

```env
VITE_AI_ENDPOINT=https://tvuj-backend.example/api/ai
```

Frontend posílá proxy pouze `contents`. Backend má držet skutečný provider API key v server-side secretu a ověřovat uživatele/rate limit.

Pokud `VITE_AI_ENDPOINT` není nastavený, aplikace funguje v základním rule-based režimu.

## 4. PWA

Projekt používá `vite-plugin-pwa`. Service worker se neregistruje ručně v `main.tsx`; registraci řeší PWA plugin.

Výchozí deployment je připravený pro GitHub Pages pod `/ZS/`. Pro vlastní doménu je potřeba změnit `base`, `scope` a `start_url` ve `vite.config.ts`.
