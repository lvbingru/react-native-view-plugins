/**
 * Created by lvbingru on 12/27/15.
 */

import React, {InteractionManager, Component, PropTypes, View, Text, StyleSheet, TextInput, Platform, Image, TouchableOpacity} from 'react-native';

const propTypes = {
}

const defaultProps = {}

export default class TextInputWithClearButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        if (Platform.OS === 'ios') {
            return (
                <TextInput
                    {
                        ...this.props
                    }
                    clearButtonMode = {'while-editing'}
                    autoCorrect = {false}
                    ref = {ref=>{this.textInput = ref}}
                />
            );
        }
        else {
            return (
                <View style = {{flex:1, flexDirection:'row', alignItems:'stretch'}}>
                    <TextInput
                        {
                            ...this.props
                        }
                        autoCorrect = {false}
                        ref={ref=>this.textInput = ref}
                    />
                    <TouchableOpacity
                        style = {{alignItems:'center', justifyContent:'center', backgroundColor:'white', width: 40, height:60}}
                        activeOpacity = {1.0}
                        onPress = {()=>{
                            this.textInput.clear()
                        }}
                    >
                        <Image
                            style = {{ resizeMode:'contain', width: 20, height:20,}}
                            source = {require('../image/icon-clear.png')}
                        />
                    </TouchableOpacity>
                </View>
            );
        }
    }

    blur() {
        this.textInput.blur && this.textInput.blur()
    }

    focus() {
        this.textInput.focus &&this.textInput.focus()
    }

    setNativeProps(props) {
        this.textInput.setNativeProps(props)
    }
}

TextInputWithClearButton.propTypes = propTypes;
TextInputWithClearButton.defaultProps = defaultProps;
