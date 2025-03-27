import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Button.style';

const ReactionButton = React.memo(
  ({
    style: containerStyle,
    icon,
    iconTintAfter,
    backgroundColourAfter,
    backgroundColourBefore,
    onClick,
    pending,
    active: _active,
    gradientProps,
    relatedId,
  }) => {
    const [active, setActive] = useState(_active);

    const fadeAnim = useRef(new Animated.Value(_active ? 1 : 0)).current;

    const fadeIn = () => {
      // Will change fadeAnim value to 1 in 5 seconds
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true, // <-- Add this
      }).start();
    };

    const fadeOut = () => {
      // Will change fadeAnim value to 0 in 3 seconds
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true, // <-- Add this
      }).start();
    };

    useEffect(() => {
      if (!pending) {
        setActive(_active);
      }
    }, [_active, pending]);

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
          if (active) {
            // fadeOut();
            setActive(false);
          } else {
            // fadeIn();
            setActive(true);
          }
          if(typeof onClick !== "onClick" && typeof onClick === "function"){
            onClick();
          }
        }}
        style={({ pressed }) => [
          styles.pressable,
          containerStyle,
          { opacity: pressed ? 0.5 : 1 },
        ]}>
        <Animated.View
          style={[
            styles.fadingContainer,
            {
              // Bind opacity to animated value
              opacity: fadeAnim,
            },
          ]}>
          <LinearGradient
            style={styles.backgroundGradient}
            {...gradientProps}
          />
        </Animated.View>

        {icon && (
          <Image
            source={icon}
            style={[styles.icon, active && { tintColor: iconTintAfter }]}
          />
        )}
      </Pressable>
    );
  },
);

export default ReactionButton;
