const ERA_ORDER = ["远古时代", "古典时期", "中世纪", "文艺复兴时期", "工业时代", "现代", "原子能时代", "信息时代", "未来时代"];
const GP_TYPE_ORDER = ["大科学家", "大艺术家", "大作家", "大音乐家", "大工程师", "大商人", "大将军", "海军统帅", "大预言家", "总指挥"];
const UNLOCK_CATEGORIES = [
  {id:"units", label:"单位", icon:"⚔"},
  {id:"buildings", label:"建筑", icon:"▤"},
  {id:"districts", label:"区域", icon:"⬡"},
  {id:"improvements", label:"改良设施与道路", icon:"⌁"},
  {id:"governments", label:"政体与政策卡", icon:"☷"}
];
const META = {
  tech: {title: "科技树", kicker: "研究路线", label: "科技", key: "technologies"},
  civic: {title: "文化树", kicker: "市政路线", label: "市政", key: "civics"},
  wonder: {title: "奇观", kicker: "世界奇观", label: "奇观", key: "wonders"},
  unlock: {title: "其他解锁", kicker: "单位 · 建筑 · 区域 · 改良设施 · 政体政策", label: "解锁条目", key: "unlocks"},
  leader: {title: "领袖", kicker: "文明与能力", label: "领袖", key: "leaders"},
  greatperson: {title: "伟人", kicker: "伟人能力与巨作", label: "伟人", key: "greatPeople"},
  concept: {title: "游戏机制", kicker: "玩法速查", label: "机制", key: "concepts"},
  map: {title: "地图", kicker: "地形 · 地貌 · 资源", label: "地图", key: "mapFeatures"},
  feature: {title: "地形与地貌", kicker: "地图资料", label: "地形", key: "mapFeatures"},
  resource: {title: "资源", kicker: "地图资料", label: "资源", key: "resources"},
  citystate: {title: "城邦", kicker: "使者奖励与宗主国加成", label: "城邦", key: "cityStates"}
};
const TONES = {
  tech:["#25566a","#173847","#bcecf8","#6db7cc"],
  civic:["#493e65","#292f48","#e2d4ff","#9682bf"],
  wonder:["#5f482a","#342d2b","#ffe2a8","#bb9254"],
  military:["#632c3b","#302a37","#ffd0c9","#bc7780"],
  economic:["#624b1e","#342f2b","#ffe0a1","#bd9952"],
  diplomatic:["#21533f","#1b343b","#b8edce","#65aa86"],
  wildcard:["#4a3862","#2e2d43","#dfcafa","#a287c8"],
  greatpolicy:["#3c4c68","#253544","#d2ddff","#839ac7"],
  golden:["#67502a","#3a302a","#ffe7a9","#c7a96a"],
  darkpolicy:["#3e4455","#252d3c","#d5dded","#8291ab"],
  melee:["#6a4229","#342c2c","#ffcf9d","#b98759"],
  anticav:["#4d5731","#30372e","#e0e9ac","#98ab70"],
  ranged:["#285873","#203847","#c1e9ff","#6ca8c6"],
  cavalry:["#493e65","#292f48","#e2d4ff","#9682bf"],
  scout:["#2d5b50","#22383a","#bcefd3","#72b29a"],
  siege:["#605044","#342f32","#f1d5b9","#ac8f78"],
  naval:["#29667a","#24465a","#bfeaff","#77bfd2"],
  air:["#36566a","#273848","#d1e9f7","#84abc5"],
  city:["#52502f","#32332e","#e6e2ad","#a9a26c"],
  campus:["#345773","#23384d","#c7e6ff","#7aa9cf"],
  harbor:["#29667a","#24465a","#bfeaff","#77bfd2"],
  holy:["#544469","#302f46","#e8d8ff","#a38ac2"],
  theater:["#62405f","#382f45","#f2d3ed","#b987b1"],
  industry:["#64503a","#39322e","#f4dbb9","#b8a079"],
  commerce:["#5e512e","#37342b","#f5e3a8","#afa16a"],
  improvement:["#2d5b50","#22383a","#bcefd3","#72b29a"],
  route:["#455a63","#283a43","#d5e7ed","#8faeb6"],
  leader:["#4b3d62","#2c3044","#e3d5fb","#9e8ac0"],
  greatperson:["#3e4c67","#243746","#d5e1ff","#869ac6"],
  concept:["#355263","#233743","#d1e8f0","#7fa9b8"],
  terrainGreen:["#2c6048","#203d3c","#d3f1d4","#80b694"],
  terrainArid:["#70552e","#3e392d","#f8dfa9","#bba169"],
  terrainCold:["#385b69","#29404b","#d5edf5","#8eafbd"],
  terrainWater:["#285d73","#1d3d50","#c7ecfa","#78b5ce"],
  terrainRock:["#55535c","#33353d","#e3dfe7","#a2a0ae"],
  resourceBonus:["#45633b","#2b4033","#e0f1c6","#9bbd7b"],
  resourceLuxury:["#66502e","#39342d","#ffe4a7","#c8a461"],
  resourceStrategic:["#5b4438","#332e32","#f4d3bd","#ac8979"],
  resourceSpecial:["#4a3b65","#2e3047","#e6d7ff","#a38ec6"]
};
function unitRole(item) {
  return item.features?.flatMap(group=>group.items).find(row=>row.text.startsWith("单位类型："))?.text.slice(5) || "";
}
function itemTone(type,item) {
  if (type==="citystate") return ({军事:"military",宗教:"holy",工业:"industry",科技:"campus",贸易:"commerce",文化:"theater"})[item.type] || "concept";
  if (type==="resource") return ({加成:"resourceBonus",奢侈品:"resourceLuxury",战略:"resourceStrategic",特殊:"resourceSpecial",文物:"resourceSpecial"})[item.type] || "resourceBonus";
  if (type==="feature") {
    if (item.kind==="自然奇观") return "wonder";
    if (/coast|ocean|reef/.test(item.id)) return "terrainWater";
    if (/desert|floodplains/.test(item.id)) return "terrainArid";
    if (/tundra|snow|ice/.test(item.id)) return "terrainCold";
    if (/mountain|volcano/.test(item.id)) return "terrainRock";
    return "terrainGreen";
  }
  if (type!=="unlock") return type;
  if (item.category==="governments") return ({军事政策:"military",经济政策:"economic",外交政策:"diplomatic",通配符政策:"wildcard",伟人政策:"greatpolicy",黄金时代政策:"golden",黑暗时代政策:"darkpolicy"})[item.group] || "civic";
  if (item.category==="units") {
    const role=unitRole(item);
    if (role.includes("海军")) return "naval";
    if (role.includes("抗骑兵")) return "anticav";
    if (role.includes("近战")) return "melee";
    if (role.includes("远程")) return "ranged";
    if (role.includes("骑兵")) return "cavalry";
    if (role.includes("侦察")) return "scout";
    if (role.includes("攻城")) return "siege";
    if (role.includes("空中")||role.includes("天空")) return "air";
    return item.group==="海上战争"?"naval":item.group==="空战"?"air":"scout";
  }
  if (item.category==="buildings") return ({港口:"harbor",学院:"campus",圣地:"holy",剧院广场:"theater",工业区:"industry",商业中心:"commerce",市中心:"city",军营:"military",水上乐园:"harbor",娱乐中心:"theater"})[item.group] || "city";
  if (item.category==="districts") return item.id.includes("harbor")||item.id.includes("cothon")||item.id.includes("dockyard")?"harbor":"campus";
  if (item.category==="improvements") return item.group==="路线"?"route":"improvement";
  return "concept";
}
function toneStyle(type,item) {
  const [from,to,accent,border]=TONES[itemTone(type,item)] || TONES.concept;
  return `style="--tone-from:${from};--tone-to:${to};--tone-accent:${accent};--tone-border:${border}"`;
}
const entryImage = item => `<img class="entry-icon" src="./images/${esc(item.id)}.png" alt="" loading="lazy">`;
const CONCEPT_BASE = "https://www.civilopedia.net/zh-CN/gathering-storm/concepts/";
const concepts = [
  {id:"city",name:"城市选址",summary:"淡水、可用地块和周边资源决定城市的成长空间。定居前先看河流、湖泊与以后要放置的区域。",tip:"淡水通常让新城拥有更充裕的初始住房。",source:CONCEPT_BASE+"cities_3/"},
  {id:"district",name:"区域与相邻加成",summary:"区域占用地图单元格，并依周围地形、资源、奇观及其他区域获得不同相邻加成。规划时预留位置。",tip:"先看区域的放置限制，再比较相邻加成。",source:CONCEPT_BASE+"cities_10/"},
  {id:"boost",name:"尤里卡与鼓舞",summary:"完成指定行动可为对应科技或市政增加研究进度。各条目的提升条件可在两棵树中直接查看。",tip:"提前完成提升条件，可以减少研究所需回合。",source:CONCEPT_BASE+"science_3/"},
  {id:"housing",name:"住房与人口",summary:"城市依靠食物增长；住房不足会拖慢人口增长。淡水、建筑、区域与改良设施都可能提供住房。",tip:"有食物却不涨人口时，先检查住房。",source:CONCEPT_BASE+"cities_14/"},
  {id:"amenity",name:"宜居度",summary:"宜居度反映城市居民的满意程度，来自奢侈品、娱乐设施等来源，并影响城市表现。",tip:"扩张城市时留意奢侈品与娱乐设施的覆盖范围。",source:CONCEPT_BASE+"cities_17/"},
  {id:"loyalty",name:"忠诚度",summary:"城市忠诚度受附近人口、总督与政策等影响；忠诚度耗尽的城市会脱离原文明。",tip:"边境新城尤其需要关注附近其他文明的人口压力。",source:CONCEPT_BASE+"loyalty_1/"},
  {id:"era",name:"时代分数",summary:"历史时刻提供时代分数。达到时代门槛后，文明可进入黄金时代；未达到则可能进入黑暗时代。",tip:"查看当前时代剩余回合与所需分数。",source:CONCEPT_BASE+"golden_ages_1/"},
  {id:"government",name:"政体与政策卡",summary:"政体决定可用的政策槽类型及数量；政策卡能按当前目标强化经济、军事、外交等能力。",tip:"完成市政后检查新开放的政体和政策卡。",source:CONCEPT_BASE+"govt_1/"},
  {id:"citystate",name:"城邦与使者",summary:"派遣使者可以获得城邦奖励；成为宗主国后还能获得该城邦的特殊加成。",tip:"不同城邦类型提供不同方向的收益。",source:CONCEPT_BASE+"citystates_3/"},
  {id:"trade",name:"贸易路线",summary:"商人连接城市后持续带来收益，并可建立贸易站。国内与国际路线提供的收益侧重点不同。",tip:"出发前比较路线收益与目的地。",source:CONCEPT_BASE+"trade_5/"},
  {id:"greatpeople",name:"伟人",summary:"区域与建筑等来源积累伟人点数；招募的伟人会提供依人物而异的效果。",tip:"查看伟人面板，决定哪些城市要重点产生伟人点数。",source:CONCEPT_BASE+"greatpeople_2/"},
  {id:"religion",name:"宗教传播",summary:"创立宗教后，宗教单位和城市压力会传播信仰。宗教胜利需要让其他文明多数城市信奉你的宗教。",tip:"留意圣地、信仰值与宗教单位的配合。",source:CONCEPT_BASE+"faith_6/"},
  {id:"culture-victory",name:"文化胜利",summary:"我方国际游客总数超过其他任一文明的国内游客数，即可取得文化胜利。",tip:"对照胜利面板中最高的对手国内游客数，再决定怎样提高旅游业绩。",source:CONCEPT_BASE+"victory_4/"},
  {id:"science-victory",name:"科技胜利",summary:"完成太空竞赛项目后，风云变幻规则集还需让系外行星远征抵达目的地。",tip:"高科技值与高生产力城市都很关键。",source:CONCEPT_BASE+"victory_3/"},
  {id:"diplomacy-victory",name:"外交胜利",summary:"通过世界议会及其他来源积累外交胜利点数，达到目标即可获胜。",tip:"关注外交支持与能提供胜利点数的事件或奇观。",source:CONCEPT_BASE+"diplomatic_victory/"},
  {id:"power",name:"电力与气候",summary:"部分后期建筑依靠电力工作；发电方式会影响资源消耗与全球气温。",tip:"规划工业区供电范围时，也要考虑能源来源。",source:CONCEPT_BASE+"power/"}
];
const CONCEPT_DETAILS = {
  city:{facts:["优先比较淡水、食物、生产力与可改良资源；丘陵城市还有防御优势。","定居前预留学院、圣地、工业区等区域位置，避免后期相邻加成被占用。","开拓者滤镜能显示水源和无法定居的单元格。"]},
  district:{facts:["普通特色区域的数量受城市人口限制：1、4、7 人口依次可建 1、2、3 个，此后每增加 3 人口再多 1 个。","水渠、社区和宇航中心不占上述人口名额；部分区域还有特殊地形或位置限制。","学院靠山脉、雨林和部分地貌获得相邻加成；具体数值可打开区域条目核对。"]},
  boost:{facts:["尤里卡和鼓舞是研究进度提升，触发条件列在科技与市政条目中。","提升可能来自地图行动，也可能来自伟人、间谍、研究协议等效果。","接近完成研究时先看尚未触发的提升条件，决定是否切换研究项目。"]},
  housing:{facts:["住房不足会压低城市人口增长速度；淡水是新城住房的重要基础。","粮仓、下水道、部分区域建筑及农场等改良设施都能增加住房。","住房与食物要一起看：有充足食物但增长缓慢时，先检查住房上限。"]},
  amenity:{facts:["奢侈品、娱乐设施、部分政策、奇观和伟人可以提供宜居度。","每一种不同奢侈品通常把宜居度分给最需要的 4 座城市，同一种资源的重复份额不会简单叠加。","厌战情绪和破产会降低宜居度；扩张与长期战争时要留出余量。"]},
  loyalty:{facts:["忠诚度在 0 到 100 之间；低于 75 与低于 25 时城市表现会逐级受损，降至 0 会成为自由城市。","附近 9 格内的人口会产生忠诚压力，距离越远影响越弱；黄金、黑暗时代会改变人口压力。","总督、宜居度和驻军等能帮助边境城市稳定；查看忠诚度滤镜可判断压力来源。"]},
  era:{facts:["历史时刻带来时代分数。达到黄金时代门槛进入黄金时代，未达到普通时代门槛则进入黑暗时代。","黄金时代和黑暗时代会影响忠诚压力，并提供不同的着力点或政策选择。","黑暗时代之后若达到黄金时代门槛，可进入英雄时代并选择更多着力点。"]},
  government:{facts:["政体决定军事、经济、外交与通配符槽位的组合，并提供自身加成。","政策卡需先经市政解锁，再放入对应槽位；可在“其他解锁”的政体与政策卡分类查看效果。","切换回此前采用过的政体会引发无政府状态，调整前先核对当前计划。"]},
  citystate:{facts:["首次发现城邦的文明可得到一位使者；城邦还会发布任务。","不同城邦类型与使者数量对应不同奖励；取得最多使者并满足要求后可成为宗主国。","使者配置会随着竞争变化，重要城邦可在城邦面板追踪。"]},
  trade:{facts:["贸易路线的收益发给出发城市，并受目的地的区域、建筑及沿途贸易站影响。","国内路线与国际路线的收益侧重点不同；派遣商人前比较每条路线。","贸易路线还会传播宗教压力，并影响与对方文明的旅游业绩。"]},
  greatpeople:{facts:["每种伟人有独立的伟人点数，区域、建筑和城市项目都可提供对应点数。","可用金币或信仰值资助伟人；所需费用取决于招募门槛和已积累的点数。","同类型同一时代的具体伟人出现顺序随机；本百科列表仅为查阅排序。"]},
  religion:{facts:["传教士、使徒、上师和审判官用信仰值购买，承担传播、治疗或清除其他宗教等不同职责。","某宗教信徒超过城市人口半数且为信徒最多的宗教时，该宗教成为城市主流宗教。","拥有主流宗教的城市会对周围城市施加宗教压力；贸易路线和宗教单位能进一步传播。"]},
  "culture-victory":{rule:"我方国际游客总数 > 其他文明中最高的国内游客数",facts:["国际游客是从其他文明吸引来的总和；胜利目标等于当前最高对手的国内游客数再加 1。","巨作、遗物、文物、奇观、国家公园和海滨度假区等能带来旅游业绩；开放边界与贸易路线也会影响吸引力。","对手更多会增加潜在游客来源，也可能出现国内游客更多的竞争者；文明数量本身不保证更容易取胜。","团队模式下，须由一名队友独自满足国际游客要求，队友之间不能合并游客数。"]},
  "science-victory":{facts:["先研究并建造宇航中心，依次推进卫星、登月、火星殖民等太空项目。","风云变幻规则集中，完成火星阶段后还需启动系外行星远征，并让飞船抵达目标。","太空项目依赖高生产力城市；后期可使用激光站项目加快飞船速度。"]},
  "diplomacy-victory":{facts:["世界议会的决议、积分竞赛、部分科技、市政与奇观可提供外交胜利点数。","外交支持可用于影响议会投票；议会也可能通过扣除领先文明胜利点数的决议。","查看外交胜利面板中的当前点数和剩余门槛，安排议会投票及奇观建造。"]},
  power:{facts:["需要电力的建筑在城市供电不足时产出下降；发电厂可支援一定范围内的城市。","煤、石油和铀发电会消耗资源并影响全球气温；核电站单位资源的电力产量更高。","水电站、风力发电厂等绿色能源可提供电力而不增加化石燃料消耗。"]}
};

