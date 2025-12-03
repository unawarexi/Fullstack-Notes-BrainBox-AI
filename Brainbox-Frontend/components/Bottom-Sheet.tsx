import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Platform } from "react-native";

const CustomBottomSheet = forwardRef<BottomSheet, CustomBottomSheetProps>((props, ref) => {
  const {
    isVisible,
    onClose,
    enableSnapping = true,
    snapPoints = Platform.OS === "ios" ? ["50%"] : ["55%"],
    initialSnapIndex = 0,
    enablePanDownToClose = true,
    enableOverDrag = true,
    enableHandlePanningGesture = true,
    enableContentPanningGesture = true,
    enableBackdrop = true,
    backdropOpacity = 0.5,
    backdropAppearanceOnIndex = 0,
    backdropDisappearOnIndex = -1,
    backgroundStyle,
    handleStyle,
    handleIndicatorStyle,
    children,
    scrollable = false,
    keyboardBehavior = "interactive",
    keyboardBlurBehavior = "restore",
    animateOnMount = true,
    animationConfigs,
    onChange,
    onAnimate,
  } = props;

  // Memoized snap points
  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  // Backdrop component
  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => <BottomSheetBackdrop {...backdropProps} opacity={backdropOpacity} appearsOnIndex={backdropAppearanceOnIndex} disappearsOnIndex={backdropDisappearOnIndex} onPress={onClose} />,
    [backdropOpacity, backdropAppearanceOnIndex, backdropDisappearOnIndex, onClose]
  );

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
      onChange?.(index);
    },
    [onChange, onClose]
  );

  if (!isVisible) return null;

  return (
    <BottomSheet
      ref={ref}
      snapPoints={enableSnapping ? memoizedSnapPoints : undefined}
      index={enableSnapping ? initialSnapIndex : -1}
      enablePanDownToClose={enablePanDownToClose}
      enableOverDrag={enableOverDrag}
      enableHandlePanningGesture={enableHandlePanningGesture}
      enableContentPanningGesture={enableContentPanningGesture}
      backdropComponent={enableBackdrop ? renderBackdrop : undefined}
      backgroundStyle={backgroundStyle}
      handleStyle={handleStyle}
      handleIndicatorStyle={handleIndicatorStyle}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior={keyboardBlurBehavior}
      animateOnMount={animateOnMount}
      animationConfigs={animationConfigs}
      onChange={handleSheetChanges}
      onAnimate={onAnimate}
    >
      {scrollable ? <BottomSheetScrollView>{children}</BottomSheetScrollView> : <BottomSheetView>{children}</BottomSheetView>}
    </BottomSheet>
  );
});

CustomBottomSheet.displayName = "CustomBottomSheet";

export default CustomBottomSheet;