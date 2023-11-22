/*
 * @Author: czy0729
 * @Date: 2022-10-30 06:58:16
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-11-22 07:47:23
 */
import { StoreType as $ } from '../types'
import { memoStyles } from './styles'

type $State = $['state']

export const DEFAULT_PROPS = {
  styles: {} as ReturnType<typeof memoStyles>,
  visible: false as $State['visible'],
  name: '' as $State['name'],
  ip: '' as $State['ip'],
  username: '' as $State['username'],
  password: '' as $State['password'],
  port: '' as $State['port'],
  sharedFolder: '' as $State['sharedFolder'],
  path: '' as $State['path'],
  workGroup: '' as $State['workGroup'],
  url: '' as $State['url'],
  onClose: (() => {}) as $['onClose']
}

export const URL_DDPLAY = 'ddplay:[PATH]/[FILE]'
export const URL_POTPLAYRER = 'potplayer://[PATH]/[FILE]'
export const URL_VLC = 'vlc://[PATH]/[FILE]'
export const URL_MPV = 'mpv://weblink?url=[PATH]/[FILE]'