let db = null;
let view = "tech";
let selected = {type:"tech", id:"tech_mining"};
let query = "";
let eraFilter = "全部";
let leaderCivFilter = "全部";
let gpTypeFilter = "全部";
let gpEraFilter = "全部";
let unlockCategoryFilter = "units";
let unlockGroupFilter = "全部";
let mapKindFilter = "地形";
let resourceTypeFilter = "全部";
let cityStateTypeFilter = "全部";
let detailOpen = false;
let warriorLine = new Set();
let pocketPage = "home";
let treeLayout = "list";
let treeEraFilter = "远古时代";
let detailTrail = [];
let recentEntries = [];
const moduleSelections = {};
const POCKET_MODULES = [
  {view:"tech",icon:"◇",title:"科技树",description:"研究与解锁"},
  {view:"civic",icon:"▧",title:"文化树",description:"市政与政策"},
  {view:"wonder",icon:"✦",title:"奇观",description:"效果与建造"},
  {view:"map",icon:"◈",title:"地图",description:"地形与资源"},
  {view:"unlock",icon:"⬡",title:"其他解锁",description:"单位与建筑"},
  {view:"leader",icon:"♛",title:"领袖",description:"文明与能力"},
  {view:"citystate",icon:"▥",title:"城邦",description:"使者与宗主国"},
  {view:"greatperson",icon:"✧",title:"伟人",description:"能力与巨作"},
  {view:"concept",icon:"☷",title:"游戏机制",description:"胜利与玩法"}
];

