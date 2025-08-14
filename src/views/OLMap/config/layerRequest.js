
import { createAjax } from '@/utils/ajax'

export const getRiverList = (params) => {
  return createAjax('/water/v1/listRiverWaterRegime')(params, { onceAtSameTime: true })
}

export const getRainList = (params) => {
  return createAjax('/rainCondition/v1/realTimeRainHour')(params, { onceAtSameTime: true })
}

export const getReservoirList = (params) => {
  return createAjax('/water/v1/listResWaterRegime')(params, { onceAtSameTime: true })
}

// 等值线面接口step1
export function getRainfallEquivalentFirstStep(params) {
  return createAjax('/water/rain/v3/realtimeWarn/rainfallEquivalentFirstStep')(params,{ onceAtSameTime: true, getCancelTokenKey: () => params.id })
}
// 等值线面接口step2
export function getRainfallEquivalentSecondStep(params) {
  return createAjax(`/water/rain/v3/realtimeWarn/rainfallEquivalentSecondStep?adcd=${params.adcd}&rasterId=${params.rasterId}`, 'GET')({},
    { getCancelTokenKey: () => params.id, onceAtSameTime: true })
}