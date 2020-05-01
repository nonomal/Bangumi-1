/*
 * @Author: czy0729
 * @Date: 2019-03-24 04:39:13
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-04-30 20:50:50
 */
import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Text, Iconfont, Flex, Input, Button } from '@components'
import { SectionTitle, Eps, IconReverse, Popover } from '@screens/_'
import { _ } from '@stores'
import BookEp from './book-ep'
import Disc from './disc'

const layoutWidth = parseInt(_.window.width - _.wind) - 1

function Ep({ style }, { $, navigation }) {
  // 书籍和游戏没有ep
  if ($.type === '游戏') {
    return null
  }

  if ($.type === '书籍') {
    return <BookEp style={style} />
  }

  if ($.type === '音乐') {
    return <Disc style={style} />
  }

  const styles = memoStyles()
  const { epsReverse, watchedEps } = $.state
  const { totalEps } = $.subjectFormHTML
  const canPlay = $.onlinePlayActionSheetData.length >= 2
  const showPlay = $.showOnlinePlay && canPlay
  return (
    <View style={[styles.container, style]}>
      <SectionTitle
        right={
          <>
            {$.showOnlinePlay && (
              <Popover data={$.onlineOrigins} onSelect={$.onlinePlaySelected}>
                <Iconfont style={styles.iconPlay} name='xin-fan' size={16} />
              </Popover>
            )}
            <IconReverse
              style={_.mr.sm}
              color={epsReverse ? _.colorMain : _.colorIcon}
              onPress={$.toggleReverseEps}
            />
          </>
        }
      >
        章节
        {showPlay && (
          <Text size={12} type='sub' lineHeight={24}>
            {' '}
            可播放
          </Text>
        )}
      </SectionTitle>
      <Eps
        style={_.mt.md}
        layoutWidth={layoutWidth}
        marginRight={_._wind}
        advance
        pagination
        login={$.isLogin}
        subjectId={$.params.subjectId}
        eps={epsReverse ? $.eps.reverse() : $.eps}
        userProgress={$.userProgress}
        canPlay={showPlay}
        onSelect={(value, item) => $.doEpsSelect(value, item, navigation)}
        onLongPress={item => $.doEpsLongPress(item)}
      />
      <Flex style={_.mt.md}>
        <View style={styles.input}>
          <Input
            keyboardType='numeric'
            value={watchedEps}
            placeholder={watchedEps || '0'}
            clearButtonMode='never'
            returnKeyType='done'
            returnKeyLabel='更新'
            onChangeText={text => {
              const newText = text.replace(/[^\d]+/, '')
              $.changeText('watchedEps', newText)
            }}
            onSubmitEditing={$.doUpdateSubjectEp}
          />
          {!!totalEps && (
            <Text style={styles.total} type='sub' pointerEvent='none'>
              / {totalEps}
            </Text>
          )}
        </View>
        <Button
          style={styles.btn}
          type='ghostPrimary'
          onPress={$.doUpdateSubjectEp}
        >
          更新
        </Button>
      </Flex>
    </View>
  )
}

Ep.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(Ep)

const memoStyles = _.memoStyles(_ => ({
  container: {
    minHeight: 146,
    marginLeft: _.wind,
    marginRight: _.wind - _._wind,
    backgroundColor: _.colorPlain
  },
  iconPlay: {
    paddingHorizontal: _.sm
  },
  input: {
    width: 120,
    height: 34
  },
  total: {
    position: 'absolute',
    zIndex: 1,
    top: 8,
    right: 12
  },
  btn: {
    width: 80,
    height: 34,
    marginLeft: 12
  }
}))
