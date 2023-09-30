import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const finderWidth = width * 0.85;
const finderHeight = height * 0.5;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;
const tabHeight = Math.round(height/10.5);
const sizes = {
  window: {
    width,
    height,
    finderWidth,
    finderHeight,
    tabHeight,
  },
  border: {
    viewMinX,
    viewMinY
  },
  isSmallDevice: width < 375
};

export default sizes;
