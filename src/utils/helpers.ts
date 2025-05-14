// Function to sort content alphabetically by title
export const sortAlphabetically = (a, b) => a.data.name.localeCompare(b.data.name);

// Function to group content by the first letter of the title
export const groupByFirstLetter = (items) => {
  return items.reduce((acc, item) => {
    const firstChar = item.data.name[0].toUpperCase();
    const firstLetter = /^[A-Z]/.test(firstChar) ? firstChar : '#';
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {});
};
