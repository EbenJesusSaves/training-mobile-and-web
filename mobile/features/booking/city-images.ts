import type { ImageSourcePropType } from 'react-native';

/** Photos for the seeded network, keyed by station code. Other stations show a plain tile. */
export const cityImages: Partial<Record<string, ImageSourcePropType>> = {
  ACC: require('../../assets/images/cities/accra.jpg'),
  TMA: require('../../assets/images/cities/tema.jpg'),
  NSW: require('../../assets/images/cities/nsawam.jpg'),
  KFD: require('../../assets/images/cities/koforidua.jpg'),
  KSI: require('../../assets/images/cities/kumasi.jpg'),
  OBU: require('../../assets/images/cities/obuasi.jpg'),
  TKD: require('../../assets/images/cities/takoradi.jpg'),
  CCT: require('../../assets/images/cities/cape-coast.jpg'),
  HOO: require('../../assets/images/cities/ho.jpg'),
  TML: require('../../assets/images/cities/tamale.jpg'),
};
