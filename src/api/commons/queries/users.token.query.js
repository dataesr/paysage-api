export default [
  { $project: {
    _id: 0,
    id: 1,
    email: 1,
    role: 1,
    isOtpRequired: 1,
  } },
];
