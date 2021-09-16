import { d as a, K as n, F as t, A as o, r as s, o as e, a as r, w as u, b as c, E as p } from './vendor.8bacee9c.js'
var d = a({
  components: { NCard: n, NButton: t },
  setup() {
    const a = o()
    return {
      onJump: () => {
        a.push('page-one')
      },
    }
  },
})
const i = p('跳转到示例页面一')
d.render = function (a, n, t, o, p, d) {
  const l = s('n-button'),
    m = s('n-card')
  return (
    e(),
    r(m, { title: '示例页面二' }, { default: u(() => [c(l, { onClick: a.onJump, type: 'primary' }, { default: u(() => [i]), _: 1 }, 8, ['onClick'])]), _: 1 })
  )
}
export { d as default }
