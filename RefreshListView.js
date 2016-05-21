/**
 * Created by lvbingru on 2/29/16.
 */

import React, { PropTypes, Component } from 'react';
import { ListView, RefreshControl } from 'react-native';

const propTypes = {
  isRefreshing : PropTypes.bool,
  onRefresh : PropTypes.func,
  onLoadMore : PropTypes.func,
}

const defaultProps = {

}

export default class RefreshListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {isRefreshing, onRefresh, onLoadMore, ...others} = this.props
    return (
      <ListView
        scrollsToTop = {true}
        removeClippedSubviews = {true}
        automaticallyAdjustContentInsets = {false}
        onEndReachedThreshold = {4000}
        onEndReached = {()=>{
          onLoadMore && onLoadMore()
        }}
        pageSize = {10}
        {
          ...others
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
      />
    );
  }
}

RefreshListView.propTypes = propTypes;
RefreshListView.defaultProps = defaultProps;
