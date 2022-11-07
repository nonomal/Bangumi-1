/*
 * @Author: czy0729
 * @Date: 2020-10-24 23:25:32
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-10-22 09:29:03
 */
import React from 'react'
import { Text } from '@components'
import { userStore } from '@stores'
import { toFixed } from '@utils'
import { obc } from '@utils/decorators'
import userJson from '@assets/json/user.json'
import { Ctx } from '../types'

function User({ style }, { $ }: Ctx) {
  const { username } = userStore.userInfo
  if (username !== 'sukaretto') return null

  const item = userJson[$.username] || userJson[$.userId] || 0
  if (!item) {
    return (
      <Text style={style} type='__plain__' size={10} bold>
        -
      </Text>
    )
  }

  return (
    <Text style={style} type='__plain__' size={10} bold>
      {/* @ts-ignore */}
      {item} / {toFixed((item / userJson._sum) * 100, 2)}% ({/* @ts-ignore */}
      {toFixed((item / (userJson._sum - userJson[0])) * 100, 2)}%)
    </Text>
  )
}

export default obc(User)