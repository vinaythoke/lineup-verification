# Satara Hill Half Marathon - Lineup Verification Tool 🏃‍♂️🏅

A high-performance web application built for race organizers of the **Satara Hill Half Marathon** to manually review, filter, search, and verify runner registration proofs (certificates and result timing links) alongside AI-assisted lineup recommendations.

---

## 🌟 Key Features

- **⚡ Lightning Fast Browser Search & Filter**: Search 3,104 runners instantly by Name, Email, or Registration ID.
- **🏷️ Lineup Discrepancy Highlighting**: Quick filter to highlight all runners whose requested lineup (E, A, B) differs from the AI-recommended lineup (E, A, B, C).
- **✋ Organizer Decision Toggle**:
  - All runners default to **Approved**.
  - Organizers can quickly toggle any runner to **Disapproved** and add an optional reason note.
  - Manual review progress persists automatically in the browser (`localStorage`).
- **🖼️ Certificate Lightbox & PDF Viewer**:
  - 1-Click modal viewer for JPG, PNG, and PDF certificates hosted on **Bunny CDN**.
  - Zoom in/out, rotate 90°, and direct download buttons.
  - **Keyboard Arrow Navigation**: Press `Left` / `Right` arrow keys to browse through certificates continuously.
- **🔗 Automatic Link Sanitization**: Cleans and launches runner result links safely in a new browser tab.
- **📊 CSV Audit Report Export**: Export all records or disapproved runners into a formatted CSV report.
- **🌐 100% Free Hosting on Vercel**: Ready for 1-click deployment via GitHub.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **CDN Storage**: Bunny CDN (`https://runsatara.b-cdn.net/`)
- **Data Pipeline**: Python openpyxl merging script (`scripts/merge_data.py`)

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variable (.env)
Create a `.env` file in the root directory (or edit the existing one):
```env
VITE_BUNNY_CDN_URL=https://runsatara.b-cdn.net
```

### 3. Generate Clean Data (Optional if runners.json is updated)
```bash
npm run generate-data
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 How to Deploy to Vercel (100% Free)

### Step 1: Upload Project to GitHub
1. Create a new repository on your GitHub account (e.g. `satara-lineup-verification`).
2. Run the following commands in your terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Satara Hill Half Marathon Lineup Verification tool"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/satara-lineup-verification.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel
1. Log in to [Vercel](https://vercel.com/) (Sign up for free with your GitHub account).
2. Click **"Add New..."** -> **"Project"**.
3. Select your `satara-lineup-verification` GitHub repository.
4. In **Environment Variables**, add:
   - **Key**: `VITE_BUNNY_CDN_URL`
   - **Value**: `https://runsatara.b-cdn.net`
5. Click **"Deploy"**.

Your application will be live in ~30 seconds with a free URL (e.g., `https://satara-lineup-verification.vercel.app`).

---

## 📁 Project Structure

```
├── .env                       # Bunny CDN Environment Configuration
├── package.json               # Dependencies & build scripts
├── vite.config.js             # Vite configuration
├── scripts/
│   └── merge_data.py          # Python script to merge Excel files into runners.json
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Main layout, filters, & state management
│   ├── index.css              # Global Tailwind CSS v4 styling
│   ├── data/
│   │   └── runners.json       # Merged 3,104 runner dataset
│   └── components/
│       ├── Header.jsx         # Branding & export header
│       ├── StatsCards.jsx     # Summary overview cards
│       ├── FilterBar.jsx      # Search & multi-dropdown toolbar
│       ├── RunnerTable.jsx    # Paginated, sortable runner table
│       ├── CertificateModal.jsx# Lightbox & PDF viewer with arrow navigation
│       └── ExportModal.jsx    # CSV audit report exporter
```
