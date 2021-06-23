import React from 'react';

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

export default Timer;
