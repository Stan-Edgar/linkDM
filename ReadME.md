# LinkDM

A minimal cold outreach automation tool. Paste a Twitter/X profile URL, auto-log the lead to your Google Sheets CRM, and copy your DM template to clipboard — ready to paste.

## What it does

1. Paste a Twitter/X profile URL
2. Name auto-fills from the username (editable)
3. Hits your Google Sheets CRM — logs Name, Profile Link, Date to the correct month tab automatically
4. Copies your DM template to clipboard with the name swapped in
5. Paste and send

## Stack

- **Frontend** — React + Vite + Tailwind CSS v4
- **Backend** — Node.js + Express
- **Integration** — Google Sheets API v4 via service account

## Project Structure

```
linkDM/
├── cold-dm-tool/        # React frontend (Vite)
│   ├── src/
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
├── cold-dm-backend/     # Express backend
│   ├── server.js
│   ├── service-account.json   # ← never commit this
│   └── package.json
├── .gitignore
└── README.md
```

## Setup

### 1. Google Sheets API

- Go to [console.cloud.google.com](https://console.cloud.google.com)
- Create a project → Enable **Google Sheets API**
- Go to **IAM & Admin → Service Accounts** → Create one → Download JSON key
- Share your CRM Google Sheet with the service account email (Editor access)
- Place the JSON file at `cold-dm-backend/service-account.json`

### 2. Configure the backend

Open `cold-dm-backend/server.js` and set your Sheet ID:

```js
const SHEET_ID = 'your_sheet_id_here';
```

The Sheet ID is the long string in your Google Sheet URL:
`https://docs.google.com/spreadsheets/d/THIS_PART/edit`

The tab name is auto-detected from the current month (Jan, Feb, Mar...) — make sure your sheet tabs match this format.

### 3. Install dependencies

```bash
# Backend
cd cold-dm-backend && npm install

# Frontend
cd cold-dm-tool && npm install
```

### 4. Run

```bash
cd cold-dm-tool && npm run dev:full
```

Opens on `http://localhost:5173`

## CRM Sheet Structure

The tool appends to the current month's tab starting from row 13:

| B | C | D |
|---|---|---|
| Name | Profile Link | Date Initiated |

## Customising the DM template

Edit this line in `cold-dm-tool/src/App.jsx`:

```js
const DM_TEMPLATE = "Hey [First Name], quick Q. Are you still focused on scaling this year?";
```

Use `[First Name]` as the placeholder — it gets replaced automatically.

## .gitignore

Make sure these are ignored:

```
cold-dm-backend/service-account.json
cold-dm-backend/.env
node_modules
```