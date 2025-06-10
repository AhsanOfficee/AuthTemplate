/* 
    It will split the camel case words
    Then it will capitalize each Word
    then it will return the string;
*/
export const splitCamelCaseAndCapitalizeEachWord = (input: string) => {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join the words back into a single string
};

/* 
    It will split the words
    Then it will capitalize each Word
    then it will return the string;
*/
export const CapitalizeFirstCharOfEveryWord = (msg: string) => {
  const newMessage = msg
    .split(" ") // Split the string into words
    .map((word) => {
      // Remove numbers from the word
      const noNumbers = word.replace(/[0-9]/g, "");
      // Capitalize the first letter of the word
      return (
        noNumbers.charAt(0).toUpperCase() + noNumbers.slice(1).toLowerCase()
      );
    })
    .join(" ") // Join the words back into a single string
    .trim(); // Trim extra spaces

  return newMessage;
};