const $ = (selector) => document.querySelector(selector);
const isPocket = () => matchMedia("(max-width: 790px)").matches;
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const typeForCategory = category => ({technologies:"tech",civics:"civic",wonders:"wonder",units:"unlock",buildings:"unlock",districts:"unlock",improvements:"unlock",governments:"unlock",greatpeople:"greatperson",leaders:"leader",features:"feature",resources:"resource",citystates:"citystate"}[category]);
const unlockCategoryName = category => UNLOCK_CATEGORIES.find(item=>item.id===category)?.label ?? category;
const items = type => type === "concept" ? concepts : type === "civilization" ? (db?.civilizations ?? []) : (db?.[META[type]?.key] ?? []);
const findItem = (type,id) => items(type).find(item => item.id === id);
const getName = (type,id) => findItem(type,id)?.name ?? id;
const viewForType = type => type==="feature"||type==="resource" ? "map" : type;
const preview = (value,max=104) => String(value ?? "").length > max ? String(value).slice(0,max-1)+"…" : String(value ?? "");
function exclusiveCivs(item) {
  return [...new Set((item.features||[]).flatMap(group=>group.items).flatMap(row=>row.links).filter(link=>link.category==="civilizations"&&link.id.startsWith("civilization_")).map(link=>link.id))];
}
function uniqueUnitsForCiv(civId) { return items("unlock").filter(item=>item.category==="units"&&exclusiveCivs(item).includes(civId)); }
function buildWarriorLine() {
  const units=new Map(items("unlock").filter(item=>item.category==="units").map(item=>[item.id,item]));
  const seen=new Set(),pending=["unit_warrior"];
  while (pending.length) {
    const id=pending.shift();
    if (seen.has(id)||!units.has(id)) continue;
    seen.add(id);
    for (const group of units.get(id).features) if (group.label==="可升级为") for (const row of group.items) for (const link of row.links) if (units.has(link.id)) pending.push(link.id);
  }
  return seen;
}
function revealCard(type,id) {
  const card=[...$("#workspace").querySelectorAll("[data-open]")].find(node=>node.dataset.open===`${type}:${id}`);
  card?.scrollIntoView({block:"center",inline:"center",behavior:"instant"});
}

function rememberEntry(type,id) {
  recentEntries=[{type,id},...recentEntries.filter(entry=>entry.type!==type||entry.id!==id)].slice(0,24);
  try { localStorage.setItem("civ6-recent",JSON.stringify(recentEntries)); } catch {}
}
function navigationSnapshot() {
  return {view,selected:{...selected},pocketPage,query,eraFilter,leaderCivFilter,gpTypeFilter,gpEraFilter,unlockCategoryFilter,unlockGroupFilter,mapKindFilter,resourceTypeFilter,cityStateTypeFilter,treeEraFilter,detail:detailOpen,scrollY:window.scrollY};
}
function selectModule(target) {
  if (!POCKET_MODULES.some(module=>module.view===target)) return;
  if (selected.id) moduleSelections[view]={...selected};
  view=target;pocketPage="module";query="";$("#search").value="";
  selected=moduleSelections[target]||{type:target,id:items(target)[0]?.id};
  closeDetail();
  history.replaceState(null,"",location.pathname+location.search);
  render();window.scrollTo({top:0,behavior:"instant"});
}
function showPocketPage(page) {
  if (!["home","recent","search"].includes(page)) return;
  pocketPage=page;query="";$("#search").value="";closeDetail();render();
  window.scrollTo({top:0,behavior:"instant"});
  if(page==="search") $("#search").focus();
}
function pocketBack() {
  if(detailOpen) {
    const previous=detailTrail.pop();
    if(previous) {
      ({view,selected,pocketPage,query,eraFilter,leaderCivFilter,gpTypeFilter,gpEraFilter,unlockCategoryFilter,unlockGroupFilter,mapKindFilter,resourceTypeFilter,cityStateTypeFilter,treeEraFilter}=previous);
      $("#search").value=query;
      history.replaceState(null,"",`#${selected.type}/${encodeURIComponent(selected.id)}`);
      closeDetail(false);render();
      if(previous.detail)openDetail();
      else window.scrollTo({top:previous.scrollY,behavior:"instant"});
    } else closeDetail();
    return true;
  }
  if(isPocket()&&pocketPage!=="home") {showPocketPage("home");return true;}
  return false;
}
function renderPocketChrome() {
  document.body.dataset.pocketPage=pocketPage;
  $("#pocket-title").textContent=pocketPage==="module"?META[view].title:pocketPage==="recent"?"最近查阅":pocketPage==="search"?"搜索百科":"文明 6 口袋百科";
  $("#pocket-back").hidden=pocketPage!=="module";
  document.querySelectorAll(".pocket-nav button").forEach(button=>{
    const active=button.dataset.pocketPage===(pocketPage==="module"?"home":pocketPage);
    button.classList.toggle("active",active);button.setAttribute("aria-current",active?"page":"false");
  });
}
function renderPocketHome() {
  const modules=POCKET_MODULES.map(module=>{
    const count=module.view==="map"?items("feature").length+items("resource").length:items(module.view).length;
    const tone=module.view==="map"?"terrainGreen":module.view==="citystate"?"diplomatic":module.view==="unlock"?"naval":module.view;
    return `<button type="button" class="pocket-module" ${toneStyle(tone,{})} data-view="${module.view}"><span class="pocket-module-icon" aria-hidden="true">${module.icon}</span><strong>${module.title}</strong><span>${module.description}</span><small>${count} 个条目</small></button>`;
  }).join("");
  const recent=recentEntries.slice(0,3).map(entry=>`<button type="button" class="pocket-recent-chip" data-open="${entry.type}:${esc(entry.id)}">${esc(getName(entry.type,entry.id))}<span>›</span></button>`).join("");
  $("#pocket-home").innerHTML=`<button type="button" class="pocket-search-launch" data-pocket-page="search"><span aria-hidden="true">⌕</span>搜索科技、资源、领袖…<small>全站搜索</small></button><div class="pocket-home-heading"><h2>百科分类</h2><p>选择一个栏目开始查阅</p></div><div class="pocket-module-grid">${modules}</div>${recent?`<section class="pocket-home-recent"><div class="pocket-home-heading"><h2>最近查阅</h2><button type="button" data-pocket-page="recent">查看全部 ›</button></div>${recent}</section>`:""}<p class="pocket-attribution">风云变幻规则集 · 含 DLC<br>资料依据文明百科整理</p>`;
}
function renderRecent() {
  $("#section-title").textContent="最近查阅";$("#section-kicker").textContent="继续阅读";
  $("#section-count").textContent=`${recentEntries.length} 个条目`;
  $("#workspace").innerHTML=recentEntries.length?`<div class="grid-list">${recentEntries.map(entry=>searchCard(entry.type,findItem(entry.type,entry.id))).join("")}</div>`:`<div class="pocket-empty"><span aria-hidden="true">◷</span><h3>还没有查阅记录</h3><p>打开词条后，它会出现在这里。</p><button type="button" class="pocket-primary" data-pocket-page="home">浏览百科</button></div>`;
}
function renderSearchStart() {
  $("#section-title").textContent="搜索百科";$("#section-kicker").textContent="按名称、效果或解锁内容查找";$("#section-count").textContent="";
  $("#workspace").innerHTML=`<div class="pocket-search-hints"><h3>试试这些关键词</h3><div class="chip-list">${["鹿","石油","政策卡","文化胜利","罗马"].map(word=>`<button type="button" class="chip" data-search-word="${word}">${word}</button>`).join("")}</div></div>`;
}

