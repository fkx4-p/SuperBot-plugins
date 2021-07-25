import { api, commander, logger, config } from '../../lib/api'
import netease from './api/netease';
import utils from './api/utils';
import { searchImage } from './api/img';
import { setu } from './api/setu';



commander.reg({
  cmd: /^\.echo (.*)/,
  helper: '.echo <text>		echo',
  private: true,
  group: true,
  globalAdmin_require: false,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	reply(m[1]);
});

commander.reg({
  cmd: /^.*\[CQ:at,qq=(\d+)\].*\/(\S+)$/,
  helper: '/xxx     整活',
  private: true,
  group: true,
  globalAdmin_require: false,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
  logger.info(JSON.stringify(m));
  const result = await api.http.OneBot.group.getMemberInfo(e.group_id, Number(m[1]));
  logger.info(JSON.stringify(result));
  reply(`${e.sender.nickname} ${m[2]}了 ${result.data.nickname}!`, false);
});

commander.reg({
  cmd: /^.*\[CQ:at,qq=(\d+)\].*\/(\S+) (\S+)$/,
  helper: '/xxx xxx     整活',
  private: true,
  group: true,
  globalAdmin_require: false,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
  logger.info(JSON.stringify(m));
  const result = await api.http.OneBot.group.getMemberInfo(e.group_id, Number(m[1]));
  logger.info(JSON.stringify(result));
  reply(`${e.sender.nickname} ${m[2]} ${result.data.nickname} ${m[3]}!`, false);
});

commander.reg({
  cmd: /^\.poke (.*)$/,
  helper: '.poke <QQ>		戳指定的人',
  private: false,
  group: true,
  globalAdmin_require: false,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	reply(`[CQ:poke,qq=${m[1]}]`, false);
});

commander.reg({
  cmd: /^\.poke$/,
  helper: '.poke		戳一下自己',
  private: false,
  group: true,
  globalAdmin_require: false,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	reply(`[CQ:poke,qq=${e.sender.user_id}]`, false);
});

commander.reg({
  cmd: /^\.gift (.*) (.*)$/,
  helper: '.gift <QQ> <礼物id>		送礼物',
  private: false,
  group: true,
  globalAdmin_require: false,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	reply(`[CQ:gift,qq=${m[1]},id=${m[2]}]`, false);
});

commander.reg({
  cmd: /^\.tts (.*)$/,
  helper: '.tts <text>		文本转语音',
  private: true,
  group: true,
  globalAdmin_require: false,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	reply(`[CQ:tts,text=${m[1]}]`, false);
});

commander.reg({
  cmd: /^云村热评$/,
  helper: '云村热评		随机一条网易云热评',
  private: true,
  group: true,
  globalAdmin_require: false,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
  const comment = await netease.comment.hotall();
  if(!comment){
    reply('什么都没找到啊');
    return;
  }
  reply([
    `『${comment.content}』 ——${comment.simpleUserInfo.nickname}`,
    `来自歌曲：${comment.simpleResourceInfo.name} (${comment.simpleResourceInfo.artists[0].name})[CQ:image,file=base64://${await utils.loadImg(comment.simpleResourceInfo.songCoverUrl)}]`
  ].join('\n'), false);
});

commander.reg({
  cmd: /^搜图(.*)$/,
  helper: '搜图+关键词		搜图啊啊啊啊啊',
  private: true,
  group: true,
  globalAdmin_require: false,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
  const result = await searchImage(m[1]);
  if(!result) {
    return reply('没有搜索到任何结果');
  }
  
  reply(`[CQ:image, file=${result.url}]${result.title}`);
});

// commander.reg({
//   cmd: /^涩图来$/,
//   helper: '涩图来		康涩图！',
//   private: true,
//   group: true,
//   globalAdmin_require: false,
//   groupAdmin_require: false,
//   owner_require: false
// }, async (m: Array<string>, e: any, reply: Function) => {
//   const result = await setu();
//   if(result.code === 0) {
//     const tags: string[] = [];

//     result.data[0].tags.forEach((element: string) => {
//       tags.push(`#${element}`);
//     });

//     const message_body = await reply(`[CQ:image,file=${result.data[0].url}] ${tags.join(' ')}`);
    
