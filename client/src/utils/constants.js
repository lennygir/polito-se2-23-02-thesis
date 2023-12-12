// Application constants

/**
 * The base URL for the API.
 * @constant
 */
export const SERVER_URL = "http://localhost:3000/api";

/**
 * The URL for calling the login endpoint.
 * @constant
 */
export const LOGIN_URL = "http://localhost:3000/login";

/**
 * The URL for calling the logout endpoint.
 * @constant
 */
export const LOGOUT_URL = "http://localhost:3000/logout";

/**
 * The list of types available for a thesis proposal
 * @constant
 */
export const TYPES = ["RESEARCH", "COMPANY", "EXPERIMENTAL", "ABROAD"];

/**
 * The list of levels available for a thesis proposal
 * @constant
 */
export const LEVELS = ["Bachelor Degree", "Master Degree"];

/**
 * The list of filters available to a teacher
 * @constant
 */
export const TEACHER_PROPOSALS_FILTERS = [
  {
    id: "active",
    label: "ACTIVE"
  },
  {
    id: "archive",
    label: "ARCHIVED"
  }
];

/** Teacher's proposals page table headers in the Active tab  */
export const TEACHER_HEADERS_ACTIVE = ["Thesis", "Expiration", ""];

/** Teacher's proposals page table headers in the Archived tab  */
export const TEACHER_HEADERS_EXPIRED = ["Thesis", "Expiration", "Reason", ""];

/**
 * Color Palette
 */
export const NAVY = {
  main: "#002B49",
  light: "#2AA8FF",
  dark: "#00192A",
  contrastText: "#FFF"
};

export const ORANGE = {
  main: "#FF8F19",
  light: "#FFB76A",
  dark: "#B75E00",
  contrastText: "#00192A"
};

export const ROSE = {
  main: "#FB7185",
  light: "#FECDD3",
  dark: "#E11D48",
  contrastText: "#FFF"
};

export const WHITE = {
  main: "#FFFFFF",
  light: "#FFFFFF",
  dark: "#FFFFFF",
  contrastText: "#FFFFFF"
};

export const LIGHT_BACKGROUND = {
  paper: "#FFFFFF",
  default: "#F0F3F5"
};

export const DARK_BACKGROUND = {
  paper: "#00192A",
  default: "#00192A"
};
