import React, {PureComponent} from 'react';
import {View, Image, StyleSheet, Dimensions, Animated, Easing} from 'react-native';
import PropTypes from 'prop-types';

class BouncingBalls extends PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    random: PropTypes.bool,
    animationDuration: PropTypes.number.isRequired,
    animationType: PropTypes.func,
    minSpeed: PropTypes.number.isRequired,
    maxSpeed: PropTypes.number.isRequired,
    minSize: PropTypes.number.isRequired,
    maxSize: PropTypes.number.isRequired,
    imageBall: PropTypes.node,
  };

  static defaultProps = {
    amount: 1,
    x: 100,
    y: 100,
    random: true,
    animationDuration: 5000,
    minSpeed: 30,
    maxSpeed: 200,
    minSize: 40,
    maxSize: 100,
    animationType: Easing.linear,
  };

  constructor(props) {
    super(props);

    this.screenWidth = Dimensions.get('window').width;
    this.screenHeight = Dimensions.get('window').height;
    this.circles = this.generateCircles();

    this.state = {
      position: new Animated.ValueXY({x: this.props.x, y: this.props.y}),
    };
  }

  componentDidMount() {
    this.traverseCircles();
  }

  componentWillUnmount() {
    this.circles.forEach((item, index) => {
      this.state[`position${index}`].stopAnimation();
    });
  }

  traverseCircles() {
    this.circles.forEach((circle, index) => {
      this.setState({
        [`position${index}`]: new Animated.ValueXY({x: circle.props.x, y: circle.props.y}),
      }, () => {
        const _circle = this.updateCirclePosition(circle.props, index);
        this.circleStartAnimation(_circle, index);
      });
    });
  }

  circleStartAnimation(circle, index) {
    const {animationDuration, animationType} = this.props;
    Animated.timing(
      this.state[`position${index}`],
      {
        toValue: {x: circle.x, y: circle.y},
        duration: animationDuration,
        easing: animationType,
      },
    ).start(() => {
      const currentPosition = this.state[`position${index}`];
      currentPosition.stopAnimation(() => {
        currentPosition.setValue({x: circle.x, y: circle.y});
        let _circle = this.updateCirclePosition(circle, index);
        requestAnimationFrame(() => this.circleStartAnimation(_circle, index));
      });
    });
  }

  updateCirclePosition(circle) {
    const _circle = Object.assign({}, circle);
    const height = width = circle.style[1].width;
    const maxWidth = this.screenWidth - width + 300;
    const maxHeight = this.screenHeight - height + 300;


    _circle.x = _circle.x + _circle.speedX;
    _circle.y = _circle.y + _circle.speedY;

    if (this.props.random) {

      if (_circle.x <= -300) {
        _circle.x = -300;
        _circle.speedX *= (-1);
      } else if (_circle.x >= maxWidth) {
        _circle.x = maxWidth;
        _circle.speedX *= (-1);
      }

      if (_circle.y <= -300) {
        _circle.y = -300;
        _circle.speedY *= (-1);
      } else if (_circle.y >= maxHeight) {
        _circle.y = maxHeight;
        _circle.speedY *= (-1);
      }

    } else {

      if (_circle.x <= this.props.x -20) {
        _circle.x = this.props.x - 20;
        _circle.speedX *= (-1);
      } else if (_circle.x >= this.props.x + 20) {
        _circle.x = this.props.x + 20;
        _circle.speedX *= (-1);
      }

      if (_circle.y <= this.props.y -20) {
        _circle.y = this.props.y -20;
        _circle.speedY *= (-1);
      } else if (_circle.y >= this.props.y +20) {
        _circle.y = this.props.y +20;
        _circle.speedY *= (-1);
      }

    }



    return _circle;
  }

  getRangeFromMinToMax(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  generateCircles() {
    const {amount, minSpeed, maxSpeed, minSize, maxSize, imageBall, style, ...restProps} = this.props;
    const circles = [];
    let width, height, borderRadius, innerStyle, restStyles, item, direction;

    if (amount < 1) return null;

    for (var i = 0; i < amount; i++) {
      height = width = this.getRangeFromMinToMax(minSize, maxSize);
      borderRadius = height * 0.5;
      direction = Math.round(Math.random()) === 0 ? -1 : 1;

      innerStyle = {
        height,
        width,
        borderRadius,
      };

      if (this.props.random) {
        restStyles = {
          x: this.getRangeFromMinToMax(0, this.screenWidth - width + 300),
          y: this.getRangeFromMinToMax(0, this.screenHeight - height + 300),
          speedX: direction * this.getRangeFromMinToMax(minSpeed, maxSpeed),
          speedY: direction * this.getRangeFromMinToMax(minSpeed, maxSpeed),
        };
      } else {
        restStyles = {
          x: this.props.x,
          y: this.props.y,
          speedX: direction * this.getRangeFromMinToMax(minSpeed, maxSpeed),
          speedY: direction * this.getRangeFromMinToMax(minSpeed, maxSpeed),
        };

      }

      item = imageBall ?
        <Image
          source={imageBall}
          style={[styles.circle, {...innerStyle}, {...style}]} {...restStyles} {...restProps}
        /> : <View
          style={[styles.circle, {...innerStyle}, {...style}]} {...restStyles} {...restProps}
        />;

      circles.push(item);
    }

    return circles;
  }

  render() {
    return <View style={styles.container}>
      {
        this.circles.map(((item, index) => {
          return (
            <Animated.View key={index}
                           style={[this.state[`position${index}`] && this.state[`position${index}`].getLayout()]}
            >
              {item}
            </Animated.View>
          );
        }))
      }
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
  },
  circlePosition: {
    position: 'absolute',
  },
});

export default BouncingBalls;
