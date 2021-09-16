import {
  d as a,
  F as t,
  G as n,
  H as e,
  k as s,
  r as o,
  o as r,
  h as u,
  b as d,
  w as c,
  E as l,
  I as p,
  J as i,
  p as f,
  j as C,
  K as v,
  a as _,
} from './vendor.8bacee9c.js'
var m = a({
  components: { NButton: t, NGradientText: n, NSpace: e },
  setup() {
    const a = s(0)
    return {
      count: a,
      add: () => {
        a.value++
      },
      sub: () => {
        a.value--
      },
    }
  },
})
f('data-v-2ae0fd0e')
const b = l('加 +'),
  k = l('减 -')
C(),
  (m.render = function (a, t, n, e, s, f) {
    const C = o('n-gradient-text'),
      v = o('n-button'),
      _ = o('n-space')
    return (
      r(),
      u(
        i,
        null,
        [
          d(C, { type: 'info' }, { default: c(() => [l(' Count :' + p(a.count), 1)]), _: 1 }),
          d(
            _,
            { style: { 'margin-top': '10px' } },
            {
              default: c(() => [
                d(v, { type: 'primary', onClick: a.add }, { default: c(() => [b]), _: 1 }, 8, ['onClick']),
                d(v, { onClick: a.sub }, { default: c(() => [k]), _: 1 }, 8, ['onClick']),
              ]),
              _: 1,
            }
          ),
        ],
        64
      )
    )
  }),
  (m.__scopeId = 'data-v-2ae0fd0e')
var x = a({ components: { NCard: v, Count: m } })
x.render = function (a, t, n, e, s, u) {
  const l = o('Count'),
    p = o('n-card')
  return r(), _(p, { title: '示例页面一' }, { default: c(() => [d(l)]), _: 1 })
}
export { x as default }
