/*
 * @Author: czy0729
 * @Date: 2021-03-03 22:48:48
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-03-05 18:40:00
 */
import React from 'react'
import { View } from 'react-native'
import { Avatar } from '@components'
import { _, systemStore, tinygrailStore } from '@stores'
import { tinygrailOSS } from '@utils'
import { HOST_IMAGE } from '@utils/app/ds'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { CDN_OSS_MAGMA_MONO } from '@constants'
import { Navigation } from '@types'

function Icon(
  { id, monoId, name, icon, event },
  {
    navigation
  }: {
    navigation: Navigation
  }
) {
  const favor = tinygrailStore.collected(id)

  const { cdn, cdnOrigin } = systemStore.setting
  let src = tinygrailOSS(icon)
  if (typeof src === 'string') src = src.replace('/r/400/pic/crt/l/', '/pic/crt/g/')
  if (cdn && cdnOrigin === 'magma' && typeof src === 'string' && src.includes(HOST_IMAGE)) {
    src = CDN_OSS_MAGMA_MONO(src)
  }

  return (
    <View style={_.mt.md}>
      <Avatar
        src={src}
        name={name}
        borderWidth={favor ? 2 : 0}
        borderColor={favor ? '#ffc107' : 'transparent'}
        skeletonType='tinygrail'
        onPress={() => {
          t(event.id, {
            to: 'Mono',
            monoId: monoId || id,
            ...event.data
          })

          navigation.push('Mono', {
            monoId: `character/${monoId || id}`,
            _name: name
          })
        }}
      />
    </View>
  )
}

export default obc(Icon)
