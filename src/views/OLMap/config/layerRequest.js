
import { createAjax } from '@/utils/ajax'

export const getRiverList = (params) => {
  return createAjax('/water/v1/listRiverWaterRegime')(params, { onceAtSameTime: true })
}