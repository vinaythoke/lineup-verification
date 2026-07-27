# Satara Hill Half Marathon - Lineup Verification Tool 🏃‍♂️🏅

A high-performance, real-time web application built for race organizers of the **Satara Hill Half Marathon** to review, verify, and allot lineup sections (E, A, B, C) for runner registration proofs (certificates & result links) alongside AI verification recommendations.

---

## ☁️ Live Cloud Synchronization Service: JSONBlob

This application utilizes **[JSONBlob](https://jsonblob.com/)** for **100% free, real-time, multi-organizer persistence**:

- **Service Provider**: [JSONBlob.com](https://jsonblob.com/) (Open-source RESTful JSON storage service).
- **How It Works**:
  1. When any organizer disproves a runner or reassigns a final lineup section (requiring security PIN authorization), the change is automatically saved to a shared, permanent cloud JSON endpoint.
  2. All open browsers (incognito tabs, mobile phones, laptops, and teammate devices) automatically sync and update their UI, table rows, and stats counters live in real time via periodic background polling.
  3. Decisions persist permanently in the cloud even when computers are powered off or opened days later.

---

## 🌟 Key Features

- **⚡ Instant Search & Multi-Filter**: Filter 3,104 runners by Name, Registration ID, Mismatches, Claimed Lineup, AI Result, Evidence Type, or Organizer Decision.
- **📱 Fully Responsive Mobile Design**: Automatically transforms into an app-like card layout on mobile devices (`< 768px`) with touch targets, while retaining the full interactive data grid on desktops (`≥ 768px`).
- **☁️ Multi-Organizer Real-Time Sync**: Shared persistence powered by **JSONBlob** across all devices.
- **🔐 PIN-Authorized Disapproval & Reassignment**:
  - All runners default to **Approved**.
  - Disapproving a runner requires entering an **Organizer Security PIN** (configured via `.env`) and allows assigning a final lineup section (`E`, `A`, `B`, or `C`) along with an optional reason note.
- **🖼️ Certificate Lightbox & PDF Viewer**:
  - View JPG, PNG, and PDF certificates hosted on **Bunny CDN**.
  - Zoom in/out, rotate 90°, and continuous keyboard arrow (`Left` / `Right`) navigation.
- **📊 Instant CSV Audit Report Export**:
  - Export full runner audit reports or filtered disapproved lists with UTF-8 BOM (`\uFEFF`) and Base64 Data URL streaming for instant cross-browser downloads.

---

## ⚙️ Environment Variables (.env)

Create or edit the `.env` file in the root directory:

```env
# Bunny CDN URL for runner certificates
VITE_BUNNY_CDN_URL=https://runsatara.b-cdn.net

# Security PIN required for organizers to disprove or reassign lineups
VITE_ORGANIZER_PIN=1234

# Show or hide runner email IDs (true/false)
VITE_SHOW_RUNNER_EMAIL=false

# Optional custom Cloud Sync Endpoint (defaults to JSONBlob storage)
VITE_CLOUD_SYNC_URL=https://jsonblob.com/api/jsonBlob/019fa402-5775-70b2-ae21-be5b4c7c8c26
```

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Real-Time Cloud Persistence**: JSONBlob REST API (`jsonblob.com`)
- **Certificate CDN**: Bunny CDN (`https://runsatara.b-cdn.net/`)
- **Data Pipeline**: Python `openpyxl` merge script (`scripts/merge_data.py`)

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variable (`.env`)
Ensure `.env` contains your CDN URL and Security PIN.

### 3. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Deploy to Vercel (100% Free)

This project is configured for Vercel deployment with SPA routing (`vercel.json`).

1. Push your repository to GitHub (`vinaythoke/lineup-verification`).
2. Import the project on [Vercel](https://vercel.com).
3. Add Environment Variables (`VITE_BUNNY_CDN_URL`, `VITE_ORGANIZER_PIN`, etc.).
4. Click **Deploy**.

---

## 📁 Project Structure

```
├── .env                       # Environment configuration (CDN, PIN, Cloud URL)
├── package.json               # Project dependencies & scripts
├── vercel.json                # Vercel deployment & routing configuration
├── scripts/
│   └── merge_data.py          # Python script to process & merge Excel records into runners.json
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Main application & sync controller
│   ├── index.css              # Global Tailwind CSS v4 design system
│   ├── data/
│   │   └── runners.json       # Merged 3,104 runner dataset
│   ├── services/
│   │   └── cloudSync.js       # Real-time JSONBlob cloud persistence service
│   └── components/
│       ├── Header.jsx         # Header with live cloud status badge
│       ├── StatsCards.jsx     # Overview summary cards
│       ├── FilterBar.jsx      # Search & filter toolbar
│       ├── RunnerTable.jsx    # Responsive card view (<768px) & desktop table (≥768px)
│       ├── CertificateModal.jsx# Lightbox & PDF certificate viewer
│       ├── DisapproveModal.jsx # Security PIN & lineup reassignment modal
│       └── ExportModal.jsx    # Base64 CSV audit report exporter
```
