import {
  SOCKET_URL,
  SOCKET_TIMEOUT,
  DEBUG_MODE
} from '@env';

const SOCKET_URL_FALLBACK = 'http://localhost:5000';
const SOCKET_TIMEOUT_FALLBACK = 5000;

export const socketConfig = {
  url: SOCKET_URL || SOCKET_URL_FALLBACK,
  timeout: SOCKET_TIMEOUT || SOCKET_TIMEOUT_FALLBACK,
  debug: DEBUG_MODE === 'true'
};

export const appConfig = {
  debug: DEBUG_MODE === 'true'
};

