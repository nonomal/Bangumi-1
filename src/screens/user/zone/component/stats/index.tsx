/*
 * @Author: czy0729
 * @Date: 2022-12-26 04:29:54
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-08-13 16:13:32
 */
import React from 'react'
import { Animated, View } from 'react-native'
import { Flex, Text, Touchable } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { SCROLL_VIEW_RESET_PROPS, STORYBOOK, USE_NATIVE_DRIVER } from '@constants'
import { TABS } from '../../ds'
import { Ctx } from '../../types'
import Chart from './chart'
import Counts from './counts'
import { COMPONENT } from './ds'
import { memoStyles } from './styles'

function Stats(props, { $, navigation }: Ctx) {
  const styles = memoStyles()
  const { onScroll } = props
  return (
    <Animated.ScrollView
      ref={ref => {
        const index = TABS.findIndex(item => item.title === '统计')
        return $.connectRef(ref, index)
      }}
      contentContainerStyle={styles.contentContainerStyle}
      {...props}
      {...SCROLL_VIEW_RESET_PROPS}
      onScroll={
        STORYBOOK
          ? undefined
          : Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: $.scrollY
                    }
                  }
                }
              ],
              {
                useNativeDriver: USE_NATIVE_DRIVER,
                listener: onScroll
              }
            )
      }
    >
      <View style={styles.page}>
        <Counts />
        <Chart />
        <Flex style={_.mt.lg} justify='center'>
          <Touchable
            style={styles.touch}
            onPress={() => {
              const userId = $.username || $.userId
              t('空间.跳转', {
                userId,
                to: 'UserTimeline'
              })

              navigation.push('UserTimeline', {
                userId,
                userName: $.nickname
              })
            }}
          >
            <Text type='sub' bold>
              查看TA的时间线热力图
            </Text>
          </Touchable>
        </Flex>
      </View>
    </Animated.ScrollView>
  )
}

export default obc(Stats, COMPONENT)
