import { loadEmployees, findEmployeeData, type EmployeeData, type RoomData } from './authorized_users';

export async function findEmployeeByName(name: string): Promise<EmployeeData | undefined> {
  return await findEmployeeData(name);
}

export async function findEmployeeByPhoneNumber(phoneNumber: string): Promise<EmployeeData | undefined> {
  const employees = await loadEmployees();
  return employees.find(employee => employee.phoneprivatenumber === phoneNumber);
}

export const rooms: RoomData[] = [
  { name: "Sala 1", calendarId: 2 },
  { name: "Sala 2", calendarId: 28 },
  { name: "Sala 3", calendarId: 108 }
];

// Re-export types
export type { EmployeeData, RoomData };