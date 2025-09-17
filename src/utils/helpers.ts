// Function to sort content alphabetically by title
export const sortAlphabetically = (a: any, b: any) => a.data.name.localeCompare(b.data.name);

// Function to group content by the first letter of the title
export const groupByFirstLetter = (items: any[]) => {
  return items.reduce((acc: Record<string, any[]>, item: any) => {
    const firstChar = item.data.name[0].toUpperCase();
    const firstLetter = /^[A-Z]/.test(firstChar) ? firstChar : "#";
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {});
};
