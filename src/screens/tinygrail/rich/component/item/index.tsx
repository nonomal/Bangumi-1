/*
 * @Author: czy0729
 * @Date: 2019-08-25 19:51:55
 * @Last Modified by: czy0729
 * @Last Modified time: 2025-06-26 02:46:30
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Iconfont, Text, TextType, Touchable } from '@components'
import { _, userStore } from '@stores'
import { getTimestamp, lastDate, stl } from '@utils'
import { ob } from '@utils/decorators'
import { t } from '@utils/fetch'
import { useNavigation } from '@utils/hooks'
import TinygrailAvatar from '@tinygrail/_/avatar'
import { decimal } from '@tinygrail/_/utils'
import { afterTax } from './utils'
import { COMPONENT, EVENT } from './ds'
import { memoStyles } from './styles'

function Item({
  index,
  title,
  page,
  limit,
  avatar,
  userId,
  nickname,
  total,
  share,
  assets,
  principal,
  lastActiveDate,
  lastIndex,
  state
}) {
  const navigation = useNavigation()
  const styles = memoStyles()
  const lastActiveTS = getTimestamp(lastActiveDate.replace('T', ' '))

  const totalText = decimal(Math.abs(total))
  const assetsText = decimal(Math.abs(assets))
  const shareText = decimal(Math.abs(share))

  const rank = index + 1 + (page - 1) * limit
  let changeText: any = ''
  let changeColor: TextType
  if (lastIndex === 0) {
    changeText = 'new'
    changeColor = 'warning'
  } else {
    const change = lastIndex - rank
    if (change < 0) {
      changeText = change
      changeColor = 'ask'
    } else if (change > 0) {
      changeText = `+${change}`
      changeColor = 'bid'
    }
  }

  let text = ''
  let right = ''
  if (title === '周股息') {
    text = `周股息${shareText} / ${lastDate(lastActiveTS)}`
    right = `税后 ${decimal(afterTax(share))}`
  } else if (title === '流动资金') {
    text = `总值${assetsText} / 股息${shareText}`
    right = totalText
  } else if (title === '初始资金') {
    const principalText = decimal(Math.abs(principal))
    text = `总值${assetsText} / 流动资金${totalText}`
    right = principalText
  } else {
    text = `周股息${shareText} / 税后${decimal(afterTax(share))} / ${lastDate(lastActiveTS)}`
    right = assetsText
  }

  const isBan = state === 666

  return (
    <View
      style={stl(styles.container, userStore.myId && userStore.myId === userId && styles.highlight)}
    >
      <Flex align='start'>
        <View style={_.mt.md}>
          <TinygrailAvatar
            navigation={navigation}
            src={avatar}
            size={36}
            userId={userId}
            name={nickname}
            last={lastActiveDate}
            event={EVENT}
          />
        </View>
        <Flex.Item style={styles.wrap}>
          <Flex align='start'>
            <Flex.Item style={_.mr.sm}>
              <Touchable
                style={styles.item}
                onPress={() => {
                  navigation.push('TinygrailTree', {
                    userName: userId,
                    name: nickname
                  })

                  t('番市首富.跳转', {
                    to: 'TinygrailTree',
                    userId
                  })
                }}
              >
                <Flex>
                  <Flex.Item>
                    <Flex>
                      <Text style={styles.rank} size={12} bold align='center'>
                        {rank}
                      </Text>
                      <Text type={isBan ? 'ask' : 'tinygrailPlain'} bold>
                        {nickname}
                        {isBan ? ' [已封禁] ' : ''}
                        {!!changeText && <Text type={changeColor}> {changeText}</Text>}
                      </Text>
                    </Flex>
                    <Text style={_.mt.xs} type='tinygrailText' size={12} lineHeight={13}>
                      {text}
                    </Text>
                  </Flex.Item>
                  <Text style={_.ml.sm} type='tinygrailPlain'>
                    {right}
                  </Text>
                  <Iconfont style={_.mr._sm} name='md-navigate-next' color={_.colorTinygrailText} />
                </Flex>
              </Touchable>
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    </View>
  )
}

export default ob(Item, COMPONENT)
