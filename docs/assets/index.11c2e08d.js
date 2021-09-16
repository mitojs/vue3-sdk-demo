import {
  d as e,
  a,
  b as t,
  o as n,
  h as o,
  p as s,
  j as l,
  k as c,
  l as r,
  m as u,
  n as i,
  q as d,
  s as m,
  t as p,
  u as v,
  v as f,
  x as b,
  y as h,
  z as g,
  A as w,
  c as y,
  B as k,
  C as _,
  r as C,
  w as N,
  D as I,
  E as x,
} from './vendor.8bacee9c.js'
const j = { xmlns: 'http://www.w3.org/2000/svg', 'xmlns:xlink': 'http://www.w3.org/1999/xlink', viewBox: '0 0 1024 1024' },
  S = t(
    'path',
    {
      d: 'M511.6 76.3C264.3 76.2 64 276.4 64 523.5C64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9c26.4 39.1 77.9 32.5 104 26c5.7-23.5 17.9-44.5 34.7-60.8c-140.6-25.2-199.2-111-199.2-213c0-49.5 16.3-95 48.3-131.7c-20.4-60.5 1.9-112.3 4.9-120c58.1-5.2 118.5 41.6 123.2 45.3c33-8.9 70.7-13.6 112.9-13.6c42.4 0 80.2 4.9 113.5 13.9c11.3-8.6 67.3-48.8 121.3-43.9c2.9 7.7 24.7 58.3 5.5 118c32.4 36.8 48.9 82.7 48.9 132.3c0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9c177.1-59.7 304.6-227 304.6-424.1c0-247.2-200.4-447.3-447.5-447.3z',
      fill: 'currentColor',
    },
    null,
    -1
  )
var B = e({
  name: 'GithubOutlined',
  render: function (e, t) {
    return n(), a('svg', j, [S])
  },
})
const L = {}
s('data-v-242aadca')
const M = { class: 'logo-container' }
l(),
  (L.render = function (e, a) {
    return n(), o('div', M, 'mitojs-vue3-demo')
  }),
  (L.__scopeId = 'data-v-242aadca')
var G = L,
  O = e({
    setup() {
      const e = c()
      let a = null
      return (
        r(() => {
          let t = -1
          a = setInterval(() => {
            var a
            const n = window.MitoInstance.breadcrumb,
              o = n.getStack().length
            o !== t &&
              ((t = o),
              (null == (a = null == e ? void 0 : e.value) ? void 0 : a.contentWindow) &&
                e.value.contentWindow.postMessage(
                  { type: 'breadcrumb', data: JSON.parse(JSON.stringify(n.getStack())) },
                  'https://mitojs.github.io/mito-admin-demo/#/breadcrumbDemo'
                ))
          }, 1e3)
        }),
        u(() => {
          a && clearInterval(a)
        }),
        { iframeRef: e }
      )
    },
  })
s('data-v-579f78ea')
const J = { ref: 'iframeRef', class: 'iframeWrapper', src: 'https://mitojs.github.io/mito-admin-demo/#/breadcrumbDemo', frameborder: '0' }
l(),
  (O.render = function (e, a, t, s, l, c) {
    return n(), o('iframe', J, null, 512)
  }),
  (O.__scopeId = 'data-v-579f78ea')
const z = [
  { label: '示例页面一', key: 'page-one' },
  { label: '示例页面二', key: 'page-two' },
]
var D = e({
  components: {
    NLayoutSider: i,
    NLayout: d,
    NLayoutHeader: m,
    Logo: G,
    NIcon: p,
    NBackTop: v,
    GithubOutlined: B,
    NMenu: f,
    NAlert: b,
    IframeBreadcurmb: O,
    NLayoutContent: h,
  },
  setup(e) {
    const a = g(),
      t = w(),
      n = c(a.name),
      o = y(() => _(n))
    return (
      k(
        () => a.fullPath,
        () => {
          n.value = a.name
        }
      ),
      {
        menus: z,
        onMenuClick: e => {
          ;/http(s)?:/.test(e) ? window.open(e) : t.push(e)
        },
        getSelectedKeys: o,
      }
    )
  },
  methods: {
    onJumpGithub() {
      window.open('https://github.com/mitojs/mitojs', '_blank')
    },
  },
})
s('data-v-3453b0f0')
const W = { class: 'layout-content' },
  A = x(' 右侧的Breadcrumb组件会实时打印的你操作行为。控制台会打印当前收集的信息 '),
  K = { class: 'container' },
  R = { class: 'page-container' },
  U = { class: 'table-container' }
l(),
  (D.render = function (e, o, s, l, c, r) {
    const u = C('Logo'),
      i = C('n-menu'),
      d = C('n-layout-sider'),
      m = C('GithubOutlined'),
      p = C('n-icon'),
      v = C('n-layout-header'),
      f = C('n-alert'),
      b = C('router-view'),
      h = C('IframeBreadcurmb'),
      g = C('n-layout-content'),
      w = C('n-back-top'),
      y = C('n-layout')
    return (
      n(),
      a(
        y,
        { class: 'layout', 'has-sider': '' },
        {
          default: N(() => [
            t(
              d,
              { width: '200', class: 'layout-sider' },
              {
                default: N(() => [
                  t(u),
                  t(i, { value: e.getSelectedKeys, 'onUpdate:value': e.onMenuClick, options: e.menus }, null, 8, ['value', 'onUpdate:value', 'options']),
                ]),
                _: 1,
              }
            ),
            t(y, null, {
              default: N(() => [
                t(
                  v,
                  { class: 'layout-header', position: 'static' },
                  {
                    default: N(() => [t(p, { onClick: e.onJumpGithub, size: '40', class: 'header-logo' }, { default: N(() => [t(m)]), _: 1 }, 8, ['onClick'])]),
                    _: 1,
                  }
                ),
                t(g, null, {
                  default: N(() => [
                    I('main', W, [
                      t(f, { style: { 'margin-bottom': '14px' }, title: '提示信息', type: 'info' }, { default: N(() => [A]), _: 1 }),
                      I('div', K, [I('div', R, [t(b)]), I('div', U, [t(h)])]),
                    ]),
                  ]),
                  _: 1,
                }),
                t(w, { right: 100 }),
              ]),
              _: 1,
            }),
          ]),
          _: 1,
        }
      )
    )
  }),
  (D.__scopeId = 'data-v-3453b0f0')
export { D as default }
