  
# dc-secret-display

## props
|属性|类型|默认值|说明|
|-|-|-|-|
|needDecrypt|Boolean|false|文本是否需要解密|
|decryptFn|Function|null|自定义解密函数，默认使用`vue`全局下挂载的解密函数|

### `vue`全局下挂载参数

```javascript
// Vue2
Vue.prototype.USE_FOR_DC_SECRET_DISPLAY = {
  // 解密函数
  decryptFn:()=>{},
  // 当无内容时的占位字符
  emptyPlaceholder:''
}

// Vue3
app.config.globalProperties.USE_FOR_DC_SECRET_DISPLAY = {
  // 解密函数
  decryptFn:()=>{},
  // 当无内容时的占位字符
  emptyPlaceholder:''
}
```

## slot
|插槽名称|说明|
|-|-|
|default|要控制的文本，插槽内不支持html标签嵌套|

## scoped slot
|插槽名称|说明|
|-|-|
|custom|自定义内容，scope提供一个`{value:string}`结构的对象|

## 用法

```html
<!-- 输出的html: --> 
<!-- <span title="138****7722" style="cursor: pointer;">138****7722</span> -->
<dc-secret-display needDecrypt>
  R5+U51D1BkGfSuJwLbkN+Q==
</dc-secret-display>

<!-- 输出的html: --> 
<!-- <span title="138****7722" style="cursor: pointer;">138****7722</span> -->
<dc-secret-display>
  13800007722
</dc-secret-display>

<!-- 输出的html: --> 
<!-- <span> this is custom scoped slot:138****7722 </span> -->
<dc-secret-display needDecrypt>
  R5+U51D1BkGfSuJwLbkN+Q==
  <template #custom="scope">
    this is custom scoped slot:{{ scope.value }}
  </template>
</dc-secret-display>

<!-- 输出的html: --> 
<!-- <span> this is custom scoped slot:138****7722 </span> -->
<dc-secret-display>
  13800007722
  <template #custom="scope">
    this is custom scoped slot:{{ scope.value }}
  </template>
</dc-secret-display>

```

***

当
```javascript
USE_FOR_DC_SECRET_DISPLAY = {
  // 解密函数
  decryptFn:()=>{},
  // 当无内容时的占位字符
  emptyPlaceholder:'-x-'
}
```
时，
```html
<!-- 输出的html: --> 
<!-- <span title="-x-" style="cursor: pointer;">-x-</span> -->
<dc-secret-display></dc-secret-display>
```
***