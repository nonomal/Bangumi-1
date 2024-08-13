/*
 * @Author: czy0729
 * @Date: 2019-05-25 22:57:29
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-08-13 16:13:57
 */
import React, { useCallback, useMemo } from 'react'
import { Animated, View } from 'react-native'
import { Heatmap, ListView } from '@components'
import { _ } from '@stores'
import { getKeyString, keyExtractor } from '@utils'
import { memo } from '@utils/decorators'
import { useMount } from '@utils/hooks'
import { USE_NATIVE_DRIVER } from '@constants'
import FixedToolBar from '../../component/fixed-tool-bar'
import Item from '../../component/item'
import Pagination from '../../component/pagination'
import { COMPONENT_MAIN, DEFAULT_PROPS } from './ds'

const List = memo(
  ({
    styles,
    forwardRef,
    scrollY,
    page,
    list,
    userPagination,
    userGridNum,
    userCollections,
    onScroll,
    onRefreshOffset,
    onHeaderRefresh,
    onFooterRefresh
  }) => {
    const { page: pageCurrent, pageTotal } = userCollections.pagination
    const ListHeaderComponent = useMemo(
      () => (
        <>
          <View style={styles.header} />
          <FixedToolBar
            page={page}
            pageCurrent={pageCurrent}
            pageTotal={pageTotal}
            onRefreshOffset={onRefreshOffset}
          />
        </>
      ),
      [onRefreshOffset, page, pageCurrent, pageTotal, styles]
    )
    const _onScroll = useMemo(
      () =>
        Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY
                }
              }
            }
          ],
          {
            useNativeDriver: USE_NATIVE_DRIVER,
            listener: onScroll
          }
        ),
      [onScroll, scrollY]
    )

    const _forwardRef = useCallback(
      (ref: { scrollToIndex: any; scrollToOffset: any }) => {
        forwardRef(ref, page)
      },
      [forwardRef, page]
    )

    const numColumns = list ? undefined : userGridNum
    const renderItem = useCallback(
      ({ item, index }) => {
        return (
          <>
            <Item item={item} index={index} page={page} />
            {index === 0 && <Heatmap id='我的.跳转' to='Subject' alias='条目' />}
          </>
        )
      },
      [page]
    )

    useMount(() => {
      requestAnimationFrame(() => {
        onRefreshOffset(page)
      })
    })

    const passProps: any = {}
    if (userPagination) {
      passProps.ListFooterComponent = <Pagination />
    } else {
      passProps.onHeaderRefresh = onHeaderRefresh
      passProps.onFooterRefresh = onFooterRefresh
    }

    return (
      <ListView
        key={getKeyString(list, numColumns)}
        ref={_forwardRef}
        keyExtractor={keyExtractor}
        style={styles.listView}
        contentContainerStyle={list ? styles.list : styles.grid}
        animated
        data={userCollections}
        numColumns={numColumns}
        progressViewOffset={_.parallaxImageHeight + 32}
        lazy={12}
        keyboardDismissMode='on-drag'
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        scrollEventThrottle={16}
        onScroll={_onScroll}
        {...passProps}
      />
    )
  },
  DEFAULT_PROPS,
  COMPONENT_MAIN
)

export default List
