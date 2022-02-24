import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Button.style';

const ReactionButton = ({
  style: containerStyle,
  icon,
  iconTintAfter,
  backgroundColourAfter,
  backgroundColourBefore,
  onClick,
  active: _active,
  gradientProps,
}) => {
  const [active, setActive] = useState(_active);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
    }).start();
  };

  useEffect(() => {
    setActive(_active);
  }, [_active]);

  useEffect(() => {
    if (active) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [active]);

  return (
    <Pressable
      hitSlop={20}
      onPress={() => {
        const resp = onClick();
        if (resp) {
          setActive(!active);
        }
      }}
      style={[styles.pressable, containerStyle]}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            // Bind opacity to animated value
            opacity: fadeAnim,
          },
        ]}>
        <LinearGradient style={styles.backgroundGradient} {...gradientProps} />
      </Animated.View>

      {icon && (
        <Image
          source={icon}
          style={[styles.icon, active && { tintColor: iconTintAfter }]}
        />
      )}
    </Pressable>
  );
};

export default ReactionButton;
