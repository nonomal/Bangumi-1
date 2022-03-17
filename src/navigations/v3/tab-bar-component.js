/*
 * @Author: czy0729
 * @Date: 2020-06-04 15:30:16
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-12-24 07:02:30
 */
import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react'
import BottomTabBar from '@components/@/react-navigation-tabs/BottomTabBar'
import { BlurView } from '@_'
import { IOS } from '@constants'
import { _ } from '@stores'

function TabBarComponent(props) {
  const styles = memoStyles()
  if (IOS) {
    return (
      <BlurView style={styles.blurView}>
        <BottomTabBar {...props} style={styles.tabBarComponent} />
      </BlurView>
    )
  }

  return (
    <View style={styles.tarBarView}>
      <BottomTabBar {...props} style={styles.tabBarComponent} />
    </View>
  )
}

export default observer(TabBarComponent)

const memoStyles = _.memoStyles(() => ({
  blurView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0
  },
  tarBarView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: IOS
      ? _.select(_.colorPlain, _._colorDarkModeLevel1)
      : _.select('transparent', _.deepDark ? _._colorPlain : _._colorDarkModeLevel1),
    borderTopWidth: IOS ? 0 : _.select(_.hairlineWidth, 0),
    borderTopColor: _.colorBorder
  },
  tabBarComponent: {
    borderTopWidth: 0,
    backgroundColor: 'transparent'
  }
}))
