/*
 * @Author: czy0729
 * @Date: 2024-05-04 05:27:30
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-08-22 15:49:35
 */
import React from 'react'
import { Flex, Text, Touchable } from '@components'
import { Rank } from '@_'
import { _, uiStore } from '@stores'
import { feedback, findSubjectJp, HTMLDecode } from '@utils'
import { ob } from '@utils/decorators'
import { t } from '@utils/fetch'
import { COMPONENT } from './ds'
import { styles } from './styles'
import { Props } from './types'

function Item({ navigation, item, index }: Props) {
  const jp = findSubjectJp(item.title, item.id)
  return (
    <Flex style={styles.item} align='start'>
      <Text size={13} lineHeight={20}>
        {index + 1}.{' '}
      </Text>
      <Flex.Item>
        <Touchable
          style={_.ml.xs}
          onPress={() => {
            navigation.push('Subject', {
              subjectId: item.id,
              _cn: item.title
            })

            t('评分月刊.跳转', {
              subjectId: item.id
            })
          }}
        >
          <Text size={20}>
            {HTMLDecode(item.title)}
            <Text
              style={{
                opacity: Math.min(Math.max(Number(item.rating) / 8, 0.32), 1)
              }}
              type='main'
              size={13}
              lineHeight={20}
              bold
            >
              {'  '}
              {item.rating}
            </Text>
          </Text>
          {!!jp && jp !== item.title && (
            <Text style={_.mt.xs} type='sub' size={13} lineHeight={14}>
              {jp}
            </Text>
          )}
        </Touchable>
      </Flex.Item>
      <Touchable
        onPress={() => {
          uiStore.showPopableSubject({
            subjectId: item.id
          })
          feedback(true)

          t('评分月刊.缩略框', {
            subjectId: item.id
          })
        }}
      >
        <Rank style={styles.value} value={item.value1} size={16} />
      </Touchable>
    </Flex>
  )
}

export default ob(Item, COMPONENT)
