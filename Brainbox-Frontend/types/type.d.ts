declare interface CustomBottomSheetProps {
  // Visibility
  isVisible: boolean;
  onClose: () => void;

  // Snap points configuration
  enableSnapping?: boolean;
  snapPoints?: string[] | number[];
  initialSnapIndex?: number;

  // Behavior options
  enablePanDownToClose?: boolean;
  enableOverDrag?: boolean;
  enableHandlePanningGesture?: boolean;
  enableContentPanningGesture?: boolean;

  // Backdrop options
  enableBackdrop?: boolean;
  backdropOpacity?: number;
  backdropAppearanceOnIndex?: number;
  backdropDisappearOnIndex?: number;

  // Styling
  backgroundStyle?: ViewStyle;
  handleStyle?: ViewStyle;
  handleIndicatorStyle?: ViewStyle;

  // Content options
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardBehavior?: "extend" | "fillParent" | "interactive";
  keyboardBlurBehavior?: "none" | "restore";

  // Animation
  animateOnMount?: boolean;
  animationConfigs?: any;

  // Callbacks
  onChange?: (index: number) => void;
  onAnimate?: (fromIndex: number, toIndex: number) => void;
}
