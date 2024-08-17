/*
 * @Author: czy0729
 * @Date: 2023-04-11 11:34:35
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-07-24 03:47:35
 */
import { _ } from '@stores'
import { STORYBOOK } from '@constants'

export const memoStyles = _.memoStyles(() => ({
  web: {
    // @ts-expect-error
    position: 'fixed',
    zIndex: 1,
    right: _.wind,
    bottom: 92,
    left: _.wind
  },
  btns: {
    paddingHorizontal: _.sm,
    marginTop: _.md,
    marginBottom: STORYBOOK ? 0 : _.md
  },
  touch: {
    borderRadius: _.r(36),
    overflow: 'hidden'
  },
  btn: {
    height: _.r(36),
    backgroundColor: _.select(_.colorDesc, _._colorDarkModeLevel1),
    borderRadius: _.r(36)
  },
  refresh: {
    marginRight: _.sm,
    marginLeft: _.md
  },
  setting: {
    paddingHorizontal: _.sm,
    marginBottom: 24
  }
}))
