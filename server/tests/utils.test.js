"use strict";

const isLoggedIn = require('../src/protect-routes');

describe('isLoggedIn Middleware', () => {
    it('should call next() if res is not defined', () => {
        const req = { isAuthenticated: jest.fn(() => true) };
        const res = undefined;
        const next = jest.fn();
        isLoggedIn(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return 401 Unauthorized if user is not authenticated', () => {
        const req = { isAuthenticated: jest.fn(() => false) };
        const mockRes = () => {
            const res = {};
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };;
        const res = mockRes();
        const next = jest.fn();
        isLoggedIn(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      });
  });