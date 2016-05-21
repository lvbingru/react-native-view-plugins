/**
 * Created by lvbingru on 3/2/16.
 */

import React, { Component, PropTypes, } from 'react';
import { InteractionManager, View, Text } from 'react-native';

const propTypes = {
  onSingleTap : PropTypes.func,
  onDoubleTap : PropTypes.func,
  onLongPress : PropTypes.func,
};

const defaultProps = {};

export default class TouchView extends Component {
  constructor(props) {
    super(props);

    this.createTapResponder(props);
  }

  componentWillReceiveProps(props){
    this.createTapResponder(props);
  }

  render() {

    return (
      <View
        {
          ...this.tapResponder
        }
        {
          ...this.props
        }
      >
      </View>
    );
  }

  createTapResponder(props) {
    const {onSingleTap, onDoubleTap, onLongPress} = props;

    const release = (evt, clearDouble=true)=>{
      if (this.singleTapTimer) {
        clearTimeout(this.singleTapTimer);
        this.singleTapTimer = null;
      }
      if (clearDouble) {
        if (this.doubleTapTimer) {
          clearTimeout(this.doubleTapTimer);
          this.doubleTapTimer = null;
        }
      }
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
    }

    this.tapResponder = {
      onStartShouldSetResponder : evt => true,

      onResponderGrant : evt => {
        this.touchLocation = {x:evt.nativeEvent.locationX, y:evt.nativeEvent.locationY}

        if (onSingleTap || onDoubleTap) {
          this.tapTimeOut = false
          this.singleTapTimer = setTimeout(()=>{
            this.tapTimeOut = true
            this.singleTapTimer = null
          }, 100)
        }

        if (onLongPress) {
          this.longPressTimer = setTimeout(()=>{
            onLongPress(this.touchLocation)
            this.longPressTimer = null;
          }, 1000);
        }
      },
      onResponderRelease : evt => {
        if (!this.tapTimeOut) {
          if (Math.abs(evt.nativeEvent.locationX-this.touchLocation.x)<10 && Math.abs(evt.nativeEvent.locationY-this.touchLocation.y)<10) {
            if (onDoubleTap) {
              if (this.doubleTapTimer == null) {
                this.doubleTapTimer = setTimeout(()=>{
                  this.doubleTapTimer = null;
                  if (onSingleTap && !this.tapTimeOut) {
                    onSingleTap(this.touchLocation);
                  }
                }, 300);
                release(evt, false);
                return
              }
              else {
                clearTimeout(this.doubleTapTimer);
                this.doubleTapTimer = null;
                onDoubleTap(this.touchLocation);
              }
            }
            else if(onSingleTap) {
              onSingleTap(this.touchLocation);
            }
          }
        }
        release(evt)
      },
      onResponderTerminate : release,
      onResponderTerminationRequest : evt=> true,
    }
  }
}

TouchView.propTypes = propTypes;
TouchView.defaultProps = defaultProps;
