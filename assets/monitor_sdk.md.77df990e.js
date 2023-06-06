import{_ as a,o as e,c as p,V as l}from"./chunks/framework.842e628d.js";const S=JSON.parse('{"title":"SDK设计","description":"","frontmatter":{},"headers":[],"relativePath":"monitor/sdk.md","filePath":"monitor/sdk.md","lastUpdated":1686024512000}'),s={name:"monitor/sdk.md"},o=l('<h1 id="sdk设计" tabindex="-1">SDK设计 <a class="header-anchor" href="#sdk设计" aria-label="Permalink to &quot;SDK设计&quot;">​</a></h1><p>和其他SDK不同，前端监控SDK基本上要求开箱即用，作为SDK的提供方，我们要在SDK中怎么写，才能做到这种开箱即用，或者对于下游开发者而言更好用。前端监控的目标各有不同，包括：测速、性能、错误、行为等方面。</p><p>SDK的设计都需要包含如下几个方面：</p><ul><li>数据收集</li><li>数据存储（日志的结构，日志是存在内存中，还是存在indexedDB中）</li><li>数据上报（上报周期：立即，延时；上报策略：什么情况下触发上报；上报压缩等）</li><li>生命周期</li><li>代码分离（快速加载主体代码，异步加载功能代码；将数据处理移到webworker中）</li></ul><p>不管你是做性能监控，还是错误监控，SDK都可以从这几个方面去思考，当然，不同场景下，不一定全部都要，但是作为成年人，我们往往全想要。</p><p>作为SDK的作者，要考虑两种场景：SDK直接被网站引用（开箱即用），或者被开发者引用（二次开发）</p><h2 id="通用sdk框架" tabindex="-1">通用SDK框架 <a class="header-anchor" href="#通用sdk框架" aria-label="Permalink to &quot;通用SDK框架&quot;">​</a></h2><p>作为框架，它的主要面向用户是开发者，它并不提供直接的功能，而是提供创建功能的底层接口，让开发者通过接口完成功能开发。抽取公共逻辑，通过⽗类定义全部功能，插件化管理功能和⽣命周期。</p><h2 id="sdk接入设计" tabindex="-1">SDK接入设计 <a class="header-anchor" href="#sdk接入设计" aria-label="Permalink to &quot;SDK接入设计&quot;">​</a></h2><p>要保证SDK接入简单，容易使用，首先要把之前首屏、白屏和卡顿采集的脚本封装在一起，并让脚本自动初始化和运行。</p><p>除了性能 SDK 自身的方案设计之外，提供帮助文档（如示例代码、 QA 列表等），也可以提高性能 SDK 的易用性。</p><p>具体来说，我们可以搭建一个简单的性能 SDK 网站，进入站点后，前端工程师可以看到使用文档，包括各种平台下如何接入，接入的示例代码是怎样的，接入性能 SDK 后去哪个 URL 看数据，遇到异常问题时怎么调试，等等。</p><p>另外，还可以设置性能分析小助手，快速定位一些基础问题。这个小助手怎么实现呢？我们在SDK 中通过检测访问页面的 URL 是不是加了调试参数（PERF_DEV_MODEL=PERF_DEV_MODEL），如果访问的页面 URL 中加了调试参数，打开页面后就可以看到一个性能分析小助手的圆形图标。通过它，前端工程师可以快速进入诊断模式，定位一些基础问题，如性能 SDK 初始化失败，采集数据异常，发送的请求参数不正确等问题。</p><h2 id="sdk-运行设计" tabindex="-1">SDK 运行设计 <a class="header-anchor" href="#sdk-运行设计" aria-label="Permalink to &quot;SDK 运行设计&quot;">​</a></h2><p>SDK 如果想运行高效，必须有好的兼容性策略、容错机制和测试方案。</p><p>所谓兼容性策略，就是性能 SDK 可以在各个业务下都可以稳定运行。</p><p>我们知道，前端性能优化会面临的业务场景大致有：</p><ul><li>各类页面，如平台型页面、3C 类页面、中后台页面；</li><li>一些可视化搭建的平台，如用于搭建天猫双十一会场页这种用于交易运行页面的魔方系统；</li><li>各个终端，如 PC 端，移动端，小程序端等。</li></ul><p>这就要求性能 SDK 要能适应这些业务，及时采集性能指标并进行上报。那具体怎么做呢？</p><p>一般不同页面和终端，它们的技术栈也会不同，如 PC端页面使用 React，移动端页面使用 VUE 。这个时候，我们可以尽可能用原生 JavaScript 去做性能指标的采集，从而实现跨不同技术栈的采集。</p><p>不同终端方面，可以使用一个适配层来抹平采集方面的差异。具体来说，小程序端可以用有自己的采集 API，如 minaFMP，其他端可以直接用 FMP，这样在性能 SDK 初始化时，根据当前终端类型的不同，去调用各自的性能指标采集 API。</p><p>容错方面怎么做呢？</p><p>如果是性能 SDK 自身的报错，可以通过 try catch 的方式捕获到，然后上报异常监控平台。注意，不要因为 SDK 的报错而影响引入性能 SDK 页面的正常运行。</p><p>除此之外，好的自测和 QA 的测试也是性能 SDK 运行平稳的一大保障。</p><p>在开发 SDK 时，我们可以根据用户实际的浏览器和机型分布比例，确定 top10% 用户的机型和浏览器类型。然后在每次开发完成并进行代码 review 后，使用这些机型和浏览器类型进行自测。</p><p>另外，在升级性能 SDK 时，不论功能大小，为了保证不影响到所有业务方线上稳定运行，最好都进行一次冒烟测试用例。</p><h2 id="上报方式" tabindex="-1">上报方式 <a class="header-anchor" href="#上报方式" aria-label="Permalink to &quot;上报方式&quot;">​</a></h2><p>首先我们来了解下上报的几种方式：信标(Beacon API)，Ajax(XMLHttpRequest 和 fetch)，Image(GIF、PNG)；它们是现代前端中用于网络请求的三种常见方式。它们各自有不同的使用场景和优缺点。</p><ol><li>Ajax(XMLHttpRequest 和 fetch)</li></ol><p>Ajax 技术主要通过 Ajax 来实现异步请求。它的主要优势在于可以方便地发送各种类型的数据和请求，同时也支持跨域请求。在实际开发中，Ajax 技术广泛地应用于网页的交互及数据请求。然而，该方式的缺点在于无法保证每个请求都能被及时响应，而且可能会阻塞其他请求，影响浏览器的性能。</p><ol start="2"><li>Image（GIF、PNG）</li></ol><p>使用 Image 来进行网络请求，在实际开发中往往用于上报日志、统计、广告等应用场景。</p><p>用图片上报还有以下优点：</p><ul><li>图片请求方式不会出现跨域问题，因为打点域名经常不是当前域名；</li><li>防止阻塞页面加载，影响用户体验；</li><li>一般采用1*1像素的透明 gif 进行上报，因为gif图片格式体积小（最小的BMP文件需要74个字节，PNG需要67个字节，而合法的GIF，只需要43个字节）</li></ul><p>这种使用方式也存在缺陷。首先对于src 中的URL内容是有大小限制的，太大的数据量不适用。其次，在页面卸载的时候，若存在数据未发送的情况，会先将对应的数据发送完，再执行页面卸载。这种情况下，会在体验上给使用者带来不方便。</p><p><code>new Image().src = reportUrl + &#39;?msg=&#39; + msg;</code></p><blockquote><p><a href="https://mp.weixin.qq.com/s/v6R2w26qZkEilXY0mPUBCw" target="_blank" rel="noreferrer">为什么前端监控要用GIF打点</a></p></blockquote><ol start="3"><li>sendBeacon</li></ol><p>sendBeacon方法是一个异步、非阻塞的数据传输方法。具体使用方式如下：</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">navigator</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">sendBeacon </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">navigator</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">sendBeacon</span><span style="color:#A6ACCD;">(url</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> params)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>它的特点是：</p><ul><li>Beacon请求是Post方式。</li><li>Beacon请求优先避免与关键操作和更高优先级的网络请求竞争。</li><li>Beacon请求可以有效地合并，以优化移动设备上的能量使用。</li><li>Beacon保证页面卸载之前启动信标请求，并允许运行完成且不会阻塞请求或阻塞处理用户交互事件的任务。</li><li>返回值：sendBeacon 方法被执行后返回一个布尔值，true代表用户代理成功地将信标请求加入到队列中，否则返回false。</li></ul><p>对于sendBeacon方法，它的局限性体现在：</p><ul><li>不能跨域，需要服务端设置。</li><li>新特性接口，兼容性存在问题，除了IE，其余浏览器都广泛支持。</li></ul><p>看了上面的三种上报方式，最终采用 sendBeacon + xmlHttpRequest 降级上报的方式，当浏览器不支持 sendBeacon 或者 传输的数据量超过了 sendBeacon 的限制，我们就降级采用 xmlHttpRequest 进行上报数据。</p><h2 id="上报策略设计" tabindex="-1">上报策略设计 <a class="header-anchor" href="#上报策略设计" aria-label="Permalink to &quot;上报策略设计&quot;">​</a></h2><p>上报策略是指在指标采集完成后，上报到平台所采用的具体策略。比如通过 SDK 上报到平台后端，是数据直接上传还是做一些过滤处理，是全量上传数据还是抽样，是选择 H5 接口上报还是 native 接口上报，等等，这些都需要我们确定一下。</p><h3 id="日志数据过滤" tabindex="-1">日志数据过滤 <a class="header-anchor" href="#日志数据过滤" aria-label="Permalink to &quot;日志数据过滤&quot;">​</a></h3><p>在采集性能指标之后，最好先对异常数据进行过滤。</p><p>异常数据分一般有两类，第一类是计算错误导致的异常数据，比如负值或者非数值数据，第二类是合法异常值、极大值、极小值，属于网络断掉或者超时形成的数值，比如 15s 以上的首屏时间。</p><p>负值的性能指标数据影响很大，它会严重拖低首屏时间，也会把计算逻辑导致负值的问题给掩盖掉。</p><p>还有首屏时间是非数值数据的时候也非常麻烦，比如首屏时间是 “200”，我这里使用引号是因为它是字符串类型，在采集过程中计算时，遇到加法时，会出现 “200”+30=20030，而不是你预期的 230 的情况。遇到负值数据和非数值数据后，用程序打印日志记录，并上报到错误异常平台。</p><h3 id="数据抽样策略" tabindex="-1">数据抽样策略 <a class="header-anchor" href="#数据抽样策略" aria-label="Permalink to &quot;数据抽样策略&quot;">​</a></h3><p>性能 SDK 上报数据是全量还是抽象，需要根据本身 App 或者网站的日活来确定，如果日活10万以下，那抽样就没必要了。如果是一款日活千万的 App，那就需要进行数据抽样了，因为如果上报全量日志的话，会耗费大量用户的流量和请求带宽。</p><p>除了在 SDK 里面设置抽样策略，业界还有通过服务器端下发数据抽样率的方式，来动态控制客户端向服务器端上报性能数据的量。比如，双十二运营活动当天，日活跃用户激增，抽样率由10%降低到5%，可以大大降低运营活动时统计服务器的负载。</p><h3 id="上报机制选择" tabindex="-1">上报机制选择 <a class="header-anchor" href="#上报机制选择" aria-label="Permalink to &quot;上报机制选择&quot;">​</a></h3><p>一般，为了节省流量，性能 SDK 也会根据网络能力，选择合适的上报机制。在强网环境（如 4G/WIFI），直接进行上报；在弱网（2G/3G）下，将日志存储到本地，延时到强网下再上报。</p><p>除了网络能力，我们还可以让 SDK 根据 App 忙碌状态，选择合适的上报策略。如果 App 处于空闲状态，直接上报；如果处于忙碌状态，等到闲时（比如凌晨 2-3 点）再进行上报。</p><p>除此之外，还有一些其他的策略，如批量数据上报，默认消息数量达到 30 条才上报，或者只在 App 启动时上报等策略，等等。你可以根据实际情况进行选择。</p><p>在上报能力选择方面，由于使用 native 接口上报时，SDK 可以复用客户端的请求连接，采取延时上报或者批量上报等策略。所以虽然我们支持 H5 和 native 两种接口上报方式，但实际工作中建议优先使用 native 接口进行数据上报。</p>',60),t=[o];function n(i,r,c,d,D,h){return e(),p("div",null,t)}const m=a(s,[["render",n]]);export{S as __pageData,m as default};
