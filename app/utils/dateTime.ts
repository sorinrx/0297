const getCurrentDateTime = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1, // Luna este indexată de la 0, adăugăm 1
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes()
  };
};

const getDateFromReference = (reference: string): Date => {
  const now = new Date();
  const lowerRef = reference.toLowerCase();

  if (lowerRef === 'azi' || lowerRef === 'astăzi') {
    return now;
  } else if (lowerRef === 'mâine') {
    now.setDate(now.getDate() + 1);
  } else if (lowerRef === 'poimâine') {
    now.setDate(now.getDate() + 2);
  } else if (lowerRef.includes('zile')) {
    const match = lowerRef.match(/(\d+)\s*zile/);
    if (match) {
      const days = parseInt(match[1]);
      now.setDate(now.getDate() + days);
    }
  } else if (/luni|marți|miercuri|joi|vineri|sâmbătă|duminică/.test(lowerRef)) {
    const dayOfWeek = ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'].indexOf(lowerRef);
    if (dayOfWeek !== -1) {
      const today = now.getDay();
      const daysUntil = (dayOfWeek + 7 - today) % 7;
      now.setDate(now.getDate() + daysUntil);
    }
  }

  return now;
};

const formatDate = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

export { getCurrentDateTime, getDateFromReference, formatDate };