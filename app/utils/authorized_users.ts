// app/utils/authorized_users.ts

import { createClient } from '@supabase/supabase-js';

export interface EmployeeData {
  name: string;
  calendarid: number;
  userid: number;
  phonenumber: string;
  phoneprivatenumber: string;
  email: string;
}

export interface RoomData {
  name: string;
  calendarId: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key are required');
}

const supabase = createClient(supabaseUrl, supabaseKey);

let employeesCache: EmployeeData[] = [];

// Funcție pentru a încărca și cache-ui angajații
export async function loadEmployees(): Promise<EmployeeData[]> {
  if (employeesCache.length > 0) {
    return employeesCache;
  }

  const { data, error } = await supabase
    .from('employees')
    .select('*');

  if (error) {
    console.error('Eroare la încărcarea angajaților:', error);
    return [];
  }

  employeesCache = data as EmployeeData[];
  return employeesCache;
}

export const rooms: RoomData[] = [
  { name: "Sala 1", calendarId: 2 },
  { name: "Sala 2", calendarId: 28 },
  { name: "Sala 3", calendarId: 108 }
];

export async function findEmployeeByEmail(email: string): Promise<EmployeeData | undefined> {
  const employees = await loadEmployees();
  return employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
}

export async function findEmployeeData(name: string): Promise<EmployeeData | undefined> {
  const employees = await loadEmployees();
  return employees.find(emp => emp.name.toLowerCase() === name.toLowerCase());
}

export function findRoomData(roomName: string): RoomData | undefined {
  return rooms.find(room => room.name.toLowerCase() === roomName.toLowerCase());
}

export async function authorizeWhatsAppAccess(phoneNumber: string): Promise<EmployeeData | undefined> {
  const employees = await loadEmployees();
  return employees.find(emp => emp.phoneprivatenumber === phoneNumber);
}

// Obiect pentru a reține identitatea utilizatorilor autorizați
const authorizedSessions: { [phoneNumber: string]: EmployeeData } = {};

export function setAuthorizedUser(phoneNumber: string, employeeData: EmployeeData): void {
  authorizedSessions[phoneNumber] = employeeData;
}

export function getAuthorizedUser(phoneNumber: string): EmployeeData | undefined {
  return authorizedSessions[phoneNumber];
}