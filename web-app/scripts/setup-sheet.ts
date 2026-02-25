import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx);
  let value = trimmed.slice(eqIdx + 1);
  // Remove surrounding quotes
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  process.env[key] = value;
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

async function main() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // 1. Get existing sheets to find the default sheet ID
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existingSheets = spreadsheet.data.sheets || [];
  const firstSheetId = existingSheets[0]?.properties?.sheetId ?? 0;

  console.log('✅ Connected to Google Sheets');

  // 2. Rename first sheet to "Inventário" and create "Reservas" + "Cowork"
  const existingNames = existingSheets.map(s => s.properties?.title);

  const requests: any[] = [];

  // Rename first sheet
  if (existingNames[0] !== 'Inventário') {
    requests.push({
      updateSheetProperties: {
        properties: { sheetId: firstSheetId, title: 'Inventário' },
        fields: 'title',
      },
    });
  }

  // Create "Reservas" if not exists
  if (!existingNames.includes('Reservas')) {
    requests.push({
      addSheet: { properties: { title: 'Reservas' } },
    });
  }

  // Create "Cowork" if not exists
  if (!existingNames.includes('Cowork')) {
    requests.push({
      addSheet: { properties: { title: 'Cowork' } },
    });
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests },
    });
    console.log('✅ Sheets created/renamed');
  }

  // 3. Populate "Inventário" with all rental items
  const inventarioData = [
    ['ID', 'Nome', 'Categoria', 'Preço', 'Ativo'],
    // Cameras
    ['sony-a7iv', 'Sony A7 IV', 'camera', '60€/dia', 'TRUE'],
    ['sony-a6700', 'Sony A6700', 'camera', '50€/dia', 'TRUE'],
    ['dji-pocket3', 'DJI Osmo Pocket 3 Creator Combo', 'camera', '30€/dia', 'TRUE'],
    ['dji-action5', 'DJI Osmo Action 5', 'camera', '15€/dia', 'TRUE'],
    // Objetivas
    ['sony-20mm', 'Sony 20mm G f1.8', 'objetiva', '25€/dia', 'TRUE'],
    ['sirui-85mm', 'Sirui 85mm f1.4', 'objetiva', '45€/dia', 'TRUE'],
    ['samyang-35-150', 'Samyang 35-150mm f2-2.8', 'objetiva', '60€/dia', 'TRUE'],
    ['sigma-17-40', 'Sigma 17-40mm f1.8', 'objetiva', '55€/dia', 'TRUE'],
    // Drone
    ['dji-mini4', 'DJI Mini 4 Pro', 'drone', '60€/dia', 'TRUE'],
    // Iluminação
    ['flash-v480', 'Flash V480 Godox', 'iluminacao', '10€/dia', 'TRUE'],
    ['led-rgb', 'LED RGB MS60C', 'iluminacao', '15€/dia', 'TRUE'],
    ['smallrig', 'Smallrig RF10C', 'iluminacao', '10€/dia', 'TRUE'],
    ['smallrig-p96', 'Smallrig LED P96', 'iluminacao', '5€/dia', 'TRUE'],
    // Áudio
    ['dji-mic-2tx', 'DJI Mic Mini (2TX + 1RX + Case)', 'audio', '20€/dia', 'TRUE'],
    ['dji-mic-1tx', 'DJI Mic Mini (1TX + 1RX)', 'audio', '15€/dia', 'TRUE'],
    ['boya-shotgun', 'Boya Shotgun Mic', 'audio', '10€/dia', 'TRUE'],
    // Acessórios
    ['dji-rs4', 'DJI RS4 Pro Combo', 'acessorios', '50€/dia', 'TRUE'],
    ['camera-cooler', 'Camera Cooler Ulanzi', 'acessorios', '10€/dia', 'TRUE'],
    ['knf-tripod', 'K&F Tripé Básico', 'acessorios', '10€/dia', 'TRUE'],
    ['knf-cstand', 'K&F Tripé C-Stand 3m', 'acessorios', '15€/dia', 'TRUE'],
    // Estúdios
    ['estudio-1', 'Estúdio 1', 'studio', '40-50€/h', 'TRUE'],
    ['estudio-2', 'Estúdio 2', 'studio', '30-40€/h', 'TRUE'],
    ['estudio-podcast', 'Estúdio Podcast', 'studio', '30-200€', 'TRUE'],
    // Cowork + Estúdio
    ['coworkstudio-starter', 'Cowork+Estúdio Starter', 'cowork-studio', '25-200€', 'TRUE'],
    ['coworkstudio-prime', 'Cowork+Estúdio Prime', 'cowork-studio', '30-240€', 'TRUE'],
    ['coworkstudio-premium', 'Cowork+Estúdio Premium', 'cowork-studio', '130-280€', 'TRUE'],
    // Cowork
    ['cowork-starter', 'Cowork Starter', 'cowork', '12-120€', 'TRUE'],
    ['cowork-prime', 'Cowork Prime', 'cowork', '15-150€', 'TRUE'],
    ['cowork-premium', 'Cowork Premium', 'cowork', '75-180€', 'TRUE'],
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Inventário!A1',
    valueInputOption: 'RAW',
    requestBody: { values: inventarioData },
  });
  console.log(`✅ Inventário: ${inventarioData.length - 1} items`);

  // 4. Add headers to "Reservas"
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Reservas!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        ['ID Item', 'Nome Item', 'Data Início', 'Data Fim', 'Cliente', 'Contacto', 'Notas'],
        // Example row for testing
        ['sony-a7iv', 'Sony A7 IV', '2026-03-01', '2026-03-05', 'Teste', '912345678', 'Reserva de teste'],
      ],
    },
  });
  console.log('✅ Reservas: headers + 1 teste');

  // 5. Add headers to "Cowork"
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Cowork!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        ['ID Plano', 'Tipo', 'Data Início', 'Data Fim', 'Cliente', 'Contacto', 'Lugares', 'Notas'],
      ],
    },
  });
  console.log('✅ Cowork: headers');

  // 6. Format headers (bold + freeze)
  const allSheets = (await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID })).data.sheets || [];
  const formatRequests = allSheets.map((s) => ({
    updateSheetProperties: {
      properties: {
        sheetId: s.properties?.sheetId,
        gridProperties: { frozenRowCount: 1 },
      },
      fields: 'gridProperties.frozenRowCount',
    },
  }));

  // Bold headers
  for (const s of allSheets) {
    formatRequests.push({
      repeatCell: {
        range: {
          sheetId: s.properties?.sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
        },
        cell: {
          userEnteredFormat: {
            textFormat: { bold: true },
            backgroundColor: { red: 0.15, green: 0.15, blue: 0.15 },
          },
        },
        fields: 'userEnteredFormat(textFormat,backgroundColor)',
      },
    } as any);
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { requests: formatRequests },
  });
  console.log('✅ Formatting applied');

  console.log('\n🎉 Google Sheet configurada com sucesso!');
  console.log(`📊 https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
}

main().catch(console.error);
