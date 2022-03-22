const realUsernames = {
  indrif: "daniel.winther",
  niclaslindstedt: "niclas.lindstedt",
};

const getUsernameFromGithubUsername = (username) => realUsernames[username];

module.exports = {
  getUsernameFromGithubUsername,
};
