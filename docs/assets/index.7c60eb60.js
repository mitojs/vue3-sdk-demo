import{d as e,G as t,H as o,I as n,l as c,r as a,o as s,j as r,e as l,w as d,F as i,J as u,K as p,p as C,k as h,L as k,M as f,b as m}from"./vendor.7b286ffd.js";var y=e({components:{NButton:t,NGradientText:o,NSpace:n},setup(){const e=c(0);return{count:e,add:()=>{e.value++},sub:()=>{e.value--}}}});C("data-v-2ae0fd0e");const _=i("加 +"),g=i("减 -");h(),y.render=function(e,t,o,n,c,C){const h=a("n-gradient-text"),k=a("n-button"),f=a("n-space");return s(),r(p,null,[l(h,{type:"info"},{default:d((()=>[i(" Count :"+u(e.count),1)])),_:1}),l(f,{style:{"margin-top":"10px"}},{default:d((()=>[l(k,{type:"primary",onClick:e.add},{default:d((()=>[_])),_:1},8,["onClick"]),l(k,{onClick:e.sub},{default:d((()=>[g])),_:1},8,["onClick"])])),_:1})],64)},y.__scopeId="data-v-2ae0fd0e";var q=e({components:{NCard:k,Count:y,NButton:t,NSpace:n},setup(){const e=f();return{onUnhandledrejection:()=>{new Promise(((e,t)=>t("this is promise reject"))).then((e=>{}))},onClickCodeError:()=>{this.obj.split("")},onClickGoodRequest:()=>{const t=new XMLHttpRequest;t.open("get","https://jsonplaceholder.typicode.com/todos/1"),t.setRequestHeader("content-type","application/json"),t.send(),t.onreadystatechange=function(){4===t.readyState&&e.success("request success")}},onClickBadRequest:()=>{const t=new XMLHttpRequest;t.open("get","https://cccccc/abnormal"),t.setRequestHeader("content-type","application/json"),t.send(),t.onreadystatechange=function(){4!==t.readyState||t.response||e.error("request error")}},onClickGoodFetch:()=>{return t=this,o=null,n=function*(){fetch("https://jsonplaceholder.typicode.com/todos/1",{method:"GET"}).then((t=>{e.success("request success")}),(e=>{}))},new Promise(((e,c)=>{var a=e=>{try{r(n.next(e))}catch(t){c(t)}},s=e=>{try{r(n.throw(e))}catch(t){c(t)}},r=t=>t.done?e(t.value):Promise.resolve(t.value).then(a,s);r((n=n.apply(t,o)).next())}));var t,o,n},onClickBadFetch:()=>{fetch("http://cccccc/abnormal",{method:"GET"}).then((e=>{}),(t=>{e.error("request error")}))},onClickMitoLog:()=>{window.MitoInstance.log({message:"some msg",tag:"your tag"})}}}});const v=i("触发unhandledrejection"),j=i("触发代码错误"),b=i("触发正常xhr"),x=i("触发异常xhr"),w=i("触发正常fetch"),G=i("触发异常fetch"),R=i("手动上报");q.render=function(e,t,o,n,c,r){const i=a("Count"),u=a("n-button"),p=a("n-space"),C=a("n-card");return s(),m(C,{title:"事例页面一"},{default:d((()=>[l(i),l(p,{style:{"margin-top":"10px"}},{default:d((()=>[l(u,{onClick:e.onUnhandledrejection},{default:d((()=>[v])),_:1},8,["onClick"]),l(u,{onClick:e.onClickCodeError},{default:d((()=>[j])),_:1},8,["onClick"]),l(u,{onClick:e.onClickGoodRequest},{default:d((()=>[b])),_:1},8,["onClick"]),l(u,{onClick:e.onClickBadRequest},{default:d((()=>[x])),_:1},8,["onClick"]),l(u,{onClick:e.onClickGoodFetch},{default:d((()=>[w])),_:1},8,["onClick"]),l(u,{onClick:e.onClickBadFetch},{default:d((()=>[G])),_:1},8,["onClick"]),l(u,{onClick:e.onClickMitoLog},{default:d((()=>[R])),_:1},8,["onClick"])])),_:1})])),_:1})};export{q as default};
