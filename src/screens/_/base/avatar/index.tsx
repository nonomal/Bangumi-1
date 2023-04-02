/*
 * 头像
 *
 * @Author: czy0729
 * @Date: 2019-05-19 17:10:16
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-02-28 19:22:04
 */
import React from 'react'
import { View } from 'react-native'
import { Image, Touchable } from '@components'
import { _, systemStore, userStore, usersStore } from '@stores'
import { getTimestamp, getCoverMedium, stl } from '@utils'
import { t } from '@utils/fetch'
import { HOST_API_V0 } from '@utils/fetch.v0/ds'
import { ob } from '@utils/decorators'
import {
  AVATAR_DEFAULT,
  CDN_OSS_AVATAR,
  HOST_CDN,
  IOS,
  URL_DEFAULT_AVATAR
} from '@constants'
import { AnyObject, Fn } from '@types'
import { memoStyles } from './styles'
import { Props as AvatarProps } from './types'

export { AvatarProps }

/** 判断是否自己的头像, 一周才变化一次 */
const TS = Math.floor(getTimestamp() / 604800)

/** 中质量头像 */
const USER_MEDIUM = '//lain.bgm.tv/pic/user/m/'

/** 大质量头像 */
const USER_LARGE = '//lain.bgm.tv/pic/user/l/'

export const Avatar = ob(
  ({
    style,
    navigation,
    userId,
    name,
    src,
    size = 40,
    borderWidth,
    borderColor = _.colorBorder,
    event = {},
    params = {},
    round,
    radius,
    placeholder,
    fallbackSrc,
    onPress,
    onLongPress
  }: AvatarProps) => {
    const styles = memoStyles()
    const { dev } = systemStore.state
    const { cdn, cdnAvatar, avatarRound, coverRadius } = systemStore.setting
    const { avatar } = userStore.usersInfo()
    const _size = _.r(size)

    // @issue 有些第三方地址使用 rn-fast-image 不使用 fallback 都会直接加载失败
    let fallback = false

    /**
     * 判断是否自己的头像, 若是不走 CDN, 保证最新
     * 注意头像后面 ?r=xxx 的参数不要去掉, 因头像地址每个人都唯一, 需要防止本地缓存
     */
    const mSrc = getCoverMedium(src, true)
    let _src: any
    if (avatar?.medium && typeof mSrc === 'string') {
      const _1 = mSrc.split('?')[0].split('/m/')
      const _2 = getCoverMedium(avatar.medium, true).split('?')[0].split('/m/')

      // 为自己
      if (_1[1] && _2[1] && _1[1] === _2[1]) {
        if (mSrc.includes(URL_DEFAULT_AVATAR)) {
          _src = `${mSrc}?r=${TS}`
        } else {
          _src = usersStore.customAvatar || `${mSrc}?r=${TS}`
        }
      }
    }

    if (!_src) {
      _src = cdn && cdnAvatar ? CDN_OSS_AVATAR(getCoverMedium(src, true)) : mSrc
    }

    // 若还是原始头像, 使用本地
    if ((userStore.isLimit && _src.includes(URL_DEFAULT_AVATAR)) || !_src) {
      _src = AVATAR_DEFAULT
    }

    // 默认带圆角, 若大小的一半比设置的圆角还小, 为避免方形头像变成原型, 则覆盖成sm
    let _radius: boolean | number = true
    if (radius) {
      _radius = radius
    } else if (round || avatarRound) {
      _radius = _size / 2
    } else if (_size / 2 <= coverRadius) {
      _radius = _.radiusSm
    }

    let _onPress: Fn
    if (onPress || (navigation && userId)) {
      _onPress = () => {
        if (onPress) {
          onPress()
          return
        }

        const { id, data = {} } = event
        t(id, {
          to: 'Zone',
          userId,
          ...data
        })

        navigation.push('Zone', {
          userId,
          _id: userId,
          _image: _src,
          _name: name,
          ...params
        })
      }
    }

    /**
     * @notice 安卓 gif 图片不能直接设置 borderRadius, 需要再包一层
     * 然后就是 bgm 的默认图 /icon.jpg 根本不是 jpg 是 gif
     */
    if (!IOS && src && typeof src === 'string' && src.includes('/icon.jpg')) {
      const _style = [
        styles.avatar,
        {
          width: _size,
          height: _size,
          borderWidth: 0
        },
        style
      ]
      if (avatarRound) {
        _style.push({
          borderRadius: _size / 2
        })
      }
      return (
        <View style={_style}>
          <Image
            size={_size}
            src={_src}
            radius={_radius}
            quality={false}
            placeholder={placeholder}
            fallbackSrc={fallbackSrc || src}
            scale={0.8}
            onPress={_onPress}
            onLongPress={onLongPress}
          />
        </View>
      )
    }

    const isUrl = typeof _src === 'string'

    // 强制使用 /l/
    if (isUrl && _src.includes(USER_MEDIUM)) {
      _src = _src.replace(USER_MEDIUM, USER_LARGE)
    }

    _src = fixed(_src)

    if (isUrl && !_src.includes(USER_LARGE) && !_src.includes(HOST_API_V0)) {
      fallback = true
    }

    const containerStyle = stl(
      style,
      dev && isUrl && _src.includes(HOST_CDN) && styles.dev
    )
    const passProps: AnyObject = {
      key: isUrl ? _src : 'avatar',
      size: _size,
      src: _src,
      radius: _radius,
      border: borderColor,
      borderWidth: borderWidth,
      quality: false,
      placeholder: placeholder,
      fallback: fallback,
      fallbackSrc: fixed(String(fallbackSrc || src))
    }
    if (_onPress || onLongPress) {
      return (
        <Touchable
          style={containerStyle}
          animate
          scale={0.88}
          onPress={_onPress}
          onLongPress={onLongPress}
        >
          <Image {...passProps} />
        </Touchable>
      )
    }

    passProps.style = containerStyle
    return <Image {...passProps} />
  }
)

/**
 * 网页端新出的图片规则, 需要处理一下
 * please use '/r/<size>/pic/cover/l/' path instead
 * @date 2023-04-02
 */
function fixed(src: any) {
  if (typeof src === 'string') {
    return src.replace(
      /\/r\/(\d+)x(\d+)\/pic\/cover\/(s|c|m)\//g,
      '/r/$1x$2/pic/cover/l/'
    )
  }

  return src
}
