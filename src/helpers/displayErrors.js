 export const validate = (inputs, setErrors) => {
   let tempErrors = {};

   // Check for username only if it's present in inputs
   if ("username" in inputs) {
     if (!inputs.username) tempErrors.username = "Username is required";
   }

   // Common validations for both login and signup
   if (!inputs.password) tempErrors.password = "Password is required";
   if (inputs.password && inputs.password.length < 6)
     tempErrors.password =
       "Password must be longer than or equal to 6 characters";
   if (!inputs.email) tempErrors.email = "Email is required";
   if (inputs.email && !/\S+@\S+\.\S+/.test(inputs.email))
     tempErrors.email = "Email must be a valid email address";

   // Check for confirmPassword only if it's present in inputs
   if ("confirmPassword" in inputs) {
     if (!inputs.confirmPassword)
       tempErrors.confirmPassword = "Please confirm your password";
     if (inputs.password !== inputs.confirmPassword)
       tempErrors.confirmPassword = "Passwords do not match";
   }

   setErrors(tempErrors);
   return Object.keys(tempErrors).length === 0;
 };