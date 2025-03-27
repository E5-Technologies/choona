import React from 'react';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import ReactionButton from '../Button/Button';

export const ReactionButtonThumbsUp = ({ active, onClick, ...props }) => {
  return (
    <ReactionButton
      active={active}
      icon={ImagePath.reactThumbsUp}
      backgroundColourBefore="#1B1B1B"
      backgroundColourAfter="red"
      iconTintAfter="white"
      onClick={onClick}
      gradientProps={{
        colors: ['#45A0F4', '#1473CA'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }}
      {...props}
    />
  );
};

export const ReactionButtonFire = ({ active, onClick, ...props }) => {
  return (
    <ReactionButton
      active={active}
      icon={ImagePath.reactFire}
      backgroundColourBefore="#1B1B1B"
      backgroundColourAfter="red"
      iconTintAfter="white"
      onClick={onClick}
      gradientProps={{
        colors: ['#F1A441', '#EB4C2A'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }}
      {...props}
    />
  );
};

export const ReactionButtonHeart = ({ active, onClick, ...props }) => {
  return (
    <ReactionButton
      active={active}
      icon={ImagePath.reactHeart}
      backgroundColourBefore="#1B1B1B"
      backgroundColourAfter="red"
      iconTintAfter="white"
      onClick={onClick}
      gradientProps={{
        colors: ['#F55568', '#CA2194'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }}
      {...props}
    />
  );
};

export const ReactionButtonDisco = ({ active, onClick, ...props }) => {
  return (
    <ReactionButton
      active={active}
      icon={ImagePath.reactDisco}
      backgroundColourBefore="#1B1B1B"
      backgroundColourAfter="red"
      iconTintAfter="white"
      onClick={onClick}
      gradientProps={{
        colors: ['#4219D7', '#813ADA'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }}
      {...props}
    />
  );
};

export const ReactionButtonThrowback = ({ active, onClick, ...props }) => {
  return (
    <ReactionButton
      active={active}
      icon={ImagePath.reactThrowback}
      backgroundColourBefore="#1B1B1B"
      backgroundColourAfter="red"
      iconTintAfter="black"
      onClick={onClick}
      gradientProps={{
        colors: ['#EBF3D0', '#D598E1', '#FCDEC2'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }}
      {...props}
    />
  );
};

export const ReactionButtonThumbsDown = ({ active, onClick, ...props }) => {
  return (
    <ReactionButton
      active={active}
      icon={ImagePath.reactThumbsDown}
      backgroundColourBefore="#1B1B1B"
      backgroundColourAfter="red"
      iconTintAfter="white"
      onClick={onClick}
      gradientProps={{
        colors: ['#E24F4F', '#C93636'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }}
      {...props}
    />
  );
};
