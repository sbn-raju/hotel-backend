async function getUserAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const m = today.getMonth() - birthDate.getMonth();
  const d = today.getDate() - birthDate.getDate();

  // If the birth month and day haven't occurred yet this year, subtract 1
  if (m < 0 || (m === 0 && d < 0)) {
    age--;
  }

  return age;
}


module.exports = getUserAge
