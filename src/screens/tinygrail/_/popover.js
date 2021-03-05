/*
 * @Author: czy0729
 * @Date: 2019-11-17 21:04:23
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-03-05 11:51:00
 */
import React from 'react'
import { Iconfont } from '@components'
import { Popover as CompPopover } from '@screens/_'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { EVENT, IOS } from '@constants'

const data = ['收藏', 'K线', '买入', '卖出', '资产重组']

function Popover(
  { id, relation, subject, subjectId, event, onCollect },
  { navigation }
) {
  const { id: eventId, data: eventData } = event
  let _data = data
  if (subject && subjectId) {
    _data = [..._data, subject]
  }
  if (relation.length) {
    _data = [..._data, `关联角色 (${relation.length + 1})`]
  }
  return (
    <CompPopover
      contentStyle={styles.content}
      data={_data}
      onSelect={title => {
        switch (title) {
          case '收藏':
            onCollect(id)
            break

          case 'K线':
            t(eventId, {
              to: 'TinygrailTrade',
              from: 'popover',
              monoId: id,
              ...eventData
            })

            navigation.push('TinygrailTrade', {
              monoId: `character/${id}`
            })
            break

          case '买入':
            t(eventId, {
              to: 'TinygrailDeal',
              from: 'popover',
              type: 'bid',
              monoId: id,
              ...eventData
            })

            navigation.push('TinygrailDeal', {
              monoId: `character/${id}`,
              type: 'bid'
            })
            break

          case '卖出':
            t(eventId, {
              to: 'TinygrailDeal',
              from: 'popover',
              type: 'ask',
              monoId: id,
              ...eventData
            })

            navigation.push('TinygrailDeal', {
              monoId: `character/${id}`,
              type: 'ask'
            })
            break

          case '资产重组':
            t(eventId, {
              to: 'TinygrailSacrifice',
              from: 'popover',
              monoId: id,
              ...eventData
            })

            navigation.push('TinygrailSacrifice', {
              monoId: `character/${id}`
            })
            break

          default:
            if (title.includes('关联角色')) {
              t(eventId, {
                to: 'TinygrailRelation',
                from: 'popover',
                monoId: id,
                ...eventData
              })

              navigation.push('TinygrailRelation', {
                ids: [id, ...relation],
                name: `${subject} (${relation.length + 1})`
              })
              return
            }

            t(eventId, {
              to: 'Subject',
              from: 'popover',
              monoId: id,
              ...eventData
            })
            navigation.push('Subject', {
              subjectId
            })
            break
        }
      }}
    >
      <Iconfont
        style={styles.extra}
        name='extra'
        size={16}
        color={_.colorTinygrailText}
      />
    </CompPopover>
  )
}

export default obc(Popover, {
  relation: [],
  event: EVENT,
  onCollect: Function.prototype
})

const styles = _.create({
  content: {
    borderTopRightRadius: 0
  },
  extra: {
    height: 48,
    paddingTop: 19,
    paddingRight: IOS ? _.sm + 5 : _.sm,
    paddingLeft: 8
  }
})