//     const timeout = config.timeout;
//     if(timeout != -1) 
//       setTimeout(function() {
//         api.socket.message.delete_msg(message_body.message_id);
//       },timeout * 1000);

//   } else {
//     reply('[Setu] ¿')
//   }
// });

/*commander.reg({
  cmd: /^弟图来$/,
  helper: '弟图来		康弟图！',
  private: true,
  group: true,
  globalAdmin_require: false,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
    const message_body = await reply(`[CQ:image,file=]`);
    
    const timeout = config.timeout;
    if(timeout != -1) 
      setTimeout(function() {
        api.socket.message.delete_msg(message_body.message_id);
      },timeout * 1000);
});
*/
// commander.reg({
// 	cmd: /^\.rd(.*)$/,
// 	helper: '.rd + 数字     生成[1,数字]的随机数',
// 	private: false,
// 	group:true,
// 	globalAdmin_require: false,
// 	groupAdmin_require: false,
// 	owner_require: false
// }, async (m: Array<number>, e: any, reply: Function) => {
// 	var tmp = Math.floor(Math.random()*Math.random()*174519849);
// 	var mod: number = Math.floor(m[1]);
// 	if(isNaN(mod)) reply('¿');
// 	else
// 	{
// 	    var tmp1: number = tmp % (mod <= 0 ? 100 : mod) + 1;
//         reply(`群友掷骰: D${mod <= 0 ? 100 : mod}=${tmp1}`);
// 	}
// });

commander.reg({
	cmd: /^\.r([0-9]*)d([0-9]*)(((\+|\-)\d+)*)([\s\S]*)/,
	helper: '.r+数量+d+数字      生成 数量 个[1,数字]的随机数并求和',
	private: true,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
    if(Math.random() < 0.05) reply("骰娘不高兴>_<");
    else
    {
        var mod: number = Math.floor(+m[2]);
        if(m[2]=='') mod = 100;
    	if(mod <= 0 || mod >= 50000)
    	{
    	    if(mod >= 50000)reply('哇，先让我数数这个骰子有多少面……1，2，3，……');
    	    else reply('哇，是反物质骰子欸！让我玩一会儿');
    	}
    	else
    	{
        	var n: number = +m[1];
        	if(m[1]=='') n=1;
        	if(isNaN(+m[1]) || isNaN(+m[2]) || n <= 0) reply('¿');
        	else if(n > 15) reply('太多了==');
        	else
        	{
        	    var now: number = 0;
            	var nxt: string = '';
            	for(var i: number = 1; i <= n; i++)
            	{
            	    var tmp = Math.floor(Math.random()*Math.random()*174519849);
            	    var tmp1: number = tmp % (mod <= 0 ? 100 : mod) + 1;
            	    if(i == 1)
            	    {
            	        nxt = nxt + `${tmp1}`;
            	    }
            	    else
            	    {
            	        nxt = nxt + `+${tmp1}`;
            	    }
            	    now += tmp1;
            	}
            	var QAQ: number = 0;
            	var fl: number = 1;
            	var qwq: number = 0;
            	var str: string = m[3];
            	var ret: string = '';
            	var len: number = str.length;
            	for(var i: number = 0; i < len; i++)
            	{
            	    ret = ret + `${i}`;
            	    if(str.charCodeAt(i) == 43 || str.charCodeAt(i) == 45)
            	    {
            	        now += qwq * fl;
            	        qwq = 0;
            	        if(str.charCodeAt(i) == 43)
            	        {
            	            fl = 1;
            	        }
            	        else fl = -1;
            	    }
            	    else if(str.charCodeAt(i) <= 58 && str.charCodeAt(i) >= 48) qwq = qwq * 10 + (str.charCodeAt(i) - 48);
            	}
            	if(qwq != 0) now += qwq * fl;
            	reply(`${e.sender.nickname}掷骰 ${m[6]}\n${n}D${mod} = `+nxt+m[3]+' = '+`${now}`);
            // 	reply(ret);
            // 	var ret: string = '';
            // 	for(var i: number = 1; m[i] != m[10000]; i++)
            // 	{
            // 	    ret = ret + m[i];
            // 	    ret = ret + '||';
            // 	}
            // 	reply(ret);
        	}
    	}
    }
	
});

