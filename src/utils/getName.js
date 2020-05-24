const getFirstAndLastName = name => {
  const nameSplit = name.split(' ');
  const lastName = nameSplit.length > 1 ? nameSplit[nameSplit.length - 1] : ' ';
  const firstName =
    nameSplit.length <= 1
      ? nameSplit[0] || ''
      : nameSplit.slice(0, nameSplit.length - 1).join(' ');
  return {
    firstName,
    lastName,
  };
};

export default getFirstAndLastName;