function setSelection(type,id,openOnMobile=true) {
  const item=findItem(type,id);
  if (!META[type] || !item) return;
  if (detailOpen) detailTrail.push(navigationSnapshot());
  else detailTrail=isPocket()&&pocketPage!=="module"?[navigationSnapshot()]:[];
  pocketPage="module";
  if ((type==="tech"||type==="civic")&&treeEraFilter!=="全部"&&treeEraFilter!==item.era) treeEraFilter=item.era;
  if (type==="feature") mapKindFilter=item.kind;
  if (type==="resource") {
    mapKindFilter="资源";
    if (resourceTypeFilter!=="全部" && resourceTypeFilter!==item.type) resourceTypeFilter=item.type;
  }
  if (type==="citystate" && cityStateTypeFilter!=="全部" && cityStateTypeFilter!==item.type) cityStateTypeFilter=item.type;
  if (type==="wonder" && eraFilter!=="全部" && item.era!==eraFilter) eraFilter=item.era;
  if (type==="leader" && leaderCivFilter!=="全部" && !item.civilizations.includes(leaderCivFilter)) leaderCivFilter=item.civilizations[0] ?? "全部";
  if (type==="greatperson") {
    if (gpTypeFilter!=="全部" && item.type!==gpTypeFilter) gpTypeFilter=item.type;
    if (gpEraFilter!=="全部" && item.era!==gpEraFilter) gpEraFilter=item.era;
  }
  if (type==="unlock") {
    unlockCategoryFilter=item.category;
    if (unlockGroupFilter!=="全部" && unlockGroupFilter!==item.group) unlockGroupFilter=item.group || "全部";
  }
  view = viewForType(type);
  selected = {type,id};
  rememberEntry(type,id);
  query = "";
  $("#search").value = "";
  history.replaceState(null,"",`#${type}/${encodeURIComponent(id)}`);
  render();
  requestAnimationFrame(()=>{revealCard(type,id);if(openOnMobile&&matchMedia("(max-width: 790px)").matches)openDetail();});
}

