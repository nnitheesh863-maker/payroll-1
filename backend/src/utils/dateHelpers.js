export const formatDateIso = (d = new Date()) => {
  return d.toISOString().split('T')[0];
};

export const getFirstAndLastDayOfMonth = (year, month) => {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  return {
    start: formatDateIso(first),
    end: formatDateIso(last),
  };
};
