export type logValueObject = {
  bind: [string, string, string, ...string[]]; // Assuming an array where the first three elements are strings
  [key: string]: object; // Additional properties
};

export type tokenObject = {
  header: object;
  [key: string]: object | any; // Additional properties
};