function openDetail() {
  detailOpen = true;
  $("#detail").classList.add("open");
  $("#detail").setAttribute("aria-hidden","false");
  $("#detail").setAttribute("aria-modal",String(isPocket()));
  $("#detail-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
  $("#detail").scrollTop = 0;
  $("#detail-close")?.focus();
}
function closeDetail(clearTrail=true) {
  detailOpen = false;
  $("#detail").classList.remove("open");
  $("#detail").setAttribute("aria-hidden",String(isPocket()));
  $("#detail").setAttribute("aria-modal","false");
  $("#detail-backdrop").hidden = true;
  document.body.style.overflow = "";
  if(clearTrail)detailTrail=[];
}

function render() {
  if (!db) return;
  renderPocketChrome();
  $("#detail").setAttribute("role",isPocket()?"dialog":"complementary");
  $("#detail").setAttribute("aria-hidden",String(isPocket()&&!detailOpen));
  const home=isPocket()&&pocketPage==="home";
  $("#pocket-home").hidden=!home;
  $(".section-head").hidden=home;
  $(".content-layout").hidden=home;
  if(home){renderPocketHome();return;}
  if(isPocket()&&pocketPage==="recent"){renderRecent();renderDetail();return;}
  if(isPocket()&&pocketPage==="search"&&!query){renderSearchStart();renderDetail();return;}
  document.querySelectorAll(".tabs button").forEach(button => {
    const active = button.dataset.view === view && !query;
    button.classList.toggle("active",active);
    button.setAttribute("aria-selected",String(active));
  });
  $("#section-title").textContent = query ? `搜索“${query}”` : META[view].title;
  $("#section-kicker").textContent = query ? "全站查找" : META[view].kicker;
  if (query) renderSearch();
  else if (view === "tech" || view === "civic") renderTree();
  else if (view === "wonder") renderWonders();
  else if (view === "unlock") renderUnlocks();
  else if (view === "leader") renderLeaders();
  else if (view === "greatperson") renderGreatPeople();
  else if (view === "map") renderMap();
  else if (view === "citystate") renderCityStates();
  else renderConcepts();
  renderDetail();
}

function ancestorIds(type,id,seen=new Set()) {
  const item = findItem(type,id);
  for (const parent of item?.prereq ?? []) {
    if (seen.has(parent)) continue;
    seen.add(parent);
    ancestorIds(type,parent,seen);
  }
  return seen;
}

function renderTree() {
  const list = items(view);
  const layoutControl=`<div class="pocket-tree-controls"><div class="pocket-segment" aria-label="研究路线显示方式">${[["list","按时代"],["tree","树状图"]].map(([layout,label])=>`<button type="button" data-tree-layout="${layout}" aria-pressed="${treeLayout===layout}" class="${treeLayout===layout?"active":""}">${label}</button>`).join("")}</div></div>`;
  if(isPocket()&&treeLayout==="list") {
    const eras=["全部",...ERA_ORDER.filter(era=>list.some(item=>item.era===era))];
    const filtered=list.filter(item=>treeEraFilter==="全部"||item.era===treeEraFilter);
    if(selected.type!==view||!filtered.some(item=>item.id===selected.id))selected={type:view,id:filtered[0]?.id};
    $("#section-count").textContent=`${filtered.length} / ${list.length} 项`;
    $("#workspace").innerHTML=`${layoutControl}<div class="select-filter"><label for="tree-era-filter">时代</label><select id="tree-era-filter">${eras.map(era=>`<option value="${esc(era)}" ${treeEraFilter===era?"selected":""}>${esc(era)}</option>`).join("")}</select></div><div class="pocket-research-list">${filtered.map(item=>`<button type="button" class="item-card pocket-research-card ${selected.id===item.id?"selected":""}" ${toneStyle(view,item)} data-open="${view}:${esc(item.id)}"><div class="item-card-heading">${entryImage(item)}<div><h3>${esc(item.name)}</h3><span>${item.cost||"—"} ${view==="tech"?"科技值":"文化值"} · ${esc(item.era)}</span></div><span class="pocket-card-arrow">›</span></div><p>${esc(item.boost?`${view==="tech"?"尤里卡":"鼓舞"}：${item.boost}`:"起始研究，无提升条件")}</p><div class="pocket-research-unlocks">${esc(preview(item.unlocks.map(unlock=>unlock.name).join(" · ")||"查看研究前置",65))}</div></button>`).join("")}</div>`;
    return;
  }
  const activeId = selected.type === view ? selected.id : list[0]?.id;
  if (selected.type !== view) selected = {type:view,id:activeId};
  const ancestors = ancestorIds(view,activeId);
  const oldScroll = $(".tree-scroll")?.scrollLeft ?? 0;
  const groups = ERA_ORDER.map(era => ({era,entries:list.filter(item => item.era === era)})).filter(group => group.entries.length);
  $("#section-count").textContent = `${list.length} 项 · 点击节点查看前置与解锁`;
  $("#workspace").innerHTML = `${isPocket()?layoutControl:""}<p class="summary-note">沿时代横向浏览；选择节点可高亮其研究前置。</p><div class="tree-scroll"><div class="tree-inner"><svg class="tree-edges" aria-hidden="true"></svg>${groups.map(group => `<div class="tree-column"><div class="tree-era">${esc(group.era)} <small>${group.entries.length} 项</small></div>${group.entries.map(item => {
    const wonders = item.unlocks.filter(unlock => unlock.category === "wonders" && unlock.id.startsWith("building_"));
    return `<button type="button" class="tree-card ${item.id===activeId?"selected":ancestors.has(item.id)?"ancestor":""}" ${toneStyle(view,item)} data-open="${view}:${esc(item.id)}" data-id="${esc(item.id)}"><span class="tree-card-title"><span class="tree-card-heading">${entryImage(item)}<span>${esc(item.name)}</span></span><span class="chev">›</span></span><span class="tree-card-meta">${item.cost ? `${item.cost} ${view==="tech"?"科技值":"文化值"}` : "研究项目"}${item.boost ? ` · ${esc(preview(item.boost,18))}` : ""}</span>${wonders.length ? `<span class="tree-card-unlock">✦ ${esc(wonders.map(x=>x.name).join(" · "))}</span>` : ""}</button>`;
  }).join("")}</div>`).join("")}</div></div>`;
  const scroll = $(".tree-scroll");
  scroll.scrollLeft = oldScroll;
  requestAnimationFrame(() => drawEdges(view,ancestors));
}

function drawEdges(type,ancestors) {
  const inner = $(".tree-inner");
  const svg = $(".tree-edges");
  if (!inner || !svg || (view !== "tech" && view !== "civic")) return;
  const rect = inner.getBoundingClientRect();
  svg.setAttribute("width",String(inner.scrollWidth));
  svg.setAttribute("height",String(inner.scrollHeight));
  svg.setAttribute("viewBox",`0 0 ${inner.scrollWidth} ${inner.scrollHeight}`);
  const nodes = new Map([...inner.querySelectorAll(".tree-card")].map(node => [node.dataset.id,node]));
  const active = new Set([...ancestors,selected.id]);
  const paths = [];
  for (const item of items(type)) for (const parentId of item.prereq) {
    const parent = nodes.get(parentId), child = nodes.get(item.id);
    if (!parent || !child) continue;
    const p=parent.getBoundingClientRect(),c=child.getBoundingClientRect();
    if (c.left <= p.right + 3) continue;
    const x1=p.right-rect.left,y1=p.top-rect.top+p.height/2,x2=c.left-rect.left,y2=c.top-rect.top+c.height/2;
    const mid=(x1+x2)/2;
    const highlighted = active.has(parentId) && active.has(item.id);
    paths.push(`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} C${mid.toFixed(1)} ${y1.toFixed(1)},${mid.toFixed(1)} ${y2.toFixed(1)},${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${highlighted?"#dec17d":"#77979b"}" stroke-width="${highlighted?2.2:1.2}" opacity="${highlighted?.78:.23}"/>`);
  }
  svg.innerHTML = paths.join("");
}

function wonderCard(item) {
  const prereq = item.prereq.map(p => p.name).join(" · ");
  const summary = [...(item.traits||[]),item.effect].join(" · ");
  return `<button type="button" class="item-card ${selected.type==="wonder"&&selected.id===item.id?"selected":""}" ${toneStyle("wonder",item)} data-open="wonder:${esc(item.id)}"><div class="item-card-top"><span>✦ ${esc(item.era)}</span><span>›</span></div><div class="item-card-heading">${entryImage(item)}<h3>${esc(item.name)}</h3></div><p>${esc(preview(summary,92))}</p><span class="card-tag">前置：${esc(prereq||"—")}</span></button>`;
}
function renderWonders() {
  const list = items("wonder");
  const eras = ["全部",...ERA_ORDER.filter(era => list.some(item => item.era === era))];
  const filtered = eraFilter === "全部" ? list : list.filter(item => item.era === eraFilter);
  if (selected.type!=="wonder" || !filtered.some(item=>item.id===selected.id)) selected={type:"wonder",id:filtered[0]?.id};
  $("#section-count").textContent = `${filtered.length} / ${list.length} 座奇观`;
  $("#workspace").innerHTML = `<div class="filter-row" aria-label="按时代筛选奇观">${eras.map(era=>`<button type="button" data-era="${esc(era)}" class="${eraFilter===era?"active":""}" aria-pressed="${eraFilter===era}">${esc(era)}</button>`).join("")}</div><div class="grid-list">${filtered.map(wonderCard).join("")}</div>`;
}
function unlockCard(item) {
  const summary=item.description || item.abilities.map(ability=>`${ability.name}：${ability.text}`).join(" · ") || item.features.flatMap(group=>group.items.map(row=>row.text)).slice(0,3).join(" · ");
  const civs=item.category==="units"?exclusiveCivs(item):[];
  const tags=[...(warriorLine.has(item.id)?["勇士升级线"]:[]),...(civs.length?[`${civs.map(id=>getName("civilization",id)).join(" / ")}专属`]:[])];
  const group=item.category==="units"?unitRole(item)||item.group:item.group;
  return `<button type="button" class="item-card ${selected.type==="unlock"&&selected.id===item.id?"selected":""}" ${toneStyle("unlock",item)} data-open="unlock:${esc(item.id)}"><div class="item-card-top"><span>${esc(unlockCategoryName(item.category))}${group?` · ${esc(group)}`:""}</span><span>›</span></div><h3>${esc(item.name)}</h3><p>${esc(preview(summary||"查看效果与建造要求",110))}</p>${tags.length?`<span class="card-tag">${esc(tags.join(" · "))}</span>`:""}</button>`;
}
function renderUnlocks() {
  const list=items("unlock");
  const categories=UNLOCK_CATEGORIES.map(category=>({...category,count:list.filter(item=>item.category===category.id).length}));
  const inCategory=list.filter(item=>item.category===unlockCategoryFilter);
  const groups=["全部",...[...new Set(inCategory.map(item=>item.group).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"zh-CN"))];
  if (!groups.includes(unlockGroupFilter)) unlockGroupFilter="全部";
  const filtered=unlockGroupFilter==="全部"?inCategory:inCategory.filter(item=>item.group===unlockGroupFilter);
  if (selected.type!=="unlock" || !filtered.some(item=>item.id===selected.id)) selected={type:"unlock",id:filtered[0]?.id};
  $("#section-count").textContent=`${filtered.length} / ${list.length} 个条目`;
  $("#workspace").innerHTML=`<div class="filter-row" aria-label="按解锁类别筛选">${categories.map(category=>`<button type="button" data-unlock-category="${category.id}" class="${unlockCategoryFilter===category.id?"active":""}" aria-pressed="${unlockCategoryFilter===category.id}">${category.icon} ${esc(category.label)} · ${category.count}</button>`).join("")}</div><div class="select-filter"><label for="unlock-group-filter">所属分类</label><select id="unlock-group-filter">${groups.map(group=>`<option value="${esc(group)}" ${unlockGroupFilter===group?"selected":""}>${esc(group)}</option>`).join("")}</select></div><div class="grid-list">${filtered.map(unlockCard).join("")}</div>`;
}
function leaderCard(item) {
  const civs = item.civilizations.map(id => getName("civilization",id)).join(" / ");
  return `<button type="button" class="item-card ${selected.type==="leader"&&selected.id===item.id?"selected":""}" ${toneStyle("leader",item)} data-open="leader:${esc(item.id)}"><div class="item-card-top"><span>♛ ${esc(civs)}</span><span>›</span></div><h3>${esc(item.name)}</h3><p>${esc(preview(item.ability.text,110))}</p><span class="card-tag">${esc(item.ability.name)}</span></button>`;
}
function renderLeaders() {
  const list = items("leader");
  const filtered = leaderCivFilter==="全部" ? list : list.filter(item=>item.civilizations.includes(leaderCivFilter));
  if (selected.type!=="leader" || !filtered.some(item=>item.id===selected.id)) selected={type:"leader",id:filtered[0]?.id};
  const civs=[...items("civilization")].sort((a,b)=>a.name.localeCompare(b.name,"zh-CN"));
  $("#section-count").textContent = `${filtered.length} / ${list.length} 个领袖条目`;
  $("#workspace").innerHTML = `<div class="select-filter"><label for="leader-civ-filter">按文明筛选</label><select id="leader-civ-filter"><option value="全部">全部文明</option>${civs.map(civ=>`<option value="${esc(civ.id)}" ${leaderCivFilter===civ.id?"selected":""}>${esc(civ.name)}</option>`).join("")}</select></div><div class="grid-list">${filtered.map(leaderCard).join("")}</div>`;
}

function greatPersonSummary(item) {
  if (item.works?.length) return `巨作：${item.works.join(" · ")}`;
  if (item.effects?.length) return item.effects.map(effect=>`${effect.name}：${effect.text}`).join(" · ");
  return item.activation || "查看伟人资料";
}
function greatPersonCard(item) {
  return `<button type="button" class="item-card ${selected.type==="greatperson"&&selected.id===item.id?"selected":""}" ${toneStyle("greatperson",item)} data-open="greatperson:${esc(item.id)}"><div class="item-card-top"><span>✧ ${esc(item.type)} · ${esc(item.era)}</span><span>›</span></div><h3>${esc(item.name)}</h3><p>${esc(preview(greatPersonSummary(item),110))}</p></button>`;
}
function renderGreatPeople() {
  const list=items("greatperson");
  const foundTypes=new Set(list.map(item=>item.type));
  const types=["全部",...GP_TYPE_ORDER.filter(type=>foundTypes.has(type)),...[...foundTypes].filter(type=>!GP_TYPE_ORDER.includes(type))];
  const eras=["全部",...ERA_ORDER.filter(era=>list.some(item=>item.era===era))];
  const filtered=list.filter(item=>(gpTypeFilter==="全部"||item.type===gpTypeFilter)&&(gpEraFilter==="全部"||item.era===gpEraFilter)).sort((a,b)=>(GP_TYPE_ORDER.indexOf(a.type)-GP_TYPE_ORDER.indexOf(b.type))||(ERA_ORDER.indexOf(a.era)-ERA_ORDER.indexOf(b.era))||a.name.localeCompare(b.name,"zh-CN"));
  if (selected.type!=="greatperson" || !filtered.some(item=>item.id===selected.id)) selected={type:"greatperson",id:filtered[0]?.id};
  $("#section-count").textContent = `${filtered.length} / ${list.length} 位伟人`;
  $("#workspace").innerHTML = `<p class="summary-note">本页按类型、时代和名称排列，仅供查阅；游戏中同类型、同一时代的伟人出现顺序随机。</p><div class="filter-row" aria-label="按伟人类型筛选">${types.map(type=>`<button type="button" data-gp-type="${esc(type)}" class="${gpTypeFilter===type?"active":""}" aria-pressed="${gpTypeFilter===type}">${esc(type)}</button>`).join("")}</div><div class="select-filter"><label for="gp-era-filter">时代</label><select id="gp-era-filter">${eras.map(era=>`<option value="${esc(era)}" ${gpEraFilter===era?"selected":""}>${esc(era)}</option>`).join("")}</select></div>${filtered.length?`<div class="grid-list">${filtered.map(greatPersonCard).join("")}</div>`:`<div class="empty">此类型和时代下没有伟人，换一个筛选条件试试。</div>`}`;
}
function relatedResources(feature) {
  const listed=new Set(feature.validResources.map(link=>link.id));
  return items("resource").filter(resource=>listed.has(resource.id)||resource.placements.some(place=>place.id===feature.id));
}
function relatedCityStateUnlocks(cityState) {
  return items("unlock").filter(item=>item.features.some(group=>group.items.some(row=>row.links.some(link=>link.category==="citystates"&&link.id===cityState.id))));
}
function mapFeatureCard(item) {
  const related=relatedResources(item);
  return `<button type="button" class="item-card ${selected.type==="feature"&&selected.id===item.id?"selected":""}" ${toneStyle("feature",item)} data-open="feature:${esc(item.id)}"><div class="item-card-top"><span>◇ ${esc(item.kind)}</span><span>›</span></div><div class="item-card-heading">${entryImage(item)}<h3>${esc(item.name)}</h3></div><p>${esc(preview(item.description||item.traits.join(" · ")||"查看地形与地貌资料",105))}</p>${related.length?`<span class="card-tag">关联资源 ${related.length} 种</span>`:""}</button>`;
}
function resourceCard(item) {
  const places=item.placements.map(place=>place.name).join(" · ");
  const methods=item.improvements.map(improvement=>improvement.name).join(" · ");
  return `<button type="button" class="item-card ${selected.type==="resource"&&selected.id===item.id?"selected":""}" ${toneStyle("resource",item)} data-open="resource:${esc(item.id)}"><div class="item-card-top"><span>◆ ${esc(item.type)}资源</span><span>›</span></div><div class="item-card-heading">${entryImage(item)}<h3>${esc(item.name)}</h3></div><p>${esc(preview(places?`出现：${places}`:"查看特殊获取方式",106))}</p><span class="card-tag">${esc(preview(methods?`改良：${methods}`:item.traits.join(" · "),70))}</span></button>`;
}
function renderMap() {
  const allFeatures=items("feature"), allResources=items("resource");
  const categories=[...(["地形","地貌","自然奇观"].map(kind=>({kind,count:allFeatures.filter(item=>item.kind===kind).length}))),{kind:"资源",count:allResources.length}];
  const isResource=mapKindFilter==="资源";
  const types=["全部",...(["加成","奢侈品","战略","特殊","文物"].filter(type=>allResources.some(item=>item.type===type)))];
  const filtered=isResource?allResources.filter(item=>resourceTypeFilter==="全部"||item.type===resourceTypeFilter):allFeatures.filter(item=>item.kind===mapKindFilter);
  const selectedType=isResource?"resource":"feature";
  if(selected.type!==selectedType||!filtered.some(item=>item.id===selected.id)) selected={type:selectedType,id:filtered[0]?.id};
  $("#section-count").textContent=`${filtered.length} / ${isResource?allResources.length:allFeatures.length} 个地图条目`;
  $("#workspace").innerHTML=`<div class="filter-row" aria-label="地图内容分类">${categories.map(category=>`<button type="button" data-map-kind="${esc(category.kind)}" class="${mapKindFilter===category.kind?"active":""}" aria-pressed="${mapKindFilter===category.kind}">${esc(category.kind)} · ${category.count}</button>`).join("")}</div>${isResource?`<div class="filter-row" aria-label="按资源类型筛选">${types.map(type=>`<button type="button" data-resource-type="${esc(type)}" class="${resourceTypeFilter===type?"active":""}" aria-pressed="${resourceTypeFilter===type}">${esc(type)}</button>`).join("")}</div>`:""}<p class="summary-note">地形、地貌与资源按文明百科列出的关联整理；具体地形和地貌组合仍需符合游戏的地图生成规则。</p><div class="grid-list">${filtered.map(isResource?resourceCard:mapFeatureCard).join("")}</div>`;
}
function cityStateCard(item) {
  return `<button type="button" class="item-card ${selected.type==="citystate"&&selected.id===item.id?"selected":""}" ${toneStyle("citystate",item)} data-open="citystate:${esc(item.id)}"><div class="item-card-top"><span>✦ ${esc(item.type)}城邦</span><span>›</span></div><div class="item-card-heading">${entryImage(item)}<h3>${esc(item.name)}</h3></div><p>${esc(preview(item.suzerain,114))}</p><span class="card-tag">宗主国加成</span></button>`;
}
function renderCityStates() {
  const list=items("citystate");
  const types=["全部",...new Set(list.map(item=>item.type))];
  const filtered=list.filter(item=>cityStateTypeFilter==="全部"||item.type===cityStateTypeFilter);
  if(selected.type!=="citystate"||!filtered.some(item=>item.id===selected.id)) selected={type:"citystate",id:filtered[0]?.id};
  $("#section-count").textContent=`${filtered.length} / ${list.length} 个城邦`;
  $("#workspace").innerHTML=`<div class="filter-row" aria-label="按城邦类型筛选">${types.map(type=>`<button type="button" data-citystate-type="${esc(type)}" class="${cityStateTypeFilter===type?"active":""}" aria-pressed="${cityStateTypeFilter===type}">${esc(type)}</button>`).join("")}</div><div class="grid-list">${filtered.map(cityStateCard).join("")}</div>`;
}
function conceptCard(item,index) {
  return `<button type="button" class="item-card concept-card ${selected.type==="concept"&&selected.id===item.id?"selected":""}" ${toneStyle("concept",item)} data-open="concept:${esc(item.id)}"><div class="item-card-top"><span class="number">${String(index+1).padStart(2,"0")}</span><span>›</span></div><h3>${esc(item.name)}</h3><p>${esc(item.summary)}</p></button>`;
}
function renderConcepts() {
  if (selected.type !== "concept") selected = {type:"concept",id:concepts[0].id};
  $("#section-count").textContent = `${concepts.length} 个常用机制`;
  $("#workspace").innerHTML = `<div class="concept-list">${concepts.map(conceptCard).join("")}</div>`;
}
function searchText(type,item) {
  if (type === "tech" || type === "civic") return [item.name,item.era,item.boost,...item.unlocks.map(x=>x.name)].join(" ");
  if (type === "wonder") return [item.name,item.era,item.effect,...(item.traits||[]),...item.prereq.map(x=>x.name),...item.adjacent,...item.terrain].join(" ");
  if (type === "feature") return [item.name,item.kind,item.description,...item.traits,...relatedResources(item).map(resource=>resource.name)].join(" ");
  if (type === "resource") return [item.name,item.type,...item.traits,...item.placements.map(place=>place.name),...item.improvements.map(improvement=>improvement.name),...item.requirements.flatMap(group=>group.items.map(row=>row.text))].join(" ");
  if (type === "citystate") return [item.name,item.type,...item.envoyBonuses,item.suzerain,...relatedCityStateUnlocks(item).map(unlock=>unlock.name)].join(" ");
  if (type === "leader") return [item.name,item.ability.name,item.ability.text,...item.civilizations.map(x=>getName("civilization",x)),...item.civilizations.flatMap(id=>uniqueUnitsForCiv(id).map(unit=>unit.name))].join(" ");
  if (type === "greatperson") return [item.name,item.type,item.era,...item.effects.flatMap(x=>[x.name,x.text]),...item.works,item.activation].join(" ");
  if (type === "unlock") return [item.name,unlockCategoryName(item.category),item.group,item.description,...exclusiveCivs(item).map(id=>getName("civilization",id)),...item.abilities.flatMap(x=>[x.name,x.text]),...item.features.flatMap(group=>[group.label,...group.items.map(row=>row.text)]),...item.requirements.flatMap(group=>[group.label,...group.items.map(row=>row.text)])].join(" ");
  const detail=CONCEPT_DETAILS[item.id];
  return [item.name,item.summary,item.tip,detail?.rule,...(detail?.facts||[])].join(" ");
}
function searchCard(type,item) {
  const secondary = type === "wonder" ? preview([...(item.traits||[]),item.effect].join(" · "),90) : type === "feature" ? preview(item.description||item.traits.join(" · "),90) : type === "resource" ? preview([item.traits.join(" · "),item.placements.map(place=>place.name).join(" · ")].filter(Boolean).join(" · "),90) : type === "citystate" ? preview(item.suzerain,90) : type === "leader" ? preview(item.ability.text,90) : type === "greatperson" ? preview(greatPersonSummary(item),90) : type === "unlock" ? preview(item.description||item.abilities.map(x=>x.text).join(" · ")||item.features.flatMap(group=>group.items.map(row=>row.text)).slice(0,2).join(" · "),90) : type === "concept" ? item.summary : item.boost ? `提升：${item.boost}` : `前置：${item.prereq.map(id=>getName(type,id)).join(" · ")||"起始项目"}`;
  const group=item.era||item.kind||item.type||item.group;
  return `<button type="button" class="item-card" ${toneStyle(type,item)} data-open="${type}:${esc(item.id)}"><div class="item-card-top"><span>${esc(type==="unlock"?unlockCategoryName(item.category):META[type].label)}${group?` · ${esc(group)}`:""}</span><span>›</span></div>${["tech","civic","wonder","feature","resource","citystate"].includes(type)?`<div class="item-card-heading">${entryImage(item)}<h3>${esc(item.name)}</h3></div>`:`<h3>${esc(item.name)}</h3>`}<p>${esc(preview(secondary,115))}</p></button>`;
}
function renderSearch() {
  const term=query.trim().toLocaleLowerCase();
  const groups = Object.keys(META).filter(type=>type!=="map").map(type => ({type,matches:items(type).filter(item=>searchText(type,item).toLocaleLowerCase().includes(term))})).filter(group=>group.matches.length);
  const count=groups.reduce((n,group)=>n+group.matches.length,0);
  $("#section-count").textContent = `${count} 条结果`;
  $("#workspace").innerHTML = count ? groups.map(group=>`<section class="result-group"><h3>${esc(META[group.type].title)} · ${group.matches.length}</h3><div class="grid-list">${group.matches.map(item=>searchCard(group.type,item)).join("")}</div></section>`).join("") : `<div class="empty">没有找到匹配的条目。试试其他名称或解锁内容。</div>`;
}

function detailSection(title,body) { return body ? `<section class="detail-section"><h3>${esc(title)}</h3>${body}</section>` : ""; }
function plainChips(values) { return values?.length ? `<div class="chip-list">${values.map(value=>`<span class="chip plain">${esc(value)}</span>`).join("")}</div>` : ""; }
function entryChip(type,id,label) { return findItem(type,id) ? `<button type="button" class="chip" data-open="${type}:${esc(id)}">${esc(label||getName(type,id))} ›</button>` : `<span class="chip plain">${esc(label||id)}</span>`; }
function linkChips(links) { return links?.length ? `<div class="chip-list">${links.map(item=>{const type=typeForCategory(item.category);return META[type] && findItem(type,item.id) ? entryChip(type,item.id,item.name) : `<span class="chip plain">${esc(item.name)}</span>`}).join("")}</div>` : ""; }
function namedUnlockChips(names,category) { return names?.length ? `<div class="chip-list">${names.map(name=>{const item=items("unlock").find(entry=>entry.category===category&&entry.name===name);return item?entryChip("unlock",item.id,name):`<span class="chip plain">${esc(name)}</span>`}).join("")}</div>` : ""; }
function detailRows(groups) { return groups?.map(group=>{const placement=!group.label&&group.items.every(row=>row.links.length&&row.links.every(link=>["features","resources"].includes(link.category)));const label=group.label||(placement?"可建造地形与资源":"");return `<div class="detail-row-group">${label?`<h4>${esc(label)}</h4>`:""}${group.items.map(row=>row.links.length===1&&row.text===row.links[0].name?linkChips(row.links):`<p>${esc(row.text)}</p>`).join("")}</div>`}).join("") || ""; }

function renderDetail() {
  if (query) { $("#detail").innerHTML=`<div class="detail-empty">选择搜索结果，查看前置、效果与解锁信息。</div>`; return; }
  const item=findItem(selected.type,selected.id);
  if (!item) { $("#detail").innerHTML=`<div class="detail-empty">选择一个条目查看详细信息。</div>`;return; }
  let body="";
  let subtitle=item.era || "";
  if (selected.type==="tech" || selected.type==="civic") {
    const unit=selected.type==="tech"?"科技值":"文化值";
    subtitle += item.cost ? ` · 基准花费 ${item.cost} ${unit}` : "";
    body += detailSection("研究前置",item.prereq.length ? `<div class="chip-list">${item.prereq.map(id=>entryChip(selected.type,id)).join("")}</div>` : `<p>${item.era==="未来时代"?"未来时代研究顺序可能随机变化。":"起始项目，无研究前置。"}</p>`);
    body += detailSection(selected.type==="tech"?"尤里卡条件":"鼓舞条件",`<p class="value">${esc(item.boost||"此条目未列出提升条件。")}</p>`);
    const wonders=item.unlocks.filter(x=>x.category==="wonders"&&x.id.startsWith("building_"));
    body += detailSection("解锁奇观",wonders.length?linkChips(wonders):`<p>无直接解锁的奇观。</p>`);
    for (const category of UNLOCK_CATEGORIES) {
      const related=item.unlocks.filter(unlock=>unlock.category===category.id);
      body += detailSection(`解锁${category.label}`,linkChips(related));
    }
  } else if (selected.type==="wonder") {
    subtitle += item.cost ? ` · ${item.cost} 生产力（标准速度基准）` : "";
    body += detailSection("效果与建造说明",`<p class="value">${esc(item.effect)}</p>`);
    body += detailSection("基础产出与属性",plainChips(item.traits));
    body += detailSection("解锁前置",linkChips(item.prereq));
    body += detailSection("所需建筑",namedUnlockChips(item.requiresBuilding,"buildings"));
    body += detailSection("邻接对象",plainChips(item.adjacent));
    body += detailSection("可放置地形",plainChips(item.terrain));
  } else if (selected.type==="unlock") {
    const group=item.category==="units"?unitRole(item)||item.group:item.group;
    subtitle=`${unlockCategoryName(item.category)}${group?` · ${group}`:""}`;
    if (item.category==="units") {
      const civs=exclusiveCivs(item);
      if (civs.length) {
        body += detailSection("专属文明",plainChips(civs.map(id=>getName("civilization",id))));
        const leaders=items("leader").filter(leader=>leader.civilizations.some(id=>civs.includes(id)));
        body += detailSection("对应领袖",`<div class="chip-list">${leaders.map(leader=>entryChip("leader",leader.id)).join("")}</div>`);
      }
      if (warriorLine.has(item.id)) body += detailSection("升级路线",`<p>属于勇士升级线。下一阶单位可在“属性与加成”中查看。</p>`);
    }
    body += detailSection("用途与效果",item.description?`<p class="value">${esc(item.description)}</p>`:"");
    body += detailSection("特殊能力",item.abilities.map(ability=>`<p class="skill-name">${esc(ability.name)}</p><p class="value">${esc(ability.text)}</p>`).join(""));
    body += detailSection("属性与加成",detailRows(item.features));
    body += detailSection("解锁与建造要求",detailRows(item.requirements));
  } else if (selected.type==="feature") {
    subtitle=item.kind;
    body += detailSection("地形说明",item.description?`<p class="value">${esc(item.description)}</p>`:"");
    body += detailSection("地块属性与产出",plainChips(item.traits));
    const related=relatedResources(item);
    body += detailSection("关联资源",related.length?`<div class="chip-list">${related.map(resource=>entryChip("resource",resource.id)).join("")}</div>`:`<p>文明百科未列出与此地块直接关联的资源。</p>`);
  } else if (selected.type==="resource") {
    subtitle=`${item.type}资源`;
    body += detailSection("资源效果",plainChips(item.traits));
    body += detailSection("出现地形与地貌",item.placements.length?linkChips(item.placements):`<p>文明百科未列出此资源自然生成的地形；查看下方获取条件。</p>`);
    body += detailSection("可用改良及其效果",item.improvements.map(improvement=>{
      const unlock=findItem("unlock",improvement.id);
      const bonuses=unlock?.features.filter(group=>!group.label).flatMap(group=>group.items.map(row=>row.text)).slice(0,5) || [];
      return `<div class="resource-method"><div class="chip-list">${entryChip("unlock",improvement.id,improvement.name)}</div>${unlock?.description?`<p>${esc(unlock.description)}</p>`:""}${bonuses.length?plainChips(bonuses):""}</div>`;
    }).join("")||`<p>此资源未列出可用改良设施。</p>`);
    body += detailSection("发现与获取条件",detailRows(item.requirements.filter(group=>group.label!=="放置")));
    body += detailSection("收获与其他用途",detailRows(item.uses.filter(group=>group.label!=="提高")));
  } else if (selected.type==="citystate") {
    subtitle=`${item.type}城邦`;
    body += detailSection("使者奖励",`<ul class="mechanic-list">${item.envoyBonuses.map(bonus=>`<li>${esc(bonus)}</li>`).join("")}</ul>`);
    body += detailSection("宗主国加成",`<p class="value">${esc(item.suzerain)}</p>`);
    const related=relatedCityStateUnlocks(item);
    body += detailSection("相关专属解锁",related.length?`<div class="chip-list">${related.map(unlock=>entryChip("unlock",unlock.id)).join("")}</div>`:"");
  } else if (selected.type==="leader") {
    subtitle=item.civilizations.map(id=>getName("civilization",id)).join(" / ");
    body += detailSection("领袖能力",`<p class="skill-name">${esc(item.ability.name)}</p><p class="value">${esc(item.ability.text)}</p>`);
    for (const civId of item.civilizations) {
      const civ=findItem("civilization",civId);
      if (civ) body += detailSection(`${civ.name} · 文明能力`,`<p class="skill-name">${esc(civ.ability.name)}</p><p class="value">${esc(civ.ability.text)}</p>`);
      const uniqueUnits=uniqueUnitsForCiv(civId);
      body += detailSection(`${getName("civilization",civId)} · 特色单位`,uniqueUnits.length?`<div class="chip-list">${uniqueUnits.map(unit=>entryChip("unlock",unit.id)).join("")}</div>`:"");
    }
  } else if (selected.type==="greatperson") {
    subtitle=`${item.type} · ${item.era}`;
    body += detailSection("能力与效果",item.effects.map(effect=>`<p class="skill-name">${esc(effect.name)}</p><p class="value">${esc(effect.text)}</p>`).join(""));
    body += detailSection("创作巨作",plainChips(item.works));
    body += detailSection("激活说明",item.activation?`<p class="value">${esc(item.activation)}</p>`:"");
  } else if (selected.type==="concept") {
    const detail=CONCEPT_DETAILS[item.id];
    body += detailSection("机制要点",detail?.rule?`<p class="mechanic-rule">${esc(detail.rule)}</p>`:`<p class="value">${esc(item.summary)}</p>`);
    body += detailSection("规则细节",detail?.facts?.length?`<ul class="mechanic-list">${detail.facts.map(fact=>`<li>${esc(fact)}</li>`).join("")}</ul>`:"");
    body += detailSection("实战提示",`<p>${esc(item.tip)}</p>`);
  }
  const heroImage=["tech","civic","wonder","feature","resource","citystate"].includes(selected.type)?entryImage(item):"";
  $("#detail").innerHTML=`<div class="detail-content" ${toneStyle(selected.type,item)}><div class="detail-intro"><div class="detail-header"><button id="detail-close" type="button" class="detail-close" aria-label="返回上一页">‹ <span>返回</span></button><span class="detail-type">${esc(META[selected.type].label)}</span><span class="detail-signature">Applespriter</span></div><div class="detail-title-row">${heroImage}<div><h2 class="detail-title">${esc(item.name)}</h2><p class="detail-sub">${esc(subtitle)}</p></div></div></div><div class="detail-body">${body}<p class="detail-source">资料依据：文明百科 · 风云变幻规则集</p></div></div>`;
}

document.addEventListener("click",event=>{
  const pocketNav=event.target.closest("button[data-pocket-page]");
  if(pocketNav){showPocketPage(pocketNav.dataset.pocketPage);return;}
  if(event.target.closest("[data-pocket-back]")){showPocketPage("home");return;}
  const searchWord=event.target.closest("[data-search-word]");
  if(searchWord){query=searchWord.dataset.searchWord;$("#search").value=query;render();return;}
  const layout=event.target.closest("[data-tree-layout]");
  if(layout){treeLayout=layout.dataset.treeLayout;closeDetail();render();return;}
  const tab=event.target.closest("[data-view]");
  if (tab) {selectModule(tab.dataset.view);return;}
  const era=event.target.closest("[data-era]");
  if (era) {eraFilter=era.dataset.era;render();return;}
  const gpType=event.target.closest("[data-gp-type]");
  if (gpType) {gpTypeFilter=gpType.dataset.gpType;closeDetail();render();return;}
  const unlockCategory=event.target.closest("[data-unlock-category]");
  if (unlockCategory) {unlockCategoryFilter=unlockCategory.dataset.unlockCategory;unlockGroupFilter="全部";closeDetail();render();return;}
  const mapKind=event.target.closest("[data-map-kind]");
  if (mapKind) {mapKindFilter=mapKind.dataset.mapKind;closeDetail();render();return;}
  const resourceType=event.target.closest("[data-resource-type]");
  if (resourceType) {resourceTypeFilter=resourceType.dataset.resourceType;closeDetail();render();return;}
  const cityStateType=event.target.closest("[data-citystate-type]");
  if (cityStateType) {cityStateTypeFilter=cityStateType.dataset.citystateType;closeDetail();render();return;}
  const open=event.target.closest("[data-open]");
  if (open) {const [type,id]=open.dataset.open.split(":");setSelection(type,id);return;}
  if (event.target.closest("#detail-close")) {pocketBack();return;}
  if (event.target.closest("#detail-backdrop")) closeDetail();
});
document.addEventListener("change",event=>{
  if(event.target.id==="tree-era-filter"){treeEraFilter=event.target.value;closeDetail();render();}
  if (event.target.id==="leader-civ-filter") {leaderCivFilter=event.target.value;closeDetail();render();}
  if (event.target.id==="gp-era-filter") {gpEraFilter=event.target.value;closeDetail();render();}
  if (event.target.id==="unlock-group-filter") {unlockGroupFilter=event.target.value;closeDetail();render();}
});
document.addEventListener("keydown",event=>{if(event.key==="Escape") pocketBack();});
$("#search").addEventListener("input",event=>{query=event.target.value.trim();if(isPocket())pocketPage="search";closeDetail();render();});
let pocketWidth=isPocket();
window.addEventListener("resize",()=>{const phone=isPocket();if(phone!==pocketWidth){pocketWidth=phone;closeDetail();render();}else if(view==="tech"||view==="civic")requestAnimationFrame(()=>drawEdges(view,ancestorIds(view,selected.id)));});
window.addEventListener("hashchange",()=>{const [type,id]=location.hash.slice(1).split("/");if(META[type]&&findItem(type,decodeURIComponent(id||"")))setSelection(type,decodeURIComponent(id),false);});

fetch("./data.json").then(response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json()}).then(data=>{
  db=data;
  warriorLine=buildWarriorLine();
  try {recentEntries=JSON.parse(localStorage.getItem("civ6-recent")||"[]").filter(entry=>findItem(entry.type,entry.id)).slice(0,24);}catch{recentEntries=[];}
  const [type,rawId]=location.hash.slice(1).split("/");
  const id=decodeURIComponent(rawId||"");
  if(META[type]&&findItem(type,id)){
    view=viewForType(type);
    pocketPage="module";
    selected={type,id};
    if(type==="unlock")unlockCategoryFilter=findItem(type,id).category;
    if(type==="feature")mapKindFilter=findItem(type,id).kind;
    if(type==="resource")mapKindFilter="资源";
    if(type==="tech"||type==="civic")treeEraFilter=findItem(type,id).era;
  }
  render();
}).catch(error=>{console.error(error);$("#error").hidden=false;$("#workspace").innerHTML="";$("#section-count").textContent="";});
