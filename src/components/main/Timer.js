import React from 'react';
import { StyleSheet, View, Text, AppState } from 'react-native';
import _ from 'lodash';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.timer = setInterval(this.updateTimer, 30000);
  }

  updateTimer = () => {
    this.props.onFinish();
  };

  render() {
    return null;
  }
}

Timer.defaultProps = {
  value: 0,
  running: true,
  onFinish: () => {},
};

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: 'row',
    ///backgroundColor:"red",
    paddingHorizontal: 5,
    marginTop: 1,
  },
});

export default Timer;
