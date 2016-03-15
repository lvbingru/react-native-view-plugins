/**
 * Created by lvbingru on 12/16/15.
 */

import React, {InteractionManager, Component, PropTypes, View, Text, ScrollView, Platform, Animated, UIManager, NativeModules} from 'react-native';
import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState';
import package from 'react-native/package.json';
//import semver from 'semver';

const propTypes = {
}

const defaultProps = {
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
        const {children, ...others} = this.props
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
                            this.scrollViewRef.scrollResponderScrollNativeHandleToKeyboard(currentlyFocusedTextInput,160,true);
                            this.moved = true;
                        }
                   })
               }
            }}
            onKeyboardWillHide = {e=> {
                if (this.moved) {
                    this.moved = false;
                    this.scrollViewRef.scrollTo({x:0, y:this.offsetY});
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
