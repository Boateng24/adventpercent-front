import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext(null);

const DARK_HOUR_START = 19; // 7pm
const DARK_HOUR_END = 7;   // 7am

const getAutoTheme = () => {
  const hour = new Date().getHours();
  return hour >= DARK_HOUR_START || hour < DARK_HOUR_END ? "dark" : "light";
};

const msUntilNextTransition = () => {
  const now = new Date();
  const hour = now.getHours();
  const next = new Date(now);

  if (hour >= DARK_HOUR_START) {
    // next transition is 7am tomorrow
    next.setDate(next.getDate() + 1);
    next.setHours(DARK_HOUR_END, 0, 0, 0);
  } else if (hour < DARK_HOUR_END) {
    // next transition is 7am today
    next.setHours(DARK_HOUR_END, 0, 0, 0);
  } else {
    // next transition is 7pm today
    next.setHours(DARK_HOUR_START, 0, 0, 0);
  }

  return next.getTime() - now.getTime();
};

export const ThemeProvider = ({ children }) => {
  const [preference, setPreferenceState] = useState(() => {
    return localStorage.getItem("ap-theme-preference") || "auto";
  });

  const resolvedTheme =
    preference === "auto" ? getAutoTheme() : preference;

  // Apply / remove dark class on <html>
  useEffect(() => {
    const html = document.documentElement;
    if (resolvedTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [resolvedTheme]);

  // Schedule auto transitions
  useEffect(() => {
    if (preference !== "auto") return;

    const schedule = () => {
      const delay = msUntilNextTransition();
      return setTimeout(() => {
        const newTheme = getAutoTheme();
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        schedule(); // reschedule for the following transition
      }, delay);
    };

    const timer = schedule();
    return () => clearTimeout(timer);
  }, [preference]);

  const setPreference = (pref) => {
    setPreferenceState(pref);
    localStorage.setItem("ap-theme-preference", pref);
  };

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
