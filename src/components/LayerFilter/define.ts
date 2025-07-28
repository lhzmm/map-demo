import type { VNodeChild } from "vue";

export type iconOrImg =
  | {
      /**
       * 图标(优先级高于图片)
       */
      icon: string;
    }
  | {
      /**
       * 图片
       */
      img: string;
    };

export type layerItemData = iconOrImg & {
  /**
   * 展示文本（名字）
   */
  name: string;
  /**
   * 值
   */
  id: string | number;
  /**
   * 统计数量
   */
  num?: number | string;
  /**
   * 自定义渲染内容
   */
  customRender?: () => VNodeChild;
};

export type tabItem = iconOrImg &
  (
    | {
        /**
         * 布局方式(水平)
         */
        layout: "horizontal";
      }
    | {
        /**
         * 布局方式(垂直)
         */
        layout: "vertical";
        /**
         * 文本位置
         */
        labelPosition: "inner" | "outer";
      }
  ) & {
    /**
     * 显示文本(标题)
     */
    label: string;
    /**
     * 自定义渲染内容
     */
    customRender?: () => VNodeChild;
  };

export type baseProps = {
  /**
   * 唯一标识
   */
  keyId: string;
  /**
   * 初始化展示信息
   */
  tabItem: tabItem;
  /**
   * 是否选中
   */
  checked: boolean;
  /**
   * 内容出现位置
   */
  placement?: "left" | "right" | "bottom";
  /**
   * 是否只触发点击效果
   */
  isClick?: boolean;
  /**
   * 内容主标题
   */
  title?: string;
  /**
   * 自定义浮窗主标题渲染内容
   */
  customTitleRender?: () => VNodeChild;
  /**
   * 自定义浮窗主体渲染内容
   */
  customMainRender?: () => VNodeChild;
};

export type layerProps = {
  /**
   * 内容图层选项配置
   */
  layerConfig: layerItemData[] | { title: string; children: layerItemData[] }[];
  /**
   * 选中的id (layerItemData 每一项的id) (仅 layerConfig 配置时有效)
   */
  activeLayer: any[];
  /**
   * 可选中范围(true整行点击选中, false选择框选中)(仅 layerConfig 配置时有效)
   */
  checkRange?: boolean;
  /**
   * 是否多选(仅 layerConfig 配置时有效)
   */
  isMultiple?: boolean;
};

export type Props = baseProps | (baseProps & layerProps);

export function defineLayerProps(props: Props | Props[]) {
  return props;
}