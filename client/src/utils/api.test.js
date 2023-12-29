import API from "./API";
import { SERVER_URL } from "./constants";
import 'isomorphic-fetch'

globalThis.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  fetch.mockClear();
});

describe("Test getJson function", () => {
  test("promise.ok==true ==> promise rejection", async () => {
    try {
      const expectedResponse = { status: "success" };
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(expectedResponse)
      });
      await API.createProposal();
    }catch (error){
      expect(error).toEqual(new Error("Cannot parse server response"));
    }
  })

  test("promise.ok==false ==> promise rejection", async () => {
    try {
      const expectedResponse = { status: "insuccess" };
      fetch.mockResolvedValue({
        ok: false,
        json: () => Promise.reject(expectedResponse)
      });
      await API.createProposal();
    }catch (error){
      expect(error).toEqual(new Error("Cannot parse server response"));
    }
  })

  test("the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail", async () => {
    try {
      fetch.mockResolvedValue("error");
      await API.createProposal();
    }catch (error){
      expect(error).toEqual(new Error("Cannot communicate"));
    }
  })  
});

describe("Test the insert of a proposal", () => {
  test("createProposal- should send a correct proposal to the server", async () => {
    const expectedResponse = { status: "success" };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(expectedResponse)
    });
    const proposal = {
      name: "fake Proposal"
    };
    const result = await API.createProposal(proposal);
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/proposals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(proposal),
      credentials: "include"
    });
    expect(result).toEqual({ status: "success" });
  });

  test("createProposal - should manage correctly errors", async () => {
    try {
      fetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "error on creating the proposal" })
      });
      const proposal = {
        name: "fake Proposal",
        error: "error"
      };
      await API.createProposal(proposal);
      expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/proposals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(proposal),
        credentials: "include"
      });
    } catch (error) {
      expect(error).toEqual({ error: "error on creating the proposal" });
    }
  });
});

const mockApiResponse = {
  data: "fake data"
};

test("getTeachers - should send correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  });

  const result = await API.getTeachers();

  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/teachers`, {
    credentials: "include"
  });
  expect(result).toEqual(mockApiResponse);
});

test("getDegrees - should send correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  });

  const result = await API.getDegrees();

  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/degrees`, {
    credentials: "include"
  });
  expect(result).toEqual(mockApiResponse);
});

test("getGroups - should send correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  });

  const result = await API.getGroups();

  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/groups`, {
    credentials: "include"
  });
  expect(result).toEqual(mockApiResponse);
});

test("getProposals - should return correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  });
  const result = await API.getProposals();
  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/proposals`, {
    credentials: "include"
  });
  expect(result).toEqual(mockApiResponse);
});

describe("Test the creation of an application", () => {
  test("createApplication - should send a correct application to the server", async () => {
    const expectedResponse = { status: "success" };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(expectedResponse)
    });
    const application = {
      proposal: "fake proposal",
      student: "fake student"
    };
    const result = await API.createApplication(application);
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(application),
      credentials: "include"
    });
    expect(result).toEqual({ status: "success" });
  });

  test("createApplication - should manage correctly errors", async () => {
    try {
      fetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "error on inserting the application" })
      });
      const application = {
        proposal: "not valid Proposal",
        student: "fake student"
      };
      await API.createApplication(application);
      expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(application),
        credentials: "include"
      });
    } catch (error) {
      expect(error).toEqual({ error: "error on inserting the application" });
    }
  });
});

test("getApplications - should return correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  });
  const result = await API.getApplications();
  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/applications`, {
    credentials: "include"
  });
  expect(result).toEqual(mockApiResponse);
});

test("evaluateApplication - should return correct update message", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ message: "success update" })
  });
  const application = {
    id: 4,
    state: "state"
  };
  const result = await API.evaluateApplication(application);
  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/applications/${application.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ state: application.state }),
    credentials: "include"
  });

  expect(result).toEqual({ message: "success update" });
});

test("getNotifications - should return correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  });
  const result = await API.getNotifications();
  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/notifications`, {
    credentials: "include"
  });
  expect(result).toEqual(mockApiResponse);
});

it("updateProposal - should update a proposal successfully and return the result", async () => {
  const proposalToUpdate = { id: 12345, title: "Updated Title", description: "Updated Description" };
  fetch.mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce({ message: "Proposal updated successfully" })
  });
  const result = await API.updateProposal(proposalToUpdate);
  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/proposals/${proposalToUpdate.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(proposalToUpdate),
    credentials: "include"
  });
  expect(result).toEqual({ message: "Proposal updated successfully" });
});

describe("Test the deletion of a proposal", () => {
  it("deleteProposal - should delete a proposal successfully and return a message", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Proposal deleted successfully" })
    });
    const proposalIdToDelete = 12345;
    const result = await API.deleteProposal(proposalIdToDelete);
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/proposals/${proposalIdToDelete}`, {
      method: "DELETE",
      credentials: "include"
    });
    expect(result).toEqual({ message: "Proposal deleted successfully" });
  });

  it("deleteProposal - should handle failed deletion and throw an error", async () => {
    try {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "error on deleting the proposal" })
      });
      const proposalIdToDelete = 67890;
      await API.deleteProposal(proposalIdToDelete);
      expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/proposals/${proposalIdToDelete}`, {
        method: "DELETE",
        credentials: "include"
      });
    } catch (error) {
      expect(error).toEqual({ error: "error on deleting the proposal" });
    }
  });
});