commander.reg({
	cmd: /^(\\.*?\/){1,10}$/,
	helper: '\\好耶/',
	private: false,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	if(m[0].length <= 10)reply(m[0]);
});

commander.reg({
	cmd: /.+的单人任务/,
	helper: '',
	private: false,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	if(Math.random() <= 0.2) reply('拷走！');
});

commander.reg({
	cmd: /击剑|🤺/,
	helper: '',
	private: false,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	if(Math.random() <= 0.2) reply('🤺');
});

commander.reg({
	cmd: /.*/,
	helper: '',
	private: false,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	if(Math.random() <= 0.007) reply(m[0]);
    // reply('呜呜你们又逼着我做了些什么啊呜呜');
    // reply('骰娘不想被你们捉弄了>_<');
    // reply('坏叔叔！呜呜呜');
});

// commander.reg({
// 	cmd: /^(\[CQ\:face\,id\=\b+\])+$/,
// 	helper: '',
// 	private: false,
// 	group:true,
// 	globalAdmin_require: false,
// 	groupAdmin_require: false,
// 	owner_require: false
// }, async (m: Array<string>, e: any, reply: Function) => {
// 	if(Math.random() <= 0.03) reply(m[1]);
// });

commander.reg({
	cmd: /透bot/,
	helper: '',
	private: false,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	reply('不要！呜呜>_<')
});

