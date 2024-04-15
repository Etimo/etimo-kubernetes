import { EMPLOYEES_JSON } from "./consts";
import { getFileContent } from "./file";
import { Employee } from "./interfaces";
import { assertValidData, schemaEmployees } from "./schemas";

export const getUsernameFromGithubUsername = (
  username: string
): string | null => {
  const employees: Employee[] = JSON.parse(getFileContent(EMPLOYEES_JSON));
  // assertValidData(employees, schemaEmployees);
  const found = employees.find(
    (employee) => employee.githubUsername.toLocaleLowerCase() === username.toLocaleLowerCase()
  );
  return found?.username ?? null;
};

export const getAllEmployeesGithubusernames = () => {
  const employees: Employee[] = JSON.parse(getFileContent(EMPLOYEES_JSON));
  // assertValidData(employees, schemaEmployees);
  return new Set(employees.map((e) => e.githubUsername));
};
