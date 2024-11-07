/*
 * @Author: czy0729
 * @Date: 2024-11-08 06:29:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-08 06:34:30
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  segment: {
    width: _.window.width - _.wind * 2,
    height: 30,
    marginTop: _.xs,
    marginLeft: _.wind,
    marginBottom: _.sm
  }
}))
