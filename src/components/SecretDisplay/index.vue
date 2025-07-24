<script lang="jsx">
import { version } from "vue";

const isVue3 = version?.startsWith('3') // 判断vue版本

export default {
  props: {
    needDecrypt: {
      type: Boolean,
      default: false,
    },
    decryptFn: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      // 是否显示明文
      isDecode: false,
    }
  },
  methods: {
    toggleDisplay() {
      this.isDecode = !this.isDecode
    },
    getText(vnodes) {
      return (vnodes[0]?.text || vnodes[0]?.children)?.trim()
    },
    decrypt(vnodes) {
      let content
      try {
        content = this.getText(vnodes)
      } catch {
        /*  */
      }
      if (typeof content !== 'string') return vnodes
      // Vue.prototype.USE_FOR_DC_SECRET_DISPLAY={decryptFn:()=>{}}
      let decryptFn
      if (typeof this.decryptFn === 'function') {
        decryptFn = this.decryptFn
      } else if (this.USE_FOR_DC_SECRET_DISPLAY && typeof this.USE_FOR_DC_SECRET_DISPLAY.decryptFn === 'function') {
        decryptFn = this.USE_FOR_DC_SECRET_DISPLAY.decryptFn
      }
      if (decryptFn) {
        const result = decryptFn(content)
        return result || vnodes
      }
      console.error('解密函数缺失')
      return vnodes
    },
    encode(plaintextOrVnodes) {
      let content
      if (typeof plaintextOrVnodes === 'string') {
        content = plaintextOrVnodes
      } else {
        try {
          content = this.getText(plaintextOrVnodes)
        } catch {
          /*  */
        }
        if (!content) return plaintextOrVnodes
      }

      if (/^\d{4}-/.test(content)) { // 特殊的固话，比如0580-203979
        return content.replace(/^(\d{4})-\d*(\d{4})$/, '$1****$2')
      }

      // 字符替换
      switch (content.length) {
        case 11:// 手机号
          return content.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
        case 18:// 身份证
          return content.replace(/^(\d)\d{3}(\d{8})\d{5}(.)$/, '$1***$2*****$3')
        case 8:// 固话
        case 12:// 固话
          return content.replace(/^(\d{4}-?)?\d{4}(\d{4})$/, '$1***$2')
        default: {
          const displayLength = Math.floor(content.length / 3)
          const reg = new RegExp(`^(\\d{${displayLength}})(.*)(\\d{${displayLength}})$`)
          if (reg.test(content)) {
            return content.replace(reg, ($0, $1, $2, $3) => $1 + (''.padStart($2.length, '*')) + $3)
          }
          return plaintextOrVnodes
        }
      }
    },
    createContent() {
      let defaultSlot = typeof this.$slots.default === 'function' ? this.$slots.default() : this.$slots.default
      if (!defaultSlot && this.USE_FOR_DC_SECRET_DISPLAY) defaultSlot = this.USE_FOR_DC_SECRET_DISPLAY.emptyPlaceholder

      // 解密
      let plaintextOrVnodes = this.needDecrypt ? this.decrypt(defaultSlot) : defaultSlot
      // 生成展示内容
      plaintextOrVnodes = this.isDecode ? plaintextOrVnodes : this.encode(plaintextOrVnodes)

      let title
      if (typeof plaintextOrVnodes === 'string') {
        title = plaintextOrVnodes
      } else {
        try {
          title = this.getText(plaintextOrVnodes)
        } catch {
          /*  */
        }
      }

      return { title, vnode: plaintextOrVnodes }
    },
  },
  render() {
    const { title, vnode } = this.createContent()

    if (!isVue3 && this.$scopedSlots && this.$scopedSlots.custom) { // vue2
      return <span onClick={this.toggleDisplay}>{this.$scopedSlots.custom({ value: title })}</span>
    }
    if (typeof this.$slots.custom === 'function') { // vue3
      return <span onClick={this.toggleDisplay}>{this.$slots.custom({ value: title })}</span>
    }

    return <span title={title} style="cursor:pointer;" onClick={this.toggleDisplay}>{vnode}</span>
  },
}
</script>