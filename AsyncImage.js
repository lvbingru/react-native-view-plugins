/**
 * Created by lvbingru on 12/13/15.
 */

import React, {Component, PropTypes, Image, PixelRatio} from 'react-native';


const propTypes = {
    source : Image.propTypes.source,
    width : PropTypes.number,
    height : PropTypes.number,
    showLoadingPlaceholder : PropTypes.bool,
    showFailedPlaceholder : PropTypes.bool,
    LoadingPlaceholder : PropTypes.object,
    FailedPlaceholder : PropTypes.object,
    onFetchImageUrl : PropTypes.func,
    fetchUrl : PropTypes.string,
}

const defaultProps = {
    showLoadingPlaceholder : false,
    showFailedPlaceholder : false
}

const cache = {};

let defaultLoadingPlaceholder = null;
let defaultFailedPlaceholder = null;
let defaultOnFetchImageUrl = null;

export default class AsyncImage extends Component {
    constructor(props) {
        super(props);

        this.initState();
    }

    componentWillReceiveProps(props){
        const {source} = this.props
        const uri = props.source.uri
        if (uri && source.uri != uri) {
            this.initState();
        }

        this.updateImage(props.source);
    }

    initState() {
        this.state = {
            inFetching : false,  // 正在获取图片realSource
            realSource : null,  // 真实的图片地址
            loadEnd : false,    // 图片加载完成
            loadSuccess : false, // 图片加载失败
        }
    }

    render() {
        const {inFetching, realSource, loadEnd, loadSuccess} = this.state;
        const {source, style, children, showLoadingPlaceholder, showFailedPlaceholder, LoadingPlaceholder, FailedPlaceholder, onFetchImageUrl,fetchUrl,  ...others} = this.props;

        let Loading = null;
        if (showLoadingPlaceholder && !loadEnd) {
            Loading = LoadingPlaceholder || defaultLoadingPlaceholder;
        }
        let Failed = null;
        if (showFailedPlaceholder && !loadSuccess) {
            Failed = FailedPlaceholder || defaultLoadingPlaceholder;
        }

        return (
            <Image
                {...others}
                style = {[style]}
                source={realSource}
                onLayout = {(e)=>{
                    if (!realSource) {
                        const layout = e.nativeEvent.layout
                        this.layout = layout

                        this.updateImage(source)
                    }
                    this.props.onLayout && this.props.onLayout();
                }}
                onLoad = {()=>{
                    if (realSource) {
                        this.setState({
                            loadSuccess : true
                        })
                    }
                    this.props.onLoad && this.props.onLoad();
                }}
                onLoadEnd = {()=>{
                    if (realSource) {
                        this.setState({
                            loadEnd : true
                        })
                    }
                    this.props.onLoadEnd && this.props.onLoadEnd();
                }}
            >
                {
                    Failed
                }
                {
                    children
                }
                {
                    Loading
                }
            </Image>
        );
    }

    updateImage(source) {

        if (!this.layout) {
            return;
        }

        if (!source) {
            this.setState({
                realSource : source,
                loadEnd : true,
            });
            return;
        }

        const uri = this.getRealUri(source.uri);
        if (uri) {
            this.setState({
                realSource : {uri},
            });
        }
        else {
            const success = this.fetchRealUri(source.uri);
            if (!success) {
                this.setState({
                    inFetching : false,
                    loadSuccess : false,
                    loadEnd : true,
                });
            }
        }
    }

    getRealUri(uri) {

        if (uri) {
            if (uri.indexOf(":/")>=0) {
                return uri;
            }
            else {
                const {width, height} = this.layout;
                const key = uri+"?"+width+"&"+height;
                if (cache[key]) {
                    return cache[key];
                }
            }
        }

        return null;
    }

    fetchRealUri(id) {
        if (!id) {
            return false;
        }

        if (!this.layout) {
            return true;
        }

        const {realSource, inFetching} = this.state
        if (realSource){
            return true;
        }

        if (inFetching) {
            return true;
        }

        const onFetchImageUrl = this.props.onFetchImageUrl || defaultOnFetchImageUrl;

        if (!onFetchImageUrl) {
            return false;
        }

        const {width, height} = this.layout;

        this.setState({
            inFetching : true,
        });

        onFetchImageUrl({
            id,
            fetchUrl : this.props.fetchUrl,
            width:Math.floor(width*PixelRatio.get() + 0.5),
            height:Math.floor(height*PixelRatio.get() + 0.5),
        }).then(r=>{
            const {url, deadline} = r;
            const key = id+"?"+width+"&"+height;
            cache[key] = url;
            if (deadline) {
                let left = deadline - new Date().valueOf();
                if (left <=0) {
                    left = 60*60*1000;
                }
                setTimeout(()=>{
                    if (__DEV__) {
                        console.log("图片地址"+id +"已经过期");
                    }
                    delete cache[key];
                }, left);
            }
            if (url && this.checkUri(id)) {
                this.setState({
                    inFetching: false,
                    loadSuccess : true,
                    realSource: {uri: url},
                });
            }
            else {
                throw new Error('url null');
            }
        },e=>{
            if (this.checkUri(id)) {
                this.setState({
                    inFetching : false,
                    loadSuccess : false,
                })
            }
        });

        return true;
    }

    checkUri(uri) {
        const curUri = this.props.source && this.props.source.uri;
        if (uri === curUri) {
            return true;
        }
        return false;
    }

    static setDefaultLoadingPlaceholder(component) {
        defaultLoadingPlaceholder = component;
    }

    static setDefaultOnFetchImageUrl(onFetch) {
        defaultOnFetchImageUrl = onFetch;
    }

    static setDefaultFailedPlaceholder(component) {
        defaultFailedPlaceholder = component;
    }
}

AsyncImage.propTypes = propTypes;
AsyncImage.defaultProps = defaultProps;
