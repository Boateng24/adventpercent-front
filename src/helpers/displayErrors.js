//  const validate = (input) => {
//   let tempErrors = {};
//   if (!input.username) tempErrors.username = "Username is required";
//   if (!input.password) tempErrors.password = "Password is required";
//   if (input.password && input.password.length < 6)
//     tempErrors.password =
//       "Password must be longer than or equal to 6 characters";
//   if (!input.confirmPassword)
//     tempErrors.confirmPassword = "Please confirm your password";
//   if (input.password !== input.confirmPassword)
//     tempErrors.confirmPassword = "Passwords do not match";
//   if (!input.email) tempErrors.email = "Email is required";
//   if (input.email && !/\S+@\S+\.\S+/.test(input.email))
//     tempErrors.email = "Email must be a valid email address";

//   setErrors(tempErrors);
//   return Object.keys(tempErrors).length === 0;
// };