commander.reg({
	cmd: /^\.draw(.*)$/,
	helper: '',
	private: false,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
    var qwq: Array<string> = ['愚者', '魔术师', '女祭司', '女皇', '皇帝', '教皇', '恋人', '战车', '力量', '隐者', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔', '塔', '星星', '月亮', '太阳', '审判', '世界'];
    var quest: Array<string> = ['冒险的行动，追求可能性，重视梦想，无视物质的损失，离开家园，过于信赖别人，为出外旅行而烦恼。心情空虚、轻率的恋情、无法长久持续的融洽感、不安的爱情的旅程、对婚姻感到束缚、彼此忽冷忽热、不顾众人反对坠入爱河、为恋人的负心所伤、感情不专一。', '意志力薄弱，起头难，走入错误的方向，知识不足，被骗和失败。', '过于洁癖，无知，贪心，目光短浅，自尊心过高，偏差的判断，有勇无谋，自命不凡。', '不活泼，缺乏上进心，散漫的生活习惯，无法解决的事情，不能看到成果，担于享乐，环境险恶，与家人发生纠纷。', '幼稚，无力，独裁，撒娇任性，平凡，没有自信，行动力不足，意志薄弱，被支配。', '错误的讯息，恶意的规劝，上当，援助被中断，愿望无法达成，被人利用，被放弃。', '禁不起诱惑，纵欲过度，反覆无常，友情变淡，厌倦，争吵，华丽的打扮，优柔寡断。', '争论失败，发生纠纷，阻滞，违返规则，诉诸暴力，顽固的男子，突然的失败，不良少年，挫折和自私自利。', '胆小，输给强者，经不起诱惑，屈服在权威与常识之下，没有实践便告放弃，虚荣，懦弱，没有耐性。', '无视警，憎恨孤独，自卑，担心，幼稚思想，过于慎重导致失败，偏差，不宜旅行。', '边疆的不行，挫折，计划泡汤，障碍，无法修正方向，往坏处发展，恶性循环，中断。', '失衡、偏见、纷扰、诉讼、独断专行、问心有愧、无法两全、表里不一、男女性格不合、情感波折、无视社会道德的恋情。', '无谓的牺牲、骨折、厄运、不够努力、处于劣势、任性、利己主义者、缺乏耐心、受惩罚、逃避爱情、没有结果的恋情。', '抱有一线希望、起死回生、回心转意、摆脱低迷状态、挽回名誉、身体康复、突然改变计划、逃避现实、斩断情丝、与旧情人相逢。', '消耗、下降、疲劳、损失、不安、不融洽、爱情的配合度不佳。', '逃离拘束、解除困扰、治愈病痛、告别过去、暂停、别离、拒绝诱惑、舍弃私欲、别离时刻、爱恨交加的恋情。', '困境、内讧、紧迫的状态、状况不佳、趋于稳定、骄傲自大将付出代价、背水一战、分离的预感、爱情危机。', '挫折、失望、好高骛远、异想天开、仓皇失措、事与愿违、工作不顺心、情况悲观、秘密恋情、缺少爱的生活。', '逃脱骗局、解除误会、状况好转、预知危险、等待、正视爱情的裂缝。', '消沉、体力不佳、缺乏连续性、意气消沉、生活不安、人际关系不好、感情波动、离婚。', '一蹶不振、幻灭、隐瞒、坏消息、无法决定、缺少目标、没有进展、消除、恋恋不舍。', '未完成、失败、准备不足、盲目接受、一时不顺利、半途而废、精神颓废、饱和状态、合谋、态度不够融洽、感情受挫。', '憧憬自然的地方、毫无目的地前行、喜欢尝试挑战新鲜事物、四处流浪。', '事情的开始，行动的改变，熟练的技术及技巧，贯彻我的意志，运用自然的力量来达到野心。', '开发出内在的神秘潜力，前途将有所变化的预言，深刻地思考，敏锐的洞察力，准确的直觉。', '幸福，成功，收获，无忧无虑，圆满的家庭生活，良好的环境，美貌，艺术，与大自然接触，愉快的旅行，休闲。', '光荣，权力，胜利，握有领导权，坚强的意志，达成目标，父亲的责任，精神上的孤单。', '援助，同情，宽宏大量，可信任的人给予的劝告，良好的商量对象，得到精神上的满足，遵守规则，志愿者。', '撮合，爱情，流行，兴趣，充满希望的未来，魅力，增加朋友。', '努力而获得成功，胜利，克服障碍，行动力，自立，尝试，自我主张，年轻男子，交通工具，旅行运大吉。', '大胆的行动，有勇气的决断，新发展，大转机，异动，以意志力战胜困难，健壮的女人。', '隐藏的事实，个别的行动，倾听他人的意见，享受孤独，自己的丢化，有益的警戒，年长者，避开危险，祖父，乡间生活。', '关键性的事件，有新的机会，因的潮流，环境的变化，幸运的开端，状况好转，问题解决，幸运之神降临。', '公正、中立、诚实、心胸坦荡、表里如一、身兼二职、追求合理化、协调者、与法律有关、光明正大的交往、感情和睦。', '接受考验、行动受限、牺牲、不畏艰辛、不受利诱、有失必有得、吸取经验教训、浴火重生、广泛学习、奉献的爱。', '失败、接近毁灭、生病、失业、维持停滞状态、持续的损害、交易停止、枯燥的生活、别离、重新开始、双方有很深的鸿沟、恋情终止。', '单纯、调整、平顺、互惠互利、好感转为爱意、纯爱、深爱。', '被束缚、堕落、生病、恶意、屈服、欲望的俘虏、不可抗拒的诱惑、颓废的生活、举债度日、不可告人的秘密、私密恋情。', '破产、逆境、被开除、急病、致命的打击、巨大的变动、受牵连、信念崩溃、玩火自焚、纷扰不断、突然分离，破灭的爱。', '前途光明、充满希望、想象力、创造力、幻想、满足愿望、水准提高、理想的对象、美好的恋情。', '不安、迷惑、动摇、谎言、欺骗、鬼迷心窍、动荡的爱、三角关系。', '活跃、丰富的生命力、充满生机、精力充沛、工作顺利、贵人相助、幸福的婚姻、健康的交际。', '复活的喜悦、康复、坦白、好消息、好运气、初露锋芒、复苏的爱、重逢、爱的奇迹。', '完成、成功、完美无缺、连续不断、精神亢奋、拥有毕生奋斗的目标、完成使命、幸运降临、快乐的结束、模范情侣。'];
    var a: number = Math.floor(Math.random()*Math.random()*174519849) % 22;
    var b: number = Math.floor(Math.random()*Math.random()*174519849) % 2;
    if(b % 2) reply('单张塔罗牌 '+m[1]+' : '+qwq[a]+',顺位\n'+quest[b*22+a]);
    else reply('单张塔罗牌 '+m[1]+' : '+qwq[a]+',逆位\n'+quest[b*22+a]);
});

commander.reg({
	cmd: /^早上好$/,
	helper: '',
	private: true,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	const nowdate = new Date();
	var qwq:Array<string> = [
	    '', '今天是周一呢~刷新了剿灭别忘记打哦~', '今天是周二呢！元气满满迎接这一天吧~', '今天是周三呢！工作日已经过去一半了，马上就可以休息了！', '今天是周四呢！还有两天就可以休息了，今天也要加油哦', '今天是周五呢~加油挺过最后一天，明天便是胜利的曙光！', '*哈欠*\n啊……周六了……今天不想动弹呢……\n我再睡一会儿……就一小会zzZ……', '今天是周日！剿灭打完了吗？周常清完了吗？代理完美了吗？？？（魔鬼笑）']
	if(nowdate.getHours()<=11)reply(`早~${qwq[nowdate.getDay()]}`);
});

commander.reg({
	cmd: /^bot炸了/,
	helper: '',
	private: true,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	reply('才……才没有！QAQ');
});
commander.reg({
	cmd: /^\.botinfo$/,
	helper: '',
	private: true,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
	reply('【性别】D10=5|女\n【是否博士】D10=2|是\n【年龄】D10=1|14岁以下|D14=11岁\n【种族】菲林\n【出生地】？\n【物理强度】\nD100=29|普通\n【生理耐受】\nD100=76|优良\n【战场机动】\nD100=17|普通\n【战斗技巧】\nD100=98|■■\n【战术规划】\nD20+80=88\n【文化水平】\nD20+80=99\n【源石技艺适应性】\nD100=75|优良\n【是否会源石技艺】\nD100+30=130|专家级\n【源石技艺类型】\nD10=5|元素类|D10=9|雷\n【源石技艺强度】\nD100+30=102\n【源石技艺精密性】\nD100+30=78\n【矿石病研究水平】D50+50=71\n【魅力】D100=62\n【幸运】D100=23\n【颜值】D100=92\n【善恶守序】守序善良\n');
	reply('是AuCloud在其他群里车的卡呢！觉得符合bot就搬上来喽~');
});
commander.reg({
	cmd: /^\.chall$/,
	helper: '',
	private: true,
	group:true,
	globalAdmin_require: false,
	groupAdmin_require: false,
	owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
    var gq: Array<string> = ['', '5-7突袭', 'S6-3', 'S6-4', 'S7-2', '7-9', '活动EX-2突袭（如果有）/7-12', '活动EX-3突袭（如果有）/7-13', '活动EX-4（如果有）/7-16', '活动EX-5（如果有）/R8-10','活动EX-6（如果有）/M8-7', 'H5-1', 'H5-3', 'H6-1', 'H6-2', 'H6-3', 'H7-2', 'H7-3', 'H8-1', 'H8-2', '任意4级危机合约'];
    var ys: Array<string> = ['', '好猫咪: 招募与好友助战同名的干员不消耗点数(允许刷新助战列表)', 'SideStory: 招募当期（没有时默认刚刚结束的一期）SS中出场角色时不消耗点数', '值周生: 招募当期轮换卡池内的干员不消耗点数', '时装周: 招募身着时装的干员消耗的点数减半(向下取整)', '杜林理发券·蓝白:招募蓝发&白发的干员消耗的点数减半(向下取整)', '杜林理发券·红黑: 招募红发&黑发的干员消耗的点数减半(向下取整)', '大祭司转转转: 招募男性干员消耗的点数减半(向下取整)', '一捧铃兰花: 招募罗德岛干员消耗的点数减半(向下取整)', '魏公酬礼:招募龙门干员不消耗点数', '瓦莱丽优惠券: 招募维多利亚干员不消耗点数', '《海中深色》: 招募哥伦比亚干员不消耗点数', '庇护之地: 招募萨卡兹&萨科塔干员不消耗点数', '顺风: 招募黎博利干员不消耗点数', '毛线球: 招募菲林干员消耗的点数减半(向下取整)', '家族会议: 招募佩洛&鲁珀&沃尔珀干员不消耗点数', '及时雨: 招募四星及以下干员不消耗点数', '战术优势: 招募六星&五星干员消耗的点数减半(向下取整)', '免费午餐: 招募点数+10，并返还购入优势骰消耗的点数', '执棋者: 去除所有劣势', '动作如潮: Roll[2d20]，获得两项额外的优势'];
    var ls: Array<string> = ['', '坏猫咪: 禁止招募与好友助战同名的干员(禁止刷新助战列表)', '未知的故事: 招募罗德岛干员消耗的点数+2', '盲目平衡: 招募相同职业的干员时，该职业消耗的点数加倍(向上取整)', '\"撞色\": 禁止招募相同发色的干员/仅允许招募发色相同的干员(二选一)', '专员抽调: 禁止招募六星干员', '补给受限: 禁止招募部署费用超过 20 的干员(包括等待再部署的干员)', '超重行李: 至多招募 6 名干员', '战场课题: 至少招募 4 名相同职业的干员', '从一而终: 至少招募 4 名使用一技能的干员', '背水一战: 干员每次部署仅能发动 1 次技能(自动触发型技能不受此劣势影响)', '每逢佳节: 干员部署费用+3', '峡谷作战: 近战部署上限减少至3', '冬旅营火: 部署上限减少至 3，在场上干员的周围四格部署干员时不消耗部署位(召唤物不受此劣势影响)', '战争迷雾: 部署上限减少至 3，在场上干员的攻击范围内部署干员时不消耗部署位(召唤物不受此劣势影响)', '生人勿近: 禁止在干员周围四格部署干员(关系网连线干员&召唤物不受此劣势影响)', '闪击战: 禁止部署部署费用最高&最低的干员(包括等待再部署的干员；召唤物不受此劣势影响)', '可露希尔特价: 招募六星干员消耗的点数+2', '节衣缩食: 招募点数-6', '\"一点\"加班费: 使用相同的队伍，额外挑战一个关卡', '祸不单行: 获得两项额外的劣势'];
	var a: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	var b: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	var c: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	var d: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	while(b == c || b == d) b = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	while(c == b || c == d) c = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	var f: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	reply(`关卡：${a}：${gq[a]}\n劣势：${b}/${c}/${d}\n\ \ \ \ >${ls[b]}\n\ \ \ \ >${ls[c]}\n\ \ \ \ >${ls[d]}\n任取两项\n消耗8点获得优势：${f}\n\ \ \ \ >${ys[f]}`);
	
	if(f == 20)
	{
	    var E: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	    var F: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	    while(E == F || E == 20) E = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	    while(F == 20 || F == E) Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	    reply(`动作如潮！获得优势${E}+${F}\n\ \ \ \ >${E}: ${ys[E]}\n\ \ \ \ >${F}: ${ys[F]}`);
	}
	setTimeout(function(){},100);
	if(b == 20 || c == 20 || d == 20)
	{
	    var E: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	    var F: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	    while(E == F || E == 20|| E == b || E == c || E == d) E = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	    while(F == 20 || F == b || F == c || F == d || F == E) F = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	    reply(`祸不单行！若选择\“祸不单行\”，则视为选择\n\ \ \ \ \>${ls[E]}\n\ \ \ \ \>${ls[F]}`);
	    if(E == 19 || F == 19)
	    {
	        var G: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	        while(G == a) G = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
	        reply(`\"一点\"加班费！选择则视为另挑战关卡: ${gq[G]}`);
	    }
	}
	if(b == 19 || c == 19 || d == 19)
    {
        var G: number = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
        while(G == a) G = Math.floor(Math.random()*Math.random()*174519849) % 20+1;
        reply(`\"一点\"加班费！选择则视为另挑战关卡: ${gq[G]}`);
    }
});

commander.reg({
  cmd: /^\.mess ([0-9]*) ([\s\S]*)/,
  helper: '.echo <text>		echo',
  private: true,
  group: false,
  globalAdmin_require: true,
  groupAdmin_require: false,
  owner_require: false
}, async (m: Array<string>, e: any, reply: Function) => {
    var group: number = +m[1];
    reply(`Message sent to ${group} successfully.`);
	api.socket.message.sendGroupMessage(group, m[2], false);
});
