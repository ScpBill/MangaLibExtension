import Storage from '../../../utils/storage';


const LOCAL_STORAGE_NAME = 'mangalibextension-timecode';


export const storage = new Storage<ExtensionStorage>(LOCAL_STORAGE_NAME, {
  config: {
    'max-rules-count': 10,
    'displayed-cards': 2,
    'show-details-on-hover': true,
    'show-buttons-only-on-hover': false,
    'show-video-on-hover': true,
    'productivity-mode': false,
    'show-the-preset-name': {
      'on-focus': {},
      'on-blur': {},
    },
    'always-show-the-add-card-button': false,
    'check-for-includes-the-team': true,
    'enable-only-for-this': false,
  },
  fixed: [],
  presets: [],
});
