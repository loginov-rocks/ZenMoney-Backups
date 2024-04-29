export const fileNameToDate = (fileName) => {
  const elements = fileName.split('-');
  const date = new Date(`${elements[0]}-${elements[1]}-${elements[2]}T${elements[3]}:${elements[4]}:${elements[5]}.${elements[6]}`);

  return date;
};
