import{e as m,m as p,f as _,_ as r,o as c,c as a,a as n,t as f,b as $,r as h}from"./index-dLdWDo_5.js";const s=m("counter",{state:()=>({count:0}),actions:{increment(){this.count+=1}}}),b={name:"HelloWorld",data(){return{}},methods:{...p(s,["increment"])},computed:{..._(s,["count"])}};function H(t,e,l,i,d,u){return c(),a("div",null,[n("button",{type:"button",class:"btn btn-primary",onClick:e[0]||(e[0]=(...o)=>t.increment&&t.increment(...o))},"count is "+f(t.count),1)])}const S=r(b,[["render",H]]),W={components:{HelloWorld:S}},k={class:"home"},v=n("h1",null,"首頁",-1),y=n("hr",null,null,-1);function B(t,e,l,i,d,u){const o=h("HelloWorld");return c(),a("div",k,[v,y,$(o)])}const C=r(W,[["render",B]]);export{C as default};
