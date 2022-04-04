const realUsernames: Record<string, string> = {
  indrif: "daniel.winther",
  niclaslindstedt: "niclas.lindstedt",
};

export const getUsernameFromGithubUsername = (username: string) =>
  realUsernames[username] ?? null;