describe("Test the virtual clock", () => {
  it("getVirtualClock - should successfully get virtual clock", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ date: "2023-12-31" })
    });
    const result = await API.getVirtualClock();
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/virtualClock`, { credentials: "include" });
    expect(result).toEqual({ date: "2023-12-31" });
  });

  it("updateVirtualClock - should successfully update virtual clock", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Update successful" })
    });
    const result = await API.updateVirtualClock("2023-12-31");
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/virtualClock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify("2023-12-31"),
      credentials: "include"
    });
    expect(result).toEqual({ message: "Update successful" });
  });

  it("updateVirtualClock - should handle updateVirtualClock failure", async () => {
    try {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "error on updating the clock" })
      });
      await API.updateVirtualClock("2022-12-31");
    } catch (error) {
      expect(error).toEqual({ error: "error on updating the clock" });
    }
  });
});

test("getRequests - should return correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  });
  const result = await API.getRequests();
  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/start-requests`, {
    credentials: "include"
  });
  expect(result).toEqual(mockApiResponse);
});

test("evaluateApplication - should return correct update message", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ message: "correct evaluation" })
  });
  const request = {
    id: 4,
    approved: true
  };
  const result = await API.evaluateRequest(request);
  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/start-requests/${request.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ approved: request.state }),
    credentials: "include"
  });

  expect(result).toEqual({ message: "correct evaluation" });
});

describe("Test the archivial of a proposal", () => {
  it("archiveProposal - should archive a proposal successfully and return a message", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Proposal archived successfully" })
    });
    const proposalId = 12345;
    const result = await API.archiveProposal(proposalId);
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/proposals/${proposalId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ archived: true })
    });
    expect(result).toEqual({ message: "Proposal archived successfully" });
  });

  it("archiveProposal - should handle failed archivial and throw an error", async () => {
    try {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "error on archiving the proposal" })
      });
      const proposalId = 67890;
      await API.archiveProposal(proposalId);
      expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/proposals/${proposalId}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ approved: true }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      expect(error).toEqual({ error: "error on archiving the proposal" });
    }
  });
});

describe("Test the send of a request", () => {
  test("sendRequest- should send a correct request to the server", async () => {
    const expectedResponse = { message: "success" };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(expectedResponse)
    });
    const request = {
      name: "fake request"
    };
    const result = await API.createRequest(request);
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/start-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request),
      credentials: "include"
    });
    expect(result).toEqual({ message: "success" });
  });

  test("sendRequest - should manage correctly errors", async () => {
    try {
      fetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "error on sending the request" })
      });
      const request = {
        name: "fake request",
        error: "error"
      };
      await API.createRequest(request);
      expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/start-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request),
        credentials: "include"
      });
    } catch (error) {
      expect(error).toEqual({ error: "error on sending the request" });
    }
  });
});

describe("Test the get and the post of the file attached to the application", () => {
  test("attachFileToApplication - should return correct attach message", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "success attach" })
    });
    const application = {
      id: 4,
      file: {}
    };
    const result = await API.attachFileToApplication(application.id,application.file);
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/applications/${application.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/pdf"
      },
      body: application.file,
      credentials: "include"
    });
    expect(result).toEqual({ message: "success attach" });
  });

  test("getApplicationFile - should return attached file", async () => {
    const sampleBlob = new Blob(['sample file content'], { type: 'text/plain' });
    const response = new Response(sampleBlob,{
      ok: true,
      status: 200,
    });
    const expectedResponse = new Response(sampleBlob,{
      ok: true,
      status: 200,
    });
    fetch.mockResolvedValue(response);
    const applicationId = 4;
    const result = await API.getApplicationFile(applicationId);
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/applications/${applicationId}/attached-file`, {
      credentials: "include"
    });
    const expectedBlob = await expectedResponse.blob();
    expect(result).toEqual(expectedBlob);
  });

  test("getApplicationFile - should return an error if response was rejected", async () => {
    const spyConsoleLog = jest.spyOn(console, 'error').mockImplementation(() => {});
    const response = new Response(new Blob(),{
      ok: false,
      status: 400,
    });
    fetch.mockResolvedValue(response);
    const applicationId = 4;
    await API.getApplicationFile(applicationId);
    expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/applications/${applicationId}/attached-file`, {
      credentials: "include"
    });
    const error = new Error(`Failed to fetch file. Status: ${response.status}`);
    expect(spyConsoleLog).toHaveBeenCalledWith("Error fetching file:", error); 
    spyConsoleLog.mockRestore();
  });
});

test("getUserInfo - should return correct data", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  });
  const result = await API.getUserInfo();
  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/sessions/current`, {
    credentials: "include"
  });
  expect(result).toEqual(mockApiResponse);
});

test("getCareerOfStudent - should return correct data", async () => {
  const applicationId = 4;
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  });
  const result = await API.getCareerOfStudent(applicationId);
  expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/students/${applicationId}/exams`, {
    method: "GET",
    credentials: "include"
  });
  expect(result).toEqual(mockApiResponse);
});
