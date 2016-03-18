/**
 * Created by lvbingru on 11/19/15.
 */

//import {styles} from './RootNavigator.style.js'

import React, {InteractionManager, Component, PropTypes, View, Text, Navigator, NavigatorIOS, Platform, BackAndroid} from 'react-native';

const propTypes = {};

const defaultProps = {};

export default class RootNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.backAndroidListener = ()=>{
            const nav = this.navigatorRef;
            const routers = nav.getCurrentRoutes();
            if (routers.length > 1) {
                nav.pop();
                return true;
            }
            else {
                return false;
            }
        }
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.backAndroidListener);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.backAndroidListener)
        }
    }

    render() {
        if (!RootNavigator._instance)
        {
            _instance = this;

            const {useNavigatorIOS, initialRoute, ...others} = this.props;
            const Nav = (Platform.OS === 'android'?Navigator:(useNavigatorIOS?NavigatorIOS:Navigator));
            const configure = (Platform.OS === 'android'?Navigator.SceneConfigs.FadeAndroid:Navigator.SceneConfigs.FloatFromRight);

            return (
                <Nav
                  {
                      ...others
                  }

                    ref = {ref=>this.navigatorRef = ref}
                    initialRoute = {(initialRoute instanceof PageContainer)?initialRoute:this.wrapPage(initialRoute)}
                    // navigatoriOS
                    navigationBarHidden = {true}
                    // navigator
                    renderScene = {(route, navigator) =>{
                         const Scene = route.component;
                         return (<Scene route = {route}/>)
                    }}
                    configureScene = {(route) => {
                        const configureScene = route && route.configureScene && route.configureScene();
                        if(configureScene) {
                            return configureScene;
                        }
                        return configure;
                    }}

                />
            )
        }
        else {
            console.error('only one RootNavigtor!!!');
            return null;
        }
    }

    static _instance = null;

    static getInstance() {
        return _instance;
    }

    wrapPage(page) {
        const {component, params, ...others} = page;
        const route = {
            title : '',
            ...others,
            component: PageContainer,
            contentComponent: component,
            passProps: {params},
        }
        return route;
    }

    push(page) {
        const route = this.wrapPage(page);
        this.navigatorRef.push(route);
    }

    pop() {
        const nav = this.navigatorRef;
        nav.pop();
    }

    popN(num) {
        const nav = this.navigatorRef;

        if (nav.popN) {
            nav.popN(num);
        }
        else if (nav.getCurrentRoutes) {
            const routes = nav.getCurrentRoutes()
            const popNum = Math.min(num, routes.length-1);
            if (popNum > 0) {
                nav.popToRoute(routes[routes.length-1-popNum]);
            }
        }
    }

    popToTop () {
        const nav = this.navigatorRef;
        if (nav.popToTop) {
            nav.popToTop()
        }
    }

    replace(page) {
        const nav = this.navigatorRef;
        const route = this.wrapPage(page);
        nav.replace(route);
    }
}

RootNavigator.propTypes = propTypes;
RootNavigator.defaultProps = defaultProps;

class PageContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            route : props.route,
        };
    }

    render() {
        const {route} = this.state;
        const {title, passProps, contentComponent} = route;
        let params = this.props.params;
        if (!params) {
            params = (passProps && passProps.params) || {};
        }

        //if(__DEV__) {
        //    console.log('params', params);
        //}

        const Scene = route.contentComponent;

        return(
            <View
                style={{flex : 1, backgroundColor:'white'}}
            >
                <Scene
                    ref = {ref => { this.scene = ref } }
                  {
                    ...params
                  }
                    navigator = {RootNavigator.getInstance()}
                />
            </View>
        )
    }
}