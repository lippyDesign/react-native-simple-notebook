import React from 'react';
import { View, Text, AppRegistry, StyleSheet, TouchableHighlight } from 'react-native';
var formatTime = require('minutes-seconds-milliseconds');

var StopWatch = React.createClass({
  getInitialState: function() {
    return {
      timeElapsed: null,
      running: false,
      startTime: null,
      laps : []
    }
  },
  render: function() {
    return <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timerWrapper}>
          <Text style={styles.timer}>
            {formatTime(this.state.timeElapsed)}
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          {this.startStopButton()}
          {this.lapButton()}
        </View>
      </View>
      <View style={styles.footer}>
            {this.laps()}
      </View>
      
    </View>
  },
  laps: function() {
    return this.state.laps.map(function(time, index) {
      return <View key={index + 1} style={styles.lap}>
        <Text style={styles.lapText}>
          Lap #{index + 1}
        </Text>
        <Text style={styles.lapText}>
          {formatTime(time)}
        </Text>
      </View>
    })
  },
  startStopButton: function() {

    var style = this.state.running ? styles.stopButton : styles.startButton

    return <TouchableHighlight
      underlayColor="gray"
      onPress={this.handleStartPress}
      style={[styles.button, style]}
    >
        <Text>
          {this.state.running ? 'Stop' : 'Start'}
        </Text>
      </TouchableHighlight>
  },
  lapButton: function() {
    return <TouchableHighlight
      style={styles.button}
      underlayColor="gray"
      onPress={this.handleLapPress}
    >
        <Text>
          Lap
        </Text>
      </TouchableHighlight>
  },
  handleLapPress: function() {
    var lap = this.state.timeElapsed;
    this.setState({
      startTime: new Date(),
      laps: this.state.laps.concat([lap])
    });
  },
  handleStartPress: function() {
    if (this.state.running === true) {
      this.setState({running: false});
      clearInterval(this.interval);
      return
    }
    
    this.setState({startTime: new Date()});

    this.interval = setInterval(() => {
      this.setState({
        running: true,
        timeElapsed: new Date() - this.state.startTime
      });
    }, 30);
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  header: {
    flex: 1
  },
  footer: {
    flex: 1
  },
  timerWrapper: {
    flex: 5, // takes up 5/8 of the available space
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
    flex: 3, // takes up 3/8 of the available space
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
},
timer: {
  fontSize: 60
},
button: {
  borderWidth: 2,
  height: 100,
  width: 100,
  borderRadius: 50,
  justifyContent: 'center', // to center text inside the buttons
  alignItems: 'center' // to center text inside the buttons
},
startButton: {
  borderColor: 'green'
},
stopButton: {
  borderColor: '#CC0000'
},
lap: {
  justifyContent: 'space-around',
  flexDirection: 'row'
},
lapText: {
  fontSize: 30
}

});

AppRegistry.registerComponent('stopwatch', () => StopWatch);