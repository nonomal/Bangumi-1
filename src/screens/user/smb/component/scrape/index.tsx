/*
 * @Author: czy0729
 * @Date: 2023-11-26 17:34:29
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-09-04 21:08:54
 */
import React from 'react'
import { View } from 'react-native'
import { Input, Modal, Text } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { Ctx } from '../../types'
import { COMPONENT } from './ds'
import { memoStyles } from './styles'

function Scrape(_props, { $ }: Ctx) {
  const styles = memoStyles()
  return (
    <Modal
      style={styles.modal}
      visible={$.state.extendsJAVisible}
      title='扩展刮削词'
      onClose={$.onCloseExtendsJA}
    >
      <View style={styles.body}>
        <Text size={12} bold type='sub'>
          若你并不想修改本地，也可以在下面输入一些文件夹关键词匹配指定条目。
        </Text>
        <Text style={_.mt.xs} size={12} bold type='sub'>
          一行一个，举例（注意是半角逗号）：Tenten Kakumei, 395714
        </Text>
        <Input
          style={styles.input}
          inputStyle={styles.multilineInputStyle}
          defaultValue={$.state.extendsJA.value}
          placeholder={'关键字, 条目数字id'}
          multiline
          numberOfLines={10}
          textAlignVertical='top'
          onChangeText={text => {
            $.setState({
              extendsJA: {
                value: text
              }
            })
          }}
        />
      </View>
    </Modal>
  )
}

export default obc(Scrape, COMPONENT)
