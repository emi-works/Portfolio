// 内容はこのファイルだけ書き換えればOK。【追記】【タイトル】の部分を埋めてください。
(()=>{const P='【追記】',T='【タイトル】';
const k=(tech,o={})=>({title:T,name:T,sum:P,tech,detail:[P,P,P],imgs:['',''],url:'',...o});
const g=n=>k(n,{title:n,name:n});
window.SITE={
name:'EMI HASEGAWA',
catch:'「やりたい」を形にするデジタルクリエイター',
lead:'業務効率化からWebサイト、アプリ、動画編集まで、ITの力であなたのアイデアを具現化します。',
profile:'顧客管理システムを販売するIT会社で、約5年間エンジニアとして働いてきました。現在はフリーランスとして、業務効率化・Web制作・アプリ制作に取り組んでいます。',
strengths:[{t:'自走力',d:P},{t:'運用しやすい設計',d:P},{t:'代替案の提案',d:P}],
skills:[['kintone','JavaScriptカスタマイズ、REST API連携、プラグイン開発'],['Excel VBA','業務ツールの自動化、大量データの処理'],['Power Automate','メール連携の自動化、エラー内容の出力'],['Google Apps Script','小規模な自動化'],['Looker / BigQuery','データの集計と可視化'],['Zendesk Guide','サポートサイトの制作'],['WordPress','子テーマでのカスタマイズ'],['BASE','ECサイトの構築'],['Photoshop / Illustrator / Premiere Pro / Figma / Canva','デザインのラフ作成、動画編集']],
code:['HTML','CSS','JavaScript','Excel VBA','PHP','LookML','Google Apps Script'],
ai:'開発には生成AIも活用し、効率よく進めています。出力内容の確認と動作検証は自分で行います。',
works:[
{g:'業務効率化',rm:1,c:[k('kintone'),k('Excel VBA'),k('Power Automate'),k('Google Apps Script'),k('Looker（LookML）、BigQuery')]},
{g:'Web制作',rm:1,note:'WordPressなどのCMSやノーコードツールを使わず、コードでの制作も可能です。',c:[k('Zendesk Guide、HTML、CSS、JavaScript'),k('WordPress'),k(P),k('BASE')]},
{g:'グラフィック & ムービー',rm:1,c:['Photoshop','Illustrator','Premiere Pro','Figma','Canva'].map(g)},
{g:'個人制作',c:[k(P,{title:'【単語帳アプリ名】',name:'【単語帳アプリ名】'}),k(P,{title:'【国旗アプリ名】',name:'【国旗アプリ名】'}),k(P,{title:'【日記アプリ名】',name:'【日記アプリ名】'}),k('HTML、CSS、JavaScript')]}
],
// url に実際のURLを入れると、ポップアップの名前の隣にリンクアイコンが出ます。
form:{action:'',e:{name:'',email:'',type:'',msg:''},types:['業務効率化','Web制作','アプリ制作','その他']},
// 【追記】reCAPTCHAなどの迷惑メール対策、Googleフォームの作成と通知設定
privacy:'いただいた内容は、お問い合わせへの返信のためにのみ利用します。【追記：文面を確認】'};})();
