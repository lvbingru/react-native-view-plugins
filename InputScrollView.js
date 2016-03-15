/**
 * Created by lvbingru on 12/16/15.
 */

import React, {InteractionManager, Component, PropTypes, View, Text, ScrollView, Platform, Animated, UIManager, NativeModules} from 'react-native';
import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState';
import packageData from 'react-native/package.json';
import semver from 'semver';

const propTypes = {
    distance : PropTypes.number,
}

const defaultProps = {
    distance : 160,
}

export default class InputScrollView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keyboardHeightAnim: new Animated.Value(0)
        };

        this.offsetY = 0;
        this.moved = false;
    }

    render() {
        const {distance, children, ...others} = this.props
        return (
          <ScrollView
            style = {{flex:1}}
            contentContainerStyle = {[{alignItems : 'stretch',}]}
            ref={(srcollView) => {
                   this.scrollViewRef = srcollView;
            }}
            onKeyboardWillShow = {e => {
               const currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
               if (currentlyFocusedTextInput != null && NativeModules.BBViewPlugins) {
                   NativeModules.BBViewPlugins.isSubview(currentlyFocusedTextInput, this.scrollViewRef.getInnerViewNode(), r=>{
                        if (r===true) {
                            this.scrollViewRef.scrollResponderScrollNativeHandleToKeyboard(currentlyFocusedTextInput,distance,true);
                            this.moved = true;
                        }
                   })
               }
            }}
            onKeyboardWillHide = {e=> {
                if (this.moved) {
                    this.moved = false;
                    if (semver.gte(packageData.version, '0.20.0')) {
                       this.scrollViewRef.scrollTo({x:0, y:this.offsetY});
                    }
                    else {
                       this.scrollViewRef.scrollTo(this.offsetY, 0);
                    }
                }
            }}
            onMomentumScrollEnd = {e=>{
                if (!this.moved) {
                    this.offsetY = e.nativeEvent.contentOffset.y
                }
            }}
            {...others}
          >
              {children}
          </ScrollView>
        );
    }
}

InputScrollView.propTypes = propTypes;
InputScrollView.defaultProps = defaultProps;
