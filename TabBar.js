/**
 * Created by lvbingru on 11/9/15.
 */
'use strict';

var React = require('react-native');
var {
    Component,
    StyleSheet,
    View,
    TouchableOpacity,
    PropTypes,
    } = React;

class TabBar extends Component {
    constructor(props){
        super(props);
        this.state = {};
        this.children = {};
        this.selected = null;
    }

    onSelect(el){
        this.setState(this.children);
        var func = el.props.onSelect || this.props.onSelect;
        var props = {selected:true};
        if (func){
            props = Object.assign(props, func(el) || {});
        }
        props = Object.assign(props, el.props);
        var map={};
        map[el.props.tabIndex] = props;
        map[el.props.tabIndex].key = el.props.tabIndex;
        this.setState(map);
    }

    _updateState(props){
        var selected = null;

        props.children.forEach((el)=> {
            if (!selected && !props.noFirstSelect){
                selected = el;
            }
            this.children[el.props.tabIndex] = Object.assign({}, el.props);
            this.children[el.props.tabIndex].key = el.props.tabIndex
            if (props.selected == el.props.tabIndex) {
                selected = el;
            }
        });
        this.setState(this.children);
        if (!this.selected && selected) {
            this.onSelect(selected);
        }
        this.selected = selected;
    }

    componentWillReceiveProps(props){
        this._updateState(props);
    }

    componentWillMount() {
        //this._updateState(this.props);
    }

    componentDidMount(){
        this._updateState(this.props);
    }
    render(){
        var self = this;
        return (
            <View style={[styles.tabbarView, this.props.style]}>
                {this.props.children.map((el,index)=>
                        <TouchableOpacity
                            key={index}
                            style={[styles.iconView]}
                            onPress={()=>self.onSelect(el)}
                        >
                            {React.cloneElement(el, self.state[el.props.tabIndex])}
                        </TouchableOpacity>
                )}
            </View>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    tabbarView: {
        position:'absolute',
        bottom:0,
        right:0,
        left:0,
        height:50,
        opacity:1,
        backgroundColor:'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        borderTopWidth : 1,
        borderTopColor : 'c7c9ca',
    },
    iconView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentView: {
        flex: 1
    }
});

module.exports = TabBar;
