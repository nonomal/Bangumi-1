/*
 * @Author: czy0729
 * @Date: 2022-03-23 09:54:07
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-03-23 19:46:19
 */
import React from 'react'
import { Flex, Text, Iconfont } from '@components'
import { Popover, Tag } from '@_'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { confirm } from '@utils/ui'
import Form from './form'

const Item = ({ type, id, uuid, active, name, url, sort }, { $ }) => {
  const styles = memoStyles()

  const actions = []
  const isBase = !!id
  const isActive = !!active
  actions.push(isBase ? '编辑排序' : '编辑', isActive ? '停用' : '启用')
  if (!isBase) actions.push('删除')
  actions.push('测试')

  const { edit } = $.state
  const isEdit =
    edit.type === type &&
    ((id && edit.item.id === id) || (uuid && edit.item.uuid === uuid))
  return (
    <>
      <Flex style={[styles.item, !isActive && styles.disabled]}>
        <Flex.Item>
          <Text size={15} bold>
            {name}
            {isBase && (
              <Text type='sub' size={10} lineHeight={15} bold>
                {' '}
                示例
              </Text>
            )}
          </Text>
          <Text style={_.mt.xs} size={12} type='sub' numberOfLines={1}>
            [{sort}] {url}
          </Text>
        </Flex.Item>
        {isActive && <Tag style={_.ml.md} value='生效' />}
        <Popover
          style={_.ml.md}
          data={actions}
          onSelect={title => {
            switch (title) {
              case '编辑排序':
                $.openEdit(type, {
                  id,
                  uuid: '',
                  name,
                  url,
                  sort,
                  active
                })
                break

              case '编辑':
                $.openEdit(type, {
                  id: '',
                  uuid,
                  name,
                  url,
                  sort,
                  active
                })
                break

              case '删除':
                confirm(`确定删除 [${name}] ?`, () => {
                  $.deleteItem({
                    uuid,
                    type
                  })
                })
                break

              case '停用':
                $.disableItem({
                  id,
                  uuid,
                  type
                })
                break

              case '启用':
                $.activeItem({
                  id,
                  uuid,
                  type
                })
                break

              case '测试':
                $.go({
                  type,
                  url
                })
                break

              default:
                break
            }
          }}
        >
          <Iconfont name='md-more-vert' color={_.colorDesc} />
        </Popover>
      </Flex>
      {isEdit && <Form name={name} url={url} isBase={isBase} />}
    </>
  )
}

export default obc(Item)

const memoStyles = _.memoStyles(() => ({
  item: {
    marginVertical: _.md
  },
  disabled: {
    opacity: 0.5
  }
}))