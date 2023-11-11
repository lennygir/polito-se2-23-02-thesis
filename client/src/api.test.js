const {logIn,logOut} = require('./API.js');
const SERVER_URL = 'http://localhost:3000/api';

globalThis.fetch=jest.fn();

describe('Test the login', () => {
    test('logIn - should send a POST request to the server with credentials and return a JSON response on success', async () => {
        const credentials = {
            username: 'testuser',
            password: 'testpassword',
          };
         const expectedResponse = { success: true };
         fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(expectedResponse),
          });
          const result = await logIn(credentials);
          expect(fetch).toHaveBeenCalledWith(SERVER_URL + '/sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(credentials),
          });
          expect(result).toEqual(expectedResponse);

    });

    test('logIn - if fail should return an object error', async () => {
      try{
      const credentials = {
            username: 'testuser',
            password: 'testpassword',
          };
          const errorResponse = { error: 'Invalid credentials' };
          fetch.mockResolvedValue({
            ok: false,
            json: () => Promise.resolve(errorResponse),
          });
          await logIn(credentials);
          expect(fetch).toHaveBeenCalledWith(SERVER_URL + '/sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(credentials),
          });
        }catch(error){   
          expect(error).toEqual({ error: 'Invalid credentials' });
        }
    });
});
