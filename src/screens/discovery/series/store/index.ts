/*
 * @Author: czy0729
 * @Date: 2022-04-15 09:20:13
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-30 19:37:40
 */
import { getTimestamp } from '@utils'
import Action from './action'
import { EXCLUDE_STATE, NAMESPACE } from './ds'

/** 关联系列页面状态机 */
export default class ScreenSeries extends Action {
  init = async () => {
    this.setState({
      ...(await this.getStorage(NAMESPACE)),
      ...EXCLUDE_STATE,
      _loaded: getTimestamp()
    })

    if (!this.state.data.length) {
      this.fetchSeries()
    } else {
      this.calculateData()
    }

    return true
  }
}
