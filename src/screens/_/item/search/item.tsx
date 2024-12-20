/*
 * @Author: czy0729
 * @Date: 2022-06-15 10:47:35
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-10-30 17:08:24
 */
import React from 'react'
import { View } from 'react-native'
import { Cover, Flex, Text, Touchable } from '@components'
import { getCoverSrc } from '@components/cover/utils'
import { _, uiStore } from '@stores'
import { appNavigate, cnjp, getAction, HTMLDecode, stl, x18 } from '@utils'
import { memo } from '@utils/decorators'
import { IMG_HEIGHT_LG, IMG_WIDTH_LG, MODEL_COLLECTION_STATUS } from '@constants'
import { CollectionStatus } from '@types'
import { InView, Manage, Rank, Stars, Tag } from '../../base'
import Title from './title'
import { COMPONENT_MAIN, DEFAULT_PROPS } from './ds'

const Item = memo(
  ({
    navigation,
    styles,
    style,
    index,
    id,
    name,
    nameCn,
    cover,
    typeCn,
    tip,
    rank,
    score,
    total,
    comments,
    collection,
    position,
    showManage,
    screen,
    highlight,
    event
  }) => {
    const subjectId = String(id).replace('/subject/', '')
    const justify = tip || position.length ? 'between' : 'start'

    // 人物高清图不是正方形的图, 所以要特殊处理
    const isMono = !String(id).includes('/subject/')
    const isMusic = typeCn === '音乐'
    let width = isMono ? 56 : IMG_WIDTH_LG
    let height = isMono ? 56 : isMusic ? IMG_WIDTH_LG : IMG_HEIGHT_LG
    if (isMusic) {
      width = Math.floor(width * 1.1)
      height = Math.floor(height * 1.1)
    }

    return (
      <Touchable
        style={stl(styles.container, style)}
        animate
        onPress={() => {
          appNavigate(
            String(id),
            navigation,
            {
              _jp: name,
              _cn: nameCn,
              _image: getCoverSrc(cover, width),
              _type: typeCn,
              _collection: collection
            },
            event
          )
        }}
      >
        <Flex style={styles.wrap} align='start'>
          <InView
            style={{
              minWidth: width,
              minHeight: height
            }}
            y={height * (index + 1)}
          >
            <Cover
              src={cover}
              placeholder={!isMono}
              width={width}
              height={height}
              type={typeCn}
              cdn={!x18(subjectId)}
              priority={index < 4 ? 'high' : 'normal'}
              radius
            />
          </InView>
          <Flex
            style={stl(styles.content, !!comments && styles.flux, isMusic && styles.musicContent)}
            direction='column'
            justify={justify}
            align='start'
          >
            <Flex style={styles.title} align='start'>
              <Flex.Item>
                <Title name={name} nameCn={nameCn} comments={comments} highlight={highlight} />
              </Flex.Item>
              {showManage && !isMono && (
                <View style={styles.manage}>
                  <Manage
                    subjectId={subjectId}
                    collection={collection}
                    typeCn={typeCn}
                    onPress={() => {
                      uiStore.showManageModal(
                        {
                          subjectId,
                          title: cnjp(nameCn, name),
                          desc: cnjp(name, nameCn),
                          status: MODEL_COLLECTION_STATUS.getValue<CollectionStatus>(collection),
                          action: getAction(typeCn)
                        },
                        screen
                      )
                    }}
                  />
                </View>
              )}
            </Flex>
            {!!tip && (
              <Text
                style={isMusic && _.mt.xs}
                size={11}
                lineHeight={14}
                numberOfLines={isMusic ? 2 : 3}
              >
                {HTMLDecode(tip)}
              </Text>
            )}
            {!!position.length && (
              <Flex style={_.mt.sm} wrap='wrap'>
                {position.map(item => (
                  <Tag key={item} style={_.mr.sm} value={item} />
                ))}
              </Flex>
            )}
            <Flex style={_.mt.md}>
              <Rank value={rank} />
              <Stars value={score} />
              <Text style={_.ml.xxs} type='sub' size={11}>
                {total}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Touchable>
    )
  },
  DEFAULT_PROPS,
  COMPONENT_MAIN
)

export default Item
