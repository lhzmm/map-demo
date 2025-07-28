
import { createAjax } from '@/utils/ajax'

export const getRiverList = (params) => {
  return createAjax('/water/v1/listRiverWaterRegime')(params, { onceAtSameTime: true })
}

export const getRainList = (params) => {
  return createAjax('/rainCondition/v1/realTimeRainHour')(params, { onceAtSameTime: true })
}