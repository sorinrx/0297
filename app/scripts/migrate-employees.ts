const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

// Funcție pentru a genera un număr de telefon privat generic
function generateGenericPrivateNumber(index: number): string {
  return `+4075${index.toString().padStart(7, '0')}`;
}

// Funcție pentru a converti datele în formatul corect pentru baza de date
function formatEmployeeData(employee) {
  return {
    name: employee.name,
    calendarid: employee.calendarId,
    userid: employee.userId,
    phonenumber: employee.phoneNumber,
    phoneprivatenumber: employee.phonePrivateNumber,
    email: employee.email
  };
}

// Datele originale pentru migrare
const employeesData = [
  { name: "Admin RENET", calendarId: 4, userId: 1, phoneNumber: "400000000000", phonePrivateNumber: generateGenericPrivateNumber(1), email: "admin@renet.com" },
  { name: "Sorin Răducu", calendarId: 6, userId: 12, phoneNumber: "40316313413", phonePrivateNumber: "+40752703232", email: "sorin@sorinraducu.ro" },
  { name: "Robert Gagos", calendarId: 36, userId: 18, phoneNumber: "40316316818", phonePrivateNumber: "+40745695511", email: "robert@robertgagos.ro" },
  { name: "Alina Raducu", calendarId: 24, userId: 22, phoneNumber: "40316316819", phonePrivateNumber: "+40741935203", email: "alinaraducu1@gmail.com" },
  { name: "Petrut Bragea", calendarId: 106, userId: 28, phoneNumber: "40316316820", phonePrivateNumber: "+40724380900", email: "petrut.bragea@renet.com" },
  { name: "Ovidiu Onofrei", calendarId: 58, userId: 30, phoneNumber: "40316316821", phonePrivateNumber: "+40749378676", email: "saconeholdings@gmail.com" },
  { name: "Eduard Radu", calendarId: 76, userId: 32, phoneNumber: "40316316822", phonePrivateNumber: "+40750407117", email: "radueduard2413@gmail.com" },
  { name: "Hasan Zafar", calendarId: 42, userId: 44, phoneNumber: "40316316823", phonePrivateNumber: generateGenericPrivateNumber(7), email: "hasan.zafar@renet.com" },
  { name: "Mihaita Moldovan", calendarId: 110, userId: 60, phoneNumber: "40316316824", phonePrivateNumber: "+40747751293", email: "mihaita.moldovan@renet.com" },
  { name: "Sorin Stoinea", calendarId: 90, userId: 88, phoneNumber: "40316316825", phonePrivateNumber: "+40740121267", email: "nirossg@gmail.com" },
  { name: "Constantin Marza", calendarId: 68, userId: 94, phoneNumber: "40316316826", phonePrivateNumber: "+40723589030", email: "constantin.marza@renet.com" },
  { name: "Roxana Iordache", calendarId: 66, userId: 96, phoneNumber: "40316316827", phonePrivateNumber: generateGenericPrivateNumber(11), email: "roxana.iordache@renet.com" },
  { name: "Daniel Dobre", calendarId: 112, userId: 98, phoneNumber: "40316316828", phonePrivateNumber: "+40742893157", email: "daniel.dobre@renet.com" },
  { name: "Mirela Moruzzi", calendarId: 114, userId: 104, phoneNumber: "40316316829", phonePrivateNumber: "+40749117774", email: "mirela.moruzzi@gmail.com" },
  { name: "Emilian Bostenaru", calendarId: 116, userId: 106, phoneNumber: "40316316830", phonePrivateNumber: generateGenericPrivateNumber(14), email: "emilian.bostenaru@renet.com" },
  { name: "Ramona Ursu", calendarId: 82, userId: 110, phoneNumber: "40316316831", phonePrivateNumber: "+40737989041", email: "ramona.ursu@renet.com" },
  { name: "Mario Dumitrescu", calendarId: 72, userId: 114, phoneNumber: "40316316832", phonePrivateNumber: "+40723307312", email: "mario.dumitrescu@renet.com" },
  { name: "Alexandru Cordea", calendarId: 78, userId: 130, phoneNumber: "40316316833", phonePrivateNumber: "+40726284310", email: "alexandrucordea@gmail.com" },
  { name: "Valeriu Stancu", calendarId: 74, userId: 132, phoneNumber: "40316316834", phonePrivateNumber: "+40729101123", email: "valeriu.stancu@gmail.com" },
  { name: "Cristina Marin", calendarId: 104, userId: 142, phoneNumber: "40316316835", phonePrivateNumber: "+40769250545", email: "cristina.marin@renet.com" },
  { name: "Alexandru Dobrea", calendarId: 84, userId: 150, phoneNumber: "40316316836", phonePrivateNumber: "+40736013770", email: "alexandru.dobrea@renet.com" },
  { name: "Cristian Sima", calendarId: 92, userId: 152, phoneNumber: "40316316837", phonePrivateNumber: "+40727817620", email: "cristian.sima@renet.com" },
  { name: "Cristian Grozea", calendarId: 118, userId: 156, phoneNumber: "40316316838", phonePrivateNumber: "+40720645925", email: "cristian.grozea@renet.com" },
  { name: "Rares Lunguti", calendarId: 98, userId: 158, phoneNumber: "40316316839", phonePrivateNumber: "+40766633577", email: "rares.lunguti@renet.com" },
  { name: "Gabriel Stancu", calendarId: 88, userId: 160, phoneNumber: "40316316840", phonePrivateNumber: "+40742727272", email: "Stancu80@gmail.com" },
  { name: "Cristi Stanica", calendarId: 120, userId: 164, phoneNumber: "40316316841", phonePrivateNumber: "+40734222095", email: "cristi.stanica@renet.com" },
  { name: "Laurentiu Stoica", calendarId: 122, userId: 170, phoneNumber: "40316316842", phonePrivateNumber: "+40737335550", email: "cumcine@gmail.com" },
  { name: "Mihaela Anton", calendarId: 124, userId: 172, phoneNumber: "40316316843", phonePrivateNumber: "+40723325257", email: "mihaela.anton@renet.com" },
  { name: "Mihai Badea", calendarId: 126, userId: 174, phoneNumber: "40316316844", phonePrivateNumber: "+40721277407", email: "mihai.badea@renet.com" },
  { name: "DEDIU MIHAI Dediu", calendarId: 138, userId: 176, phoneNumber: "40316316845", phonePrivateNumber: "+40722163102", email: "dediu.mihai@renet.com" },
  { name: "Vitalie Pascari", calendarId: 128, userId: 180, phoneNumber: "40316316846", phonePrivateNumber: "+40737143032", email: "vitalie.pascari@renet.com" },
  { name: "Victor Ion", calendarId: 102, userId: 184, phoneNumber: "40316316847", phonePrivateNumber: "+40765474485", email: "victorion.khc@gmail.com" },
  { name: "Toma Filipovici", calendarId: 96, userId: 186, phoneNumber: "40316316848", phonePrivateNumber: "+40735773269", email: "toma.filipovici@gmail.com" },
  { name: "Stelian Chirita", calendarId: 130, userId: 188, phoneNumber: "40316316849", phonePrivateNumber: "+40731664010", email: "stelian.chirita@renet.com" },
  { name: "Andreea Belous", calendarId: 86, userId: 190, phoneNumber: "40316316850", phonePrivateNumber: "+40742957076", email: "andreea.belous@renet.com" },
  { name: "Laura Filipovici", calendarId: 100, userId: 198, phoneNumber: "40316316851", phonePrivateNumber: "+40746343163", email: "laura.filipovici@renet.com" }
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Lipsesc variabilele de mediu pentru Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Funcție pentru a aștepta
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function migrateEmployees() {
  try {
    console.log('Începe migrarea angajaților...');

    // Mai întâi ștergem toate datele existente
    const { error: deleteError } = await supabase
      .from('employees')
      .delete()
      .neq('id', 0); // șterge toate înregistrările

    if (deleteError) {
      console.error('Eroare la ștergerea datelor existente:', deleteError);
      return;
    }

    // Așteptăm 2 secunde pentru a permite actualizarea schemei
    console.log('Așteptăm actualizarea schemei...');
    await sleep(2000);

    // Verificăm schema tabelului
    const { data: schema, error: schemaError } = await supabase
      .from('employees')
      .select('*')
      .limit(0);

    if (schemaError) {
      console.error('Eroare la verificarea schemei:', schemaError);
      return;
    }

    console.log('Schema actualizată, începem inserarea...');

    for (const employee of employeesData) {
      const formattedEmployee = formatEmployeeData(employee);
      console.log('Inserăm:', formattedEmployee);
      
      const { data, error } = await supabase
        .from('employees')
        .insert([formattedEmployee])
        .select();

      if (error) {
        console.error(`Eroare la inserarea ${employee.name}:`, error);
      } else {
        console.log(`Angajat migrat cu succes: ${employee.name}`);
      }
    }

    console.log('Migrare completă!');
  } catch (error) {
    console.error('Eroare în timpul migrării:', error);
  }
}

migrateEmployees(); 