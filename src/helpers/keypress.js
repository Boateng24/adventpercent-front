import { useNavigate } from "react-router-dom";

// Function to handle Enter key press and navigate to a specific route
export const useEnterKeyNavigation = (route) => {
  const history = useNavigate();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      history.push(route);
    }
  };

  return handleKeyPress;
};
