import{a as d}from"./axios-L6U4YIEh.js";import{_ as c,o as m,c as u,a as e,l as _,k as i,v as l}from"./index-vr-Mh3ZQ.js";var p={VITE_APP_API_URL:"https://vue3-course-api.hexschool.io/v2",VITE_APP_API_NAME:"yuling2023",BASE_URL:"/2024vue-w6-2/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};const{VITE_APP_API_URL:f}=p,h={data(){return{user:{username:"",password:""}}},methods:{login(){d.post(`${f}/admin/signin`,this.user).then(o=>{const{expired:s,token:r}=o.data;document.cookie=`hexToken=${r}; expires=${new Date(s)}`,this.$router.push("/admin")}).catch(o=>{console.log(o)})}}},w={class:"container my-5"},b={class:"row justify-content-center"},g=e("h1",{class:"h3 mb-3 font-weight-normal text-center"},"請先登入",-1),v={class:"col-8"},x={class:"form-floating mb-3"},P=e("label",{for:"username"},"Email address",-1),E={class:"form-floating"},y=e("label",{for:"password"},"Password",-1),A=e("button",{class:"btn btn-lg btn-primary w-100 mt-3",type:"submit",id:"login"}," 登入 ",-1),V=e("a",{class:"btn btn-lg btn-dark w-100 mt-3",type:"button",href:"index.html"}," 回前台 ",-1),k=e("p",{class:"mt-5 mb-3 text-muted text-center"},"© 2021~∞ - 六角學院",-1);function I(o,s,r,D,n,a){return m(),u("div",w,[e("div",b,[g,e("div",v,[e("form",{id:"form",class:"form-signin",onSubmit:s[2]||(s[2]=_((...t)=>a.login&&a.login(...t),["prevent"]))},[e("div",x,[i(e("input",{type:"email",class:"form-control","onUpdate:modelValue":s[0]||(s[0]=t=>n.user.username=t),id:"username",placeholder:"name@example.com",required:"",autocomplete:"username"},null,512),[[l,n.user.username]]),P]),e("div",E,[i(e("input",{type:"password",class:"form-control","onUpdate:modelValue":s[1]||(s[1]=t=>n.user.password=t),id:"password",placeholder:"Password",required:"",autocomplete:"current-password"},null,512),[[l,n.user.password]]),y]),A,V],32)])]),k])}const U=c(h,[["render",I]]);export{U as default};