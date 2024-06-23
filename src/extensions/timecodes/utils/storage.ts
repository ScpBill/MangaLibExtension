import Storage from '../../../utils/storage';


const LOCAL_STORAGE_NAME = 'mangalibextension-timecode';


export const storage = new Storage<ExtensionStorage>(LOCAL_STORAGE_NAME, {
  config: {
    collapsed: true,
  },
  teams: [],
});
