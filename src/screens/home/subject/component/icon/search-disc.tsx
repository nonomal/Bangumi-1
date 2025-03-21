/*
 * @Author: czy0729
 * @Date: 2021-08-31 18:58:29
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-15 01:57:38
 */
import React from 'react'
import { Flex, Iconfont } from '@components'
import { Popover } from '@_'
import { useStore } from '@stores'
import { stl } from '@utils'
import { ob } from '@utils/decorators'
import { Ctx } from '../../types'
import { ACTIONS_MANAGE, HIT_SLOP, ORIGINS_MANAGE } from './ds'
import { styles } from './styles'
import { IconProps } from './types'

function IconSearchDisc({ style, children }: IconProps) {
  const { $, navigation } = useStore<Ctx>()
  const data = [
    ...$.onlineDiscOrigins.map(item => (typeof item === 'object' ? item.name : item)),
    ORIGINS_MANAGE
  ]
  if (!$.actions.length) data.push(ACTIONS_MANAGE)

  return (
    <Popover
      style={stl(!children && styles.touch, style)}
      data={data}
      hitSlop={HIT_SLOP}
      onSelect={(title: string) => {
        if (title === ORIGINS_MANAGE) {
          navigation.push('OriginSetting')
          return
        }

        if (title === ACTIONS_MANAGE) {
          navigation.push('Actions', {
            subjectId: $.subjectId,
            name: $.cn || $.jp
          })
          return
        }

        $.onlineDiscSelected(title)
      }}
    >
      {children || (
        <Flex style={styles.searchDiscBtn} justify='center'>
          <Iconfont name='md-airplay' size={18} />
        </Flex>
      )}
    </Popover>
  )
}

export default ob(IconSearchDisc)
