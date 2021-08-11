/*
 * @Author: czy0729
 * @Date: 2019-03-24 05:24:48
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-08-12 00:45:53
 */
import React from 'react'
import { View } from 'react-native'
import { Expand, Text } from '@components'
import { SectionTitle } from '@screens/_'
import { _, systemStore } from '@stores'
import { obc } from '@utils/decorators'
import IconTranslate from './icon/translate'

function Summary({ style }, { $ }) {
  rerender('Subject.Summary')

  const { _loaded } = $.subject
  if (_loaded && !$.summary) return null

  const styles = memoStyles()
  const { showSummary } = systemStore.setting
  const { translateResult } = $.state
  const content = $.summary.replace(/\r\n\r\n/g, '\r\n')
  return (
    <View
      style={[
        _.container.wind,
        showSummary && styles.container,
        style,
        !showSummary && _.short
      ]}
    >
      <SectionTitle
        right={<IconTranslate />}
        icon={!showSummary && 'md-navigate-next'}
        onPress={() => $.switchBlock('showSummary')}
      >
        简介
      </SectionTitle>
      {showSummary && (
        <View>
          {translateResult.length ? (
            <View>
              {translateResult.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <View key={index} style={_.mt.sm}>
                  <Text style={_.mt.md} type='sub' size={12} selectable>
                    {item.src}
                  </Text>
                  <Text style={_.mt.sm} size={15} bold selectable>
                    {item.dst}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            !!content && (
              <Expand moreStyle={styles.moreStyle}>
                <Text style={_.mt.sm} size={15} lineHeight={22} selectable>
                  {content}
                </Text>
              </Expand>
            )
          )}
        </View>
      )}
    </View>
  )
}

export default obc(Summary)

const memoStyles = _.memoStyles(_ => ({
  container: {
    minHeight: 120
  },
  moreStyle: {
    marginRight: _.md
  }
}))
