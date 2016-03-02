/**
 * Created by lvbingru on 11/14/15.
 */

import React, {Component, PropTypes, View, Text, TouchableOpacity, Image} from 'react-native';


const propTypes = {
    text : PropTypes.string,
    icon : PropTypes.oneOfType([
        PropTypes.shape({
            uri: PropTypes.string,
        }),
        // Opaque type returned by require('./image.jpg')
        PropTypes.number,
    ]),
    textStyle: Text.propTypes.style,
    iconStyle: Image.propTypes.style,
}

const defaultProps = {}

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const {
            text,
            icon,
            textStyle,
            iconStyle,
            ...others,
            } = this.props;

        return (
            <TouchableOpacity {...others}>
                {
                    icon &&
                    <Image
                        source={icon}
                        style={iconStyle}
                    />
                }
                {
                    text &&
                    <Text style={[textStyle]}>{text}</Text>
                }
                {this.props.children}
            </TouchableOpacity>
        );
    }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
