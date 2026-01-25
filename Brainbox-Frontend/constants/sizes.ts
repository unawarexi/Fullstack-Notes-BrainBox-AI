export const RNSizes = {
  // Padding & Margin Sizes
  paddingXS: 4.0,
  paddingSM: 8.0,
  paddingMD: 16.0,
  paddingLG: 24.0,
  paddingXL: 32.0,

  marginXS: 4.0,
  marginSM: 8.0,
  marginMD: 16.0,
  marginLG: 24.0,
  marginXL: 32.0,

  // Icon Sizes
  iconSizeXS: 12.0,
  iconSizeSM: 16.0,
  iconSizeMD: 24.0,
  iconSizeLG: 32.0,
  iconSizeXL: 48.0,

  // Font Sizes
  fontSizeXS: 10.0,
  fontSizeSM: 12.0,
  fontSizeMD: 16.0,
  fontSizeLG: 20.0,
  fontSizeXL: 24.0,

  // Button Sizes
  buttonHeight: 18.0,
  buttonWidth: 120.0,
  buttonRadius: 12.0,

  // AppBar Height
  appBarHeight: 56.0,

  // Image Sizes
  imageThumbSize: 80.0,

  // Default spacing between sections
  defaultSpace: 24.0,
  spaceBetweenItems: 16.0,
  spaceBetweenSections: 32.0,

  // border radius
  borderRadiusSM: 8.0,
  borderRadiusMD: 12.0,
  borderRadiusLG: 16.0,

  // divider height
  dividerHeight: 1.0,

  // Card Sizes
  cardSizeXS: 6.0,
  cardSizeSM: 10.0,
  cardSizeMD: 14.0,
  cardSizeLG: 16.0,
  cardElevation: 2.0,

  // Input Field
  inputFieldRadius: 12.0,
  spaceBetweenInputFields: 16.0,

  // Product Item Dimensions
  productItemHeight: 160.0,
  productImageSize: 120.0,
  productImageRadius: 16.0,

  // Image carousel height
  imageCarouselHeight: 200.0,

  // loading indicator size
  loadingIndicatorSize: 36.0,

  // Grid view spacing
  gridViewSpacing: 16.0,

  // Additional Size Categories
  sizeXS: 4.0,
  sizeSM: 8.0,
  sizeMD: 16.0,
  sizeLG: 24.0,
  sizeXL: 32.0,
} as const;

export type RNSizesType = typeof RNSizes;
