/*
 * @Author: czy0729
 * @Date: 2023-03-11 17:17:39
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-03-05 18:29:55
 */
import React from 'react'
import { View } from 'react-native'
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { observer } from 'mobx-react'
import { LinearGradient } from 'expo-linear-gradient'
import { _ } from '@stores'
import { r } from '@utils/dev'
import { COMPONENT, SHIMMER_COLORS, SHIMMER_COLORS_DARK, SHIMMER_COLORS_TINYGRAIL_DARK } from './ds'
import { styles } from './styles'
import { Props as SkeletonProps } from './types'

export { SkeletonProps }

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

/** 骨架屏渐变动画 */
export const Skeleton = observer(({ type = 'app', width, height }: SkeletonProps) => {
  r(COMPONENT)

  if (
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    Number.isNaN(width) ||
    Number.isNaN(height)
  ) {
    return null
  }

  return (
    <View style={styles.skeleton} pointerEvents='none' removeClippedSubviews>
      <ShimmerPlaceholder
        visible={false}
        width={width}
        height={height}
        shimmerColors={_.select(
          SHIMMER_COLORS,
          type === 'tinygrail' ? SHIMMER_COLORS_TINYGRAIL_DARK : SHIMMER_COLORS_DARK
        )}
        duration={1600}
        isInteraction={false}
      />
    </View>
  )
})
