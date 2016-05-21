/**
 * Created by lvbingru on 11/12/15.
 */

import React, { Component, PropTypes, } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';

const propTypes = {
    title: PropTypes.string,
    titleSize: PropTypes.number,
    titleColor: PropTypes.string,

    leftIcon: PropTypes.oneOfType([
        PropTypes.shape({
            uri: PropTypes.string,
        }),
        // Opaque type returned by require('./image.jpg')
        PropTypes.number,
    ]),
    rightIcon: PropTypes.oneOfType([
        PropTypes.shape({
            uri: PropTypes.string,
        }),
        // Opaque type returned by require('./image.jpg')
        PropTypes.number,
    ]),
    leftTitle: PropTypes.string,
    rightTitle: PropTypes.string,

    // custom items
    titleItem: PropTypes.object,
    leftItem: PropTypes.object,
    rightItem: PropTypes.object,

    titleStyle: Text.propTypes.style,
    leftStyle: View.propTypes.style,
    rightStyle: View.propTypes.style,

    onRightPress : PropTypes.func,
    onLeftPress : PropTypes.func,
}

export default class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(props){
    }

    componentWillMount() {
    }

    componentDidMount(){
    }

    render(){

        let self = this;

        let leftItem = this.props.leftItem;
        let rightItem = this.props.rightItem;
        let titleItem = this.props.titleItem;


        if(titleItem == null) {
            titleItem = (<Text style = {[styles.txtTitle, this.props.titleStyle]}>{self.props.title}</Text>);
        }

        if(leftItem == null) {
            if(this.props.leftIcon == null) {
                leftItem = (<Text style = {[styles.txtItem, this.props.leftStyle]}>{self.props.leftTitle}</Text>)
            }
            else {
                leftItem = (<Image style = {[styles.imageItem, this.props.leftStyle]} source={self.props.leftIcon} />)
            }
        }



        if(rightItem == null) {
            if(this.props.rightIcon == null) {
                rightItem = (<Text style = {[styles.txtItem, this.props.rightStyle]}>{self.props.rightTitle}</Text>)
            }
            else {
                rightItem = (<Image style = {[styles.imageItem, this.props.rightStyle]} source={self.props.rightIcon} />)
            }
        }

        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableOpacity style = {[styles.left]} onPress={()=>{this.props.onLeftPress && this.props.onLeftPress()}}>
                    {leftItem}
                </TouchableOpacity>
                <View style = {[styles.middle]}>
                    {titleItem}
                </View>
                <TouchableOpacity style = {[styles.right]} onPress={()=>{this.props.onRightPress && this.props.onRightPress()}}>
                    {rightItem}
                </TouchableOpacity>
            </View>
        );
    }
}

NavBar.propTypes = propTypes

var styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems : 'stretch',
        backgroundColor: '#f66f40',
        height: Platform.OS === 'android'?44:64,
        paddingTop: Platform.OS === 'android'?0:20,
    },

    left: {
        width: 60,
        justifyContent : 'center',
        alignItems : 'center',
    },

    right: {
        width: 60,
        justifyContent : 'center',
        alignItems : 'center',
    },

    middle : {
        flex : 1,
        justifyContent : 'center',
    },

    txtTitle: {
        fontSize: 17,
        color: 'white',
        textAlign: 'center',
    },

    txtItem: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },

    imageItem: {
        resizeMode: 'contain',
    },
});

module.exports = NavBar;
