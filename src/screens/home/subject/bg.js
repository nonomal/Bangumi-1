/*
 * @Author: czy0729
 * @Date: 2020-04-06 05:31:17
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-08-12 00:39:54
 */
import React from 'react'
import { BlurView } from '@components'
import { _ } from '@stores'
import { getCoverMedium } from '@utils/app'
import { obc } from '@utils/decorators'
import { IOS } from '@constants'
import { CDN_OSS_SUBJECT } from '@constants/cdn'

function Bg({ show }, { $ }) {
  rerender('Subject.Bg')

  if (!show) return null

  const styles = memoStyles()
  const { images = {} } = $.subject
  return (
    <BlurView
      style={styles.blurView}
      theme={_.select(null, 'dark')}
      tint={_.select('default', 'dark')}
      src={CDN_OSS_SUBJECT(getCoverMedium($.coverPlaceholder || images.common))}
    />
  )
}

export default obc(Bg)

const memoStyles = _.memoStyles(_ => ({
  blurView: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    right: 0,
    height: IOS ? _.window.height * 0.32 : 160, // iOS有弹簧, 所以拉下来太矮会看见背景
    backgroundColor: _.colorBg
  }
}))
