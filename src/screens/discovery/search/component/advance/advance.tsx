/*
 * @Author: czy0729
 * @Date: 2024-01-09 10:55:40
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-10-14 10:08:14
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Highlight, Iconfont, Text, Touchable } from '@components'
import { _ } from '@stores'
import { t2s } from '@utils'
import { memo } from '@utils/decorators'
import { t } from '@utils/fetch'
import { useResult } from './hooks'
import { COMPONENT_MAIN, DEFAULT_PROPS } from './ds'

const Advance = memo(
  ({ navigation, styles, cat, value, onSubmit }) => {
    const { result, substrings } = useResult(cat, value)
    const isSubjectId = /\d+/.test(value)
    return (
      <View>
        {isSubjectId && (
          <Flex style={[_.mt.md, _.mb.sm]}>
            <Touchable
              style={styles.item}
              onPress={() => {
                navigation.push('Subject', {
                  subjectId: value
                })

                t('搜索.条目直达', {
                  subjectId: value
                })
              }}
            >
              <Text size={12} bold>
                #{value}
              </Text>
            </Touchable>
          </Flex>
        )}
        {result.map(item => (
          <Flex key={item} style={styles.item}>
            <Flex.Item>
              <Touchable
                onPress={() => {
                  onSubmit(item)

                  t('搜索.模糊查询点击', {
                    text: t2s(value.toLocaleUpperCase()).trim()
                  })
                }}
              >
                <Highlight
                  size={item.length >= 20 ? 11 : item.length >= 12 ? 12 : 14}
                  bold
                  value={value}
                  numberOfLines={2}
                >
                  {item}
                </Highlight>
              </Touchable>
            </Flex.Item>
            <Touchable style={styles.search} onPress={() => onSubmit(item)}>
              <Iconfont name='md-search' size={20} />
            </Touchable>
            <Touchable
              style={styles.open}
              onPress={() => {
                const subjectId = substrings.current[item]
                navigation.push('Subject', {
                  subjectId
                })

                t('搜索.模糊查询跳转', {
                  subjectId
                })
              }}
            >
              <Iconfont name='md-open-in-new' size={17} />
            </Touchable>
          </Flex>
        ))}
      </View>
    )
  },
  DEFAULT_PROPS,
  COMPONENT_MAIN
)

export default Advance
