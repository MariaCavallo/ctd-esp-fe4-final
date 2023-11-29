import 'whatwg-fetch'
import '@testing-library/jest-dom/extend-expect'
import {server} from './src/test/server'

process.env.MARVEL_API_URL = 'http://localhost/marvel/api';
process.env.MARVEL_API_PRIVATE_KEY = '8164ea1fc115defe8bea9140e32bdc72d98f1415';
process.env.MARVEL_API_PUBLIC_KEY = 'd279a9f11f2c2a902a340aeaa5d21ee1';

beforeAll(() => server.listen())
// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
afterEach(() => server.resetHandlers())
afterAll(() => server.close())