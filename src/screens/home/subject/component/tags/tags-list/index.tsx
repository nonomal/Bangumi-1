/*
 * @Author: czy0729
 * @Date: 2024-08-04 04:45:34
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-08-19 04:47:07
 */
import React, { useEffect, useState } from 'react'
import { Flex, Iconfont, Text, Touchable } from '@components'
import { _ } from '@stores'
import { stl } from '@utils'
import { c } from '@utils/decorators'
import { r } from '@utils/dev'
import { t } from '@utils/fetch'
import { useObserver } from '@utils/hooks'
import { MODEL_SUBJECT_TYPE } from '@constants'
import { SubjectType } from '@types'
import { TITLE_TAGS } from '../../../ds'
import { Ctx } from '../../../types'
import Block from '../block'
import Typerank from '../typerank'
import { exist, loadTyperankData } from '../utils'
import { COMPONENT, EXPAND_NUM } from './ds'
import { memoStyles } from './styles'

function TagList({ showTyperank }, { $, navigation }: Ctx) {
  r(COMPONENT)

  const [expand, setExpand] = useState(false)
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (showTyperank) {
      async function loaded() {
        setShow(false)
        await loadTyperankData($.subjectTypeValue)
        setShow(true)
      }
      loaded()
    }
  }, [showTyperank])

  return useObserver(() => {
    const styles = memoStyles()
    return (
      <>
        {$.tags
          .filter((_item, index) => (expand ? true : index < EXPAND_NUM))
          .map(({ name, count }) => {
            const isSelected = $.collection?.tag?.includes?.(name)
            return (
              <Touchable
                key={name}
                animate
                scale={0.9}
                onPress={() => {
                  if (
                    showTyperank &&
                    exist(MODEL_SUBJECT_TYPE.getLabel<SubjectType>($.subjectType), name)
                  ) {
                    t('条目.跳转', {
                      to: 'Typerank',
                      from: TITLE_TAGS,
                      subjectId: $.subjectId
                    })

                    navigation.push('Typerank', {
                      type: MODEL_SUBJECT_TYPE.getLabel<SubjectType>($.subjectType),
                      tag: name,
                      subjectId: $.subjectId
                    })
                    return
                  }

                  t('条目.跳转', {
                    to: 'Tag',
                    from: TITLE_TAGS,
                    subjectId: $.subjectId
                  })

                  navigation.push('Tag', {
                    type: MODEL_SUBJECT_TYPE.getLabel<SubjectType>($.subjectType),
                    tag: name
                  })
                }}
              >
                <Flex style={stl(styles.item, isSelected && styles.selected)}>
                  <Text type={_.select('desc', isSelected ? 'main' : 'desc')} size={13} bold>
                    {name}
                  </Text>
                  {showTyperank ? (
                    show && <Typerank tag={name} />
                  ) : (
                    <Text
                      type={_.select('sub', isSelected ? 'main' : 'sub')}
                      size={12}
                      lineHeight={13}
                      bold
                    >
                      {' '}
                      {count}
                    </Text>
                  )}
                </Flex>
              </Touchable>
            )
          })}
        {$.state.rendered && (
          <>
            {!expand && $.tags.length > EXPAND_NUM && (
              <Touchable
                animate
                scale={0.9}
                onPress={() => {
                  setExpand(true)
                }}
              >
                <Flex style={styles.item}>
                  <Iconfont name='md-more-horiz' size={16} color={_.colorSub} />
                </Flex>
              </Touchable>
            )}
            <Block path='Anime' tags={$.animeTags} />
            <Block path='Game' tags={$.gameTags} />
            <Block path='Manga' tags={$.mangaTags} />
            <Block path='Wenku' tags={$.wenkuTags} />
          </>
        )}
      </>
    )
  })
}

export default c(TagList)
