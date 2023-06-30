import{_ as s,o as a,c as n,V as e}from"./chunks/framework.4810a3e9.js";const m=JSON.parse('{"title":"错误监控","description":"","frontmatter":{},"headers":[],"relativePath":"miniapp/exception.md","filePath":"miniapp/exception.md","lastUpdated":1688117440000}'),p={name:"miniapp/exception.md"},o=e(`<h1 id="错误监控" tabindex="-1">错误监控 <a class="header-anchor" href="#错误监控" aria-label="Permalink to &quot;错误监控&quot;">​</a></h1><h2 id="错误采集" tabindex="-1">错误采集 <a class="header-anchor" href="#错误采集" aria-label="Permalink to &quot;错误采集&quot;">​</a></h2><p>JavaScript异常监控的方法采用暴力埋点的方式，但是由于它会造成污染代码的后果，所以在api使用的时候会提供开关的形式来谨慎选择。默认采用劫持函数的形式。</p><p>在默认app.js中监听onLaunch、onShow、onHide、onError生命周期函数，其中在onLaunch中执行获取用户基础信息，当监控到有执行onError是就记录一次报错信息。</p><p>小程序App()生命周期里提供了onError函数，可以通过在onError里收集异常信息。</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#82AAFF;">App</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 监听错误</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#82AAFF;">onError</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">err</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">          </span><span style="color:#676E95;font-style:italic;">// 上报错误</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>`,6),l=[o];function r(t,c,i,d,y,D){return a(),n("div",null,l)}const u=s(p,[["render",r]]);export{m as __pageData,u as default};
