# Video Komunikacija - Setup Guide

Ova aplikacija podržava **3 tipa video komunikacije**:

1. **Native WebRTC pozivi** - Direktni peer-to-peer pozivi unutar aplikacije
2. **Zoom** - Integrirani Zoom video pozivi za zakazane sesije
3. **Google Meet** - Integrirani Google Meet pozivi
4. **Microsoft Teams** - Integrirani Teams pozivi

---

## 1. Native WebRTC Pozivi (Peer-to-Peer)

### Kako funkcionira:
- **WebRTC** omogućava direktnu video/audio komunikaciju između korisnika
- **Socket.io** se koristi za signaling (razmjena SDP offer/answer i ICE candidates)
- Pozivi su **besplatni** i ne zahtijevaju eksterne servise
- Podržava **audio i video pozive**

### Arhitektura:
```
[Caller Browser] ←→ [Socket.io Server] ←→ [Receiver Browser]
       ↓                                          ↓
   WebRTC Peer Connection ←→←→←→←→←→→←→ WebRTC Peer Connection
```

### Komponente:
- **`useWebRTC` hook** (`/hooks/useWebRTC.ts`) - WebRTC logika
- **`VideoCall` komponenta** (`/components/VideoCall.tsx`) - UI za aktivni poziv
- **`IncomingCall` komponenta** (`/components/IncomingCall.tsx`) - UI za dolazne pozive
- **Socket.io signaling** (`/lib/socket.ts`) - Razmjena WebRTC podataka

### Kako koristiti:
1. Otvorite Messages stranicu (`/messages`)
2. Odaberite konverzaciju
3. Kliknite na ikonu **Phone** (audio) ili **Video** (video poziv)
4. Druga strana dobiva notifikaciju i može prihvatiti/odbiti poziv

### STUN/TURN serveri:
Trenutno koristi Google-ove javne STUN servere:
```typescript
{
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
}
```

**Za produkciju**, preporučuje se dodati TURN server (za NAT traversal):
- [Twilio TURN](https://www.twilio.com/stun-turn)
- [Xirsys](https://xirsys.com/)
- Self-hosted TURN (coturn)

---

## 2. Zoom Integracija

### Preduvjeti:
1. **Zoom Account** (Pro ili Business)
2. **Zoom App** kreirana na [Zoom Marketplace](https://marketplace.zoom.us/)
3. **Server-to-Server OAuth** credentials

### Setup koraci:

#### 1. Kreirajte Zoom App:
1. Idite na [Zoom App Marketplace](https://marketplace.zoom.us/develop/create)
2. Odaberite **Server-to-Server OAuth**
3. Unesite app informacije

#### 2. Generirajte credentials:
1. U App Credentials sekciji kopirajte:
   - **Account ID**
   - **Client ID**
   - **Client Secret**

#### 3. Dodijelite scope-ove:
- `meeting:write:admin` - Kreiranje meetinga
- `meeting:read:admin` - Čitanje meetinga

#### 4. Aktivirajte app i dodajte credentials u `.env`:
```env
ZOOM_ACCOUNT_ID="your-account-id"
ZOOM_CLIENT_ID="your-client-id"
ZOOM_CLIENT_SECRET="your-client-secret"
```

### Kako se koristi:
- Automatski se kreira Zoom meeting pri kreiranju Bookinga
- Meeting URL se sprema u `Booking.meetingUrl`
- Korisnici klikaju "Pristupite sesiji" za pristup

---

## 3. Google Meet Integracija

### Preduvjeti:
1. **Google Cloud Project**
2. **Service Account** sa Calendar API pristupom
3. **Google Workspace** (za kreiranje Google Meet linkova)

### Setup koraci:

#### 1. Kreirajte Google Cloud Project:
1. Idite na [Google Cloud Console](https://console.cloud.google.com/)
2. Kreirajte novi projekt
3. Aktivirajte **Google Calendar API**

#### 2. Kreirajte Service Account:
1. Navigation menu → IAM & Admin → Service Accounts
2. Kliknite **Create Service Account**
3. Unesite ime (npr. "instrukcije-calendar")
4. Dodijelite **Editor** ulogu

#### 3. Generirajte Private Key:
1. Kliknite na Service Account
2. Keys → Add Key → Create New Key
3. Odaberite **JSON** format
4. Preuzmite fajl

#### 4. Omogućite Domain-Wide Delegation (Workspace Admin):
1. U Service Account postavkama, omogućite **Domain-Wide Delegation**
2. U Google Workspace Admin Console → Security → API Controls → Domain-wide Delegation
3. Dodajte Service Account Client ID sa scope-om:
   ```
   https://www.googleapis.com/auth/calendar
   ```

#### 5. Dodajte credentials u `.env`:
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL="instrukcije-calendar@your-project.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----"
```

**VAŽNO**: Private key mora biti u formatu sa `\n` za nove linije.

### Instalacija dependencies:
```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

---

## 4. Microsoft Teams Integracija

### Preduvjeti:
1. **Microsoft 365** Business ili Enterprise
2. **Azure AD** pristup
3. **App Registration** u Azure

### Setup koraci:

#### 1. Registrirajte aplikaciju u Azure AD:
1. Idite na [Azure Portal](https://portal.azure.com/)
2. Azure Active Directory → App registrations → New registration
3. Unesite naziv (npr. "Instrukcije Platform")
4. Supported account types: **Single tenant**
5. Kliknite **Register**

#### 2. Generirajte Client Secret:
1. U aplikaciji → Certificates & secrets
2. New client secret
3. Kopirajte **Value** (secret) - prikazuje se samo jednom!

#### 3. Dodijelite API Permissions:
1. API permissions → Add a permission
2. Microsoft Graph → Application permissions
3. Dodajte:
   - `OnlineMeetings.ReadWrite.All`
   - `Calendars.ReadWrite`
4. Kliknite **Grant admin consent**

#### 4. Zabilježite IDs:
- **Application (client) ID**
- **Directory (tenant) ID**

#### 5. Dodajte credentials u `.env`:
```env
MICROSOFT_TENANT_ID="your-tenant-id"
MICROSOFT_CLIENT_ID="your-client-id"
MICROSOFT_CLIENT_SECRET="your-client-secret"
```

---

## Database Migration

Nakon što ste dodali video funkcionalnost, pokrenite Prisma migraciju:

```bash
npx prisma migrate dev --name add_video_calls
```

Ova migracija kreira:
- **`video_calls`** tabelu - za WebRTC pozive
- **`CallType`** enum - VIDEO, AUDIO
- **`CallStatus`** enum - INITIATED, RINGING, ANSWERED, ENDED, MISSED, REJECTED, FAILED

---

## Testiranje

### 1. Native WebRTC:
1. Otvorite aplikaciju u 2 browser prozora (ili incognito)
2. Logirajte se kao različiti korisnici
3. Pošaljite poruku jednom korisniku
4. Kliknite Phone ili Video ikonu
5. U drugom prozoru prihvatite poziv

### 2. Zoom/Meet/Teams:
1. Kreirajte Booking
2. Odaberite video provider (Zoom/Google Meet/Teams)
3. Provjerite da li se generirao `meetingUrl`
4. Kliknite "Pristupite sesiji" na `/session/[id]`

---

## Troubleshooting

### WebRTC pozivi ne funkcioniraju:
- **Provjerite Socket.io connection**: Otvorite browser console i potražite "Socket connected"
- **Provjerite permissions**: Browser mora imati pristup kameri/mikrofonu
- **HTTPS je obavezan**: WebRTC ne radi na HTTP (osim localhost)
- **Firewall**: Provjerite da STUN/TURN portovi nisu blokirani

### Zoom meetinzi ne kreiraju:
- Provjerite credentials u `.env`
- Provjerite da je App aktivirana na Zoom Marketplace
- Provjerite scope-ove (meeting:write:admin)

### Google Meet ne kreira linkove:
- Provjerite da imate Google Workspace (Meet API ne radi sa besplatnim Gmail računima)
- Provjerite Domain-Wide Delegation
- Provjerite format private key-a (mora imati `\n`)

### Teams meetinzi ne kreiraju:
- Provjerite admin consent za API permissions
- Provjerite Tenant ID format
- Provjerite da korisnik ima Teams licencu

---

## Security Considerations

1. **Environment Variables**: Nikad ne commit-ajte `.env` fajl
2. **HTTPS**: Koristite HTTPS u produkciji za WebRTC
3. **Rate Limiting**: Implementirajte rate limiting za video pozive
4. **Permissions**: Provjerite da korisnici imaju pristup samo svojim pozivima
5. **Credentials Rotation**: Redovno rotirajte API credentials

---

## Dodatne Opcije

### Custom TURN Server:
Za bolju kvalitetu WebRTC poziva, instalirajte coturn:

```bash
sudo apt install coturn
```

Konfigurirajte i dodajte u `useWebRTC.ts`:
```typescript
iceServers: [
  { urls: 'stun:your-server.com:3478' },
  {
    urls: 'turn:your-server.com:3478',
    username: 'username',
    credential: 'password'
  }
]
```

### Recording:
Za snimanje poziva, možete koristiti:
- **MediaRecorder API** (client-side)
- **Zoom Cloud Recording** (automatski)
- **Twilio Recording** (za WebRTC)

---

## Support

Za pomoć:
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)
- [Zoom API Docs](https://marketplace.zoom.us/docs/api-reference/zoom-api)
- [Google Calendar API](https://developers.google.com/calendar)
- [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/api/resources/onlinemeeting)
