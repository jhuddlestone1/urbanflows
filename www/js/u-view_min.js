// u-view.js v0.1; 2019 Jamie Huddlestone
function u(e,t,n,r){let i=u;i.views||(i.views={},addEventListener("hashchange",()=>i(i.views[location.hash.slice(1)])));let c=e=>null!=e?e.constructor?e.constructor.name:"Object":e;switch(c(e)){case"Object":case"Array":let a=(e,i)=>{let c=document.createElement(r||"view");return c.container=t||"body",c.id=n||"default",c.name=i,c.innerHTML=e,c};for(let t in e)i.views[t]=a(e[t].toString(),t);return i.views;case"Promise":return e.then(e=>i(e,t,n,r));case"String":case"Number":let o=e.toString().replace(/^#/,"");return n&&(i.views[o].id=n),t&&(i.views[o].container=t),location.hash==="#"+o&&location.replace("#"),location.replace("#"+o),i.views[o];default:n&&(e.id=n),t&&(e.container=t),"String"===c(e.container)&&(e.container=document.querySelector(e.container));let l=document.getElementById(e.id);return l&&l.remove(),i.active=e.container.appendChild(e)}}