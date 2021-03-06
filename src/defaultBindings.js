// @flow
import { Container } from 'constitute';

import DeviceAttributeFileRepository from './repository/DeviceAttributeFileRepository';
import DeviceKeyFileRepository from './repository/DeviceKeyFileRepository';
import DeviceServer from './server/DeviceServer';
import EventPublisher from './lib/EventPublisher';
import ClaimCodeManager from './lib/ClaimCodeManager';
import CryptoManager from './lib/CryptoManager';
import ServerKeyFileRepository from './repository/ServerKeyFileRepository';
import settings from './settings';

type Settings = {
  BINARIES_DIRECTORY: string,
  DEVICE_DIRECTORY: string,
  SERVER_KEYS_DIRECTORY: string,
  SERVER_KEY_FILENAME: string,
  SERVER_KEY_PASSWORD: ?string,
};

const defaultBindings = (container: Container, newSettings: Settings) => {
  settings.BINARIES_DIRECTORY = newSettings.BINARIES_DIRECTORY;
  settings.DEVICE_DIRECTORY = newSettings.DEVICE_DIRECTORY;
  settings.SERVER_KEYS_DIRECTORY = newSettings.SERVER_KEYS_DIRECTORY;
  settings.SERVER_KEY_FILENAME = newSettings.SERVER_KEY_FILENAME;
  settings.SERVER_KEY_PASSWORD = newSettings.SERVER_KEY_PASSWORD || null;

  // Settings
  container.bindValue('DEVICE_DIRECTORY', settings.DEVICE_DIRECTORY);
  container.bindValue('SERVER_CONFIG', settings.SERVER_CONFIG);
  container.bindValue('SERVER_KEY_FILENAME', settings.SERVER_KEY_FILENAME);
  container.bindValue('SERVER_KEY_PASSWORD', settings.SERVER_KEY_PASSWORD);
  container.bindValue('SERVER_KEYS_DIRECTORY', settings.SERVER_KEYS_DIRECTORY);

  // Repository
  container.bindClass(
    'DeviceAttributeRepository',
    DeviceAttributeFileRepository,
    ['DEVICE_DIRECTORY'],
  );
  container.bindClass(
    'DeviceKeyRepository',
    DeviceKeyFileRepository,
    ['DEVICE_DIRECTORY'],
  );
  container.bindClass(
    'ServerKeyRepository',
    ServerKeyFileRepository,
    ['SERVER_KEYS_DIRECTORY', 'SERVER_KEY_FILENAME'],
  );

  // Utils
  container.bindClass('EventPublisher', EventPublisher, []);
  container.bindClass('ClaimCodeManager', ClaimCodeManager, []);
  container.bindClass(
    'CryptoManager',
    CryptoManager,
    [
      'DeviceKeyRepository',
      'ServerKeyRepository',
      'SERVER_KEY_PASSWORD',
    ],
  );

  // Device server
  container.bindClass(
    'DeviceServer',
    DeviceServer,
    [
      'DeviceAttributeRepository',
      'ClaimCodeManager',
      'CryptoManager',
      'EventPublisher',
      'SERVER_CONFIG',
    ],
  );
};

export default defaultBindings;
