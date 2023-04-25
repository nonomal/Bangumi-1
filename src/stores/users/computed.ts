/*
 * @Author: czy0729
 * @Date: 2023-04-25 13:59:32
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-25 14:03:33
 */
import { computed } from 'mobx'
import { HTMLDecode } from '@utils'
import { fixedRemote } from '@utils/user-setting'
import { LIST_EMPTY } from '@constants'
import { StoreConstructor, UserId } from '@types'
import userStore from '../user'
import State from './state'
import { INIT_USERS, INIT_USERS_INFO, STATE } from './init'
import {
  Blogs,
  Catalogs,
  Characters,
  Friends,
  FriendsMap,
  MyFriendsMap,
  Persons,
  Recents,
  Users,
  UsersInfo
} from './types'

export default class Computed
  extends State
  implements StoreConstructor<Omit<typeof STATE, 'catalogsCollect'>>
{
  /** 好友列表 */
  friends(userId?: UserId) {
    this.init('friends')
    return computed<Friends>(() => {
      const key = userId || userStore.myId
      return this.state.friends[key] || LIST_EMPTY
    }).get()
  }

  /** 我的好友 userId 哈希映射 */
  @computed get myFriendsMap(): MyFriendsMap {
    this.init('myFriendsMap')
    return this.state.myFriendsMap
  }

  /** 用户信息 */
  users(userId?: UserId) {
    this.init('users')
    return computed<Users>(() => {
      const key = userId || userStore.myId
      return this.state.users[key] || INIT_USERS
    }).get()
  }

  /** 用户简短信息 */
  usersInfo(userId?: UserId) {
    this.init('usersInfo')
    return computed<UsersInfo>(() => {
      const key = userId
      return this.state.usersInfo[key] || INIT_USERS_INFO
    }).get()
  }

  /** 用户收藏的虚拟角色 */
  characters(userId?: UserId) {
    this.init('characters')
    return computed<Characters>(() => {
      const key = userId || userStore.myId
      return this.state.characters[key] || LIST_EMPTY
    }).get()
  }

  /** 用户收藏的现实人物 */
  persons(userId?: UserId) {
    this.init('persons')
    return computed<Persons>(() => {
      const key = userId || userStore.myId
      return this.state.persons[key] || LIST_EMPTY
    }).get()
  }

  /** 我收藏人物的最近作品 */
  @computed get recents(): Recents {
    this.init('recents')
    return this.state.recents
  }

  /** 用户日志 */
  blogs(userId?: UserId) {
    this.init('blogs')
    return computed<Blogs>(() => {
      const key = userId || userStore.myId
      return this.state.blogs[key] || LIST_EMPTY
    }).get()
  }

  /** 用户目录 */
  catalogs(userId?: UserId, isCollect?: boolean) {
    const key = `catalogs${isCollect ? 'Collect' : ''}` as const
    this.init(key)
    return computed<Catalogs>(() => {
      const _userId = userId || userStore.myId
      return this.state[key][_userId] || LIST_EMPTY
    }).get()
  }

  // -------------------- computed --------------------
  /** 好友对象 */
  @computed get friendsMap(): FriendsMap {
    const { list } = this.friends()
    const map = {}
    list.forEach(item => (map[item.userId] = item))
    return map
  }

  /** 自定义的头像 */
  @computed get customAvatar() {
    try {
      const sign = this.users()?.sign || ''
      const avatars = sign.match(/\[avatar\](.+?)\[\/avatar\]/)
      const src = avatars ? String(avatars[1]).trim() : ''
      return fixedRemote(HTMLDecode(src), true)
    } catch (error) {
      return ''
    }
  }
}
