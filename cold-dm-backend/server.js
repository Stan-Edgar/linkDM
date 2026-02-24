const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const SHEET_ID = '10BnWT37lWVjWHegtZYKPC-yANaTitWSLXqoZYihQLtg';
const TAB_NAME = 'Feb';

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './service-account.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

app.post('/add-lead', async (req, res) => {
  const { name, profileLink } = req.body;

  if (!name || !profileLink) {
    return res.status(400).json({ error: 'Name and profile link are required' });
  }

  try {
    const sheets = await getSheets();

    // Find next empty row by reading column B
    const readRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB_NAME}!B13:B`,
    });

    const rows = readRes.data.values || [];
    const nextRow = 13 + rows.length;

    // Format date as MM/DD/YYYY
    const today = new Date();
    const date = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${TAB_NAME}!B${nextRow}:D${nextRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, profileLink, date]],
      },
    });

    res.json({ success: true, row: nextRow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to write to sheet' });
  }
});

app.listen(3001, () => console.log('Backend running on port 3001'));

PORT=3001