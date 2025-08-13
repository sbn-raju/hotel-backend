function getNumberOfDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Clear time part for accurate diff
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end - start;

  if (diffTime < 0) return 0; // optional: don't allow negative days

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

module.exports = getNumberOfDays
