
import API from "./API";
const SERVER_URL = "http://localhost:3000/api";

globalThis.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  fetch.mockClear();
});

describe("Test the login", () => {
  test("logIn - should send a POST request to the server with credentials and return a JSON response on success", async () => {
    const credentials = {
      username: "testuser",
      password: "testpassword",
    };
    const expectedResponse = { success: true };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(expectedResponse),
    });
    const result = await API.logIn(credentials);
    expect(fetch).toHaveBeenCalledWith(SERVER_URL + "/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    expect(result).toEqual(expectedResponse);
  });

  test("logIn - if fail should return an object error", async () => {
    try {
      const credentials = {
        username: "testuser",
        password: "testpassword",
      };
      const errorResponse = { error: "Invalid credentials" };
      fetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(errorResponse),
      });

      await API.logIn(credentials);

      expect(fetch).toHaveBeenCalledWith(SERVER_URL + "/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      expect(error).toEqual({ error: "Invalid credentials" });
    }
  });
});

describe("Test the insert of a proposal", () => {
  test("createProposal- should send a correct proposal to the server", async () => {
    const expectedResponse = { status: "success" };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(expectedResponse),
    });
    const proposal = {
      name: "fake Proposal",
    };
    const result = await API.createProposal(proposal);
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/proposals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proposal),
    });
    expect(result).toEqual({ status: "success" });
  });

  test("createProposal - should manage correctly errors", async () => {
    try {
      fetch.mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({ error: "error on creating the proposal" }),
      });
      const proposal = {
        name: "fake Proposal",
        error: "error",
      };
      await API.createProposal(proposal);
      expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/proposals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proposal),
      });
    } catch (error) {
      expect(error).toEqual({ error: "error on creating the proposal" });
    }
  });
});

const mockApiResponse = {
  data: "fake data",
};

test("getTeachers - should send correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse),
  });

  const result = await API.getTeachers();

  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/teachers`);
  expect(result).toEqual(mockApiResponse);
});

test("getDegrees - should send correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse),
  });

  const result = await API.getDegrees();

  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/degrees`);
  expect(result).toEqual(mockApiResponse);
});

test("getGroups - should send correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse),
  });

  const result = await API.getGroups();

  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/groups`);
  expect(result).toEqual(mockApiResponse);
});
