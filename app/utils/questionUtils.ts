import { getCurrentDateTime, getDateFromReference, formatDate } from './dateTime';
import { findEmployeeByEmail, EmployeeData } from './authorized_users';

export function checkQuestionCompleteness(question: string): { isComplete: boolean; missingInfo: string[] } {
  const lowerCaseQuestion = question.toLowerCase();
  const missingInfo = [];

  // Verifică dacă întrebarea este despre programări sau întâlniri
  const isAboutMeetings = /întâlnir|programăr|rezervăr|eveniment/i.test(lowerCaseQuestion);

  if (isAboutMeetings) {
    // Verifică referințele temporale doar pentru întrebări despre întâlniri
    const timeReferences = ['azi', 'astăzi', 'mâine', 'poimâine', 'ieri', 'alaltăieri'];
    const dayNumbers = ['o zi', 'două zile', 'trei zile', 'patru zile', 'cinci zile'];
    const hasTimeReference = timeReferences.some(ref => lowerCaseQuestion.includes(ref)) ||
                             dayNumbers.some(num => lowerCaseQuestion.includes(num)) ||
                             lowerCaseQuestion.includes('zile') ||
                             /\b(luni|marți|miercuri|joi|vineri|sâmbătă|duminică)\b/.test(lowerCaseQuestion) ||
                             lowerCaseQuestion.match(/\d{1,2}([./-])\d{1,2}\1\d{4}/);

    if (!hasTimeReference) {
      missingInfo.push('data');
    }

    if (!lowerCaseQuestion.includes('sala') && !lowerCaseQuestion.includes('toate sălile')) {
      missingInfo.push('sala');
    }
  }

  // Adăugați aici alte verificări pentru alte tipuri de întrebări

  return {
    isComplete: missingInfo.length === 0,
    missingInfo
  };
}

export function processUserQuestion(question: string, userEmail: string): string {
  const employee = findEmployeeByEmail(userEmail);
  if (!employee) {
    return "Ne pare rău, nu vă putem identifica. Vă rugăm să vă autentificați din nou.";
  }

  const firstName = employee.name.split(' ')[0];
  const { isComplete, missingInfo } = checkQuestionCompleteness(question);

  if (!isComplete) {
    return `${firstName}, pentru a vă putea ajuta, am nevoie de următoarele informații: ${missingInfo.join(', ')}. Vă rog să le includeți în întrebarea dumneavoastră.`;
  }

  // Procesăm întrebarea aici
  if (question.toLowerCase().includes('cine sunt eu')) {
    return `${firstName}, tu ești ${employee.name}. Ai ID-ul de utilizator ${employee.userId} și ID-ul de calendar ${employee.calendarId}. Numărul tău de telefon este ${employee.phoneNumber}.`;
  }

  if (question.toLowerCase().includes('întâlniri')) {
    const dateReference = question.match(/(\w+)\s*zile|azi|astăzi|mâine|poimâine|luni|marți|miercuri|joi|vineri|sâmbătă|duminică/i);
    let date = new Date();
    if (dateReference) {
      date = getDateFromReference(dateReference[0]);
    }

    return `${firstName}, pentru data de ${formatDate(date)}, trebuie să verific întâlnirile în calendarul cu ID-ul ${employee.calendarId}. Voi implementa această funcționalitate în curând.`;
  }

  return `${firstName}, îmi pare rău, dar nu am înțeles întrebarea. Poți să reformulezi, te rog?`;
}