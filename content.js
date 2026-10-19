// サイトの表示内容。文言の変更はこのファイルだけでいい。
// 【追記】【タイトル】は未記入の箇所。
(() => {
  const TBD = '【追記】';
  const TBD_TITLE = '【タイトル】';

  // 実績カード1枚分
  const work = (tech, overrides = {}) => ({
    title: TBD_TITLE,
    name: TBD_TITLE, // ポップアップ側の表示名
    summary: TBD,
    result: '', // 成果（任意。空なら表示しない）
    tech,
    details: [TBD, TBD, TBD], // 課題 / やったこと / 工夫（空の項目は表示しない）
    images: ['', ''], // 空なら Coming soon
    url: '', // 入れると名前の横にリンクアイコンが出る
    ...overrides,
  });

  // 内容を書いた実績カード。書いていない項目は空のまま（表示しない）
  const filledWork = ({ title, tech, summary = '', result = '', problem = '', action = '', point = '', images }) => ({
    ...work(tech, { title, name: title, summary, result, ...(images && { images }) }),
    details: [problem, action, point],
  });

  // 個人制作用（詳細の項目名が「きっかけ / できること / こだわり」）
  const appWork = ({ title, tech = '', summary = '', trigger = '', features = '', point = '', images, url = '' }) => ({
    ...work(tech, { title, name: title, summary, url, ...(images && { images }) }),
    details: [trigger, features, point],
  });

  window.SITE = {
    // TOP
    name: 'EMI HASEGAWA',
    catch: ['「やりたい」を形にする', 'デジタルクリエイター'], // 幅1000px以下ではここで改行
    lead: '業務効率化からWebサイト、アプリ、動画編集まで、ITの力であなたのアイデアを具現化します。',

    // PROFILE
    // 1要素 = 1行
    profile: [
      '顧客管理システムを販売するIT会社で、インターン期間も含め約5年間エンジニアとして働いてきました。',
      '前任者のいない環境で技術担当を一人で務め、業務の自動化からサイトの制作まで、立ち上げから運用まで担当し、エンジニアではない方でも日々の業務で使い続けられる仕組みをつくってきました。',
      '現在はフリーランスとして、業務効率化・Web制作・アプリ制作に取り組んでいます。',
    ],

    // WORKS（isIllustration: 画像に「イメージ」ラベルを付ける）
    worksNotice: '業務で制作したものは社外に公開できないため、実物の代わりに内容をイメージしたイラストで紹介しています（個人制作を除く）。',
    works: [
      {
        title: '業務効率化',
        isIllustration: true,
        cards: [
          filledWork({
            title: 'サポート対応の記録アプリ',
            images: ['images/work-kintone-form.svg'],
            tech: 'kintone・JavaScript・CSS',
            summary: 'サポート部門の対応記録詳細を管理するkintoneアプリ。毎日利用。kintoneのカスタマイズは、ほかにも20アプリ以上を担当。',
            result: '入力漏れが減り、新しいメンバーの教育にかかる時間も削減。',
            problem: '入力項目が多く、記入漏れが頻繁に起きていた。',
            action: '条件に応じて入力項目を出し分け、マニュアルを見なくても入力の流れが分かる画面にした。',
            point: '条件に合わない場合は自作のアラートを出す仕組みにし、視覚的にもわかりやすくした。',
          }),
          filledWork({
            title: '一覧画面横スクロール固定プラグイン',
            images: ['images/work-plugin-sticky.svg'],
            tech: 'kintone・JavaScript・CSS',
            summary: '一覧画面で横にスクロールした際に指定した列を固定するプラグインを作成。',
            result: 'プラグインにしたことにより複数のアプリにて視認性向上。',
            problem: '一覧画面で表示したい項目が多い時、列が固定されないことで情報が見づらくなっていた。',
            action: '一覧画面の表示時に、指定した列を固定表示する処理をJavaScriptで実装し、どのアプリにも追加できるようプラグインとしてまとめた。',
            point: '固定する列の順番指定、一覧ごとに設定を可能にすることにより使いやすさを上げた。',
          }),
          filledWork({
            title: 'データ移行ツール',
            images: ['images/work-vba-convert.svg'],
            tech: 'Excel VBA',
            summary: '他社システムから乗り換える顧客企業（数千人規模）のために作った、データ変換ツール。',
            result: '5万行以上のデータを変換。手作業だと数週間はかかる作業を約3時間に短縮。別の1社にも内容を調整して展開。',
            problem: '他社システムから抽出したデータは形式が異なり、そのままでは取り込めなかった。',
            action: '複数列の結合・抽出を含む変換で約7列に整理し、自社システムの形式に変換。テストデータで検証を繰り返した。',
            point: 'VBAツールは計20〜30本作成。「ボタンを押す→ファイルを選ぶ→実行」の操作とデザインを全ツールで統一し、使い方を覚える負担をなくした。',
          }),
          filledWork({
            title: '添付ファイルの自動仕分け',
            images: ['images/work-pa-sort.svg'],
            tech: 'Power Automate',
            summary: 'Outlookに届いたメールの添付ファイルを読み取り、条件に応じてDropboxの該当フォルダへ自動で格納するフロー。未経験から自分で習得して作成。',
            result: '毎日の業務で使われている。',
            problem: '特定の送信元から届く添付ファイルを、毎回手作業で確認して仕分けていた。',
            action: '説明された手作業の手順をそのまま再現するのではなく、「条件に合うファイルが正しいフォルダに入ること」という目的を確認してから要件をまとめた。',
            point: 'エラー内容をExcelに書き出す設計にし、利用者が自分で対処できるように。解決できないときは、そのファイルを共有してもらえば原因が分かる。',
          }),
          filledWork({
            title: '顧客データのダッシュボード',
            images: ['images/work-looker-dashboard.svg'],
            tech: 'Looker（LookML）、BigQuery',
            summary: '顧客が自社の顧客データを取り込み、保有率や継続率などを一覧で確認できるダッシュボード。約10ダッシュボード・約120タイルを作成。',
            problem: '自社の顧客データの分析をExcel等で行うしかなかった。',
            action: 'BigQueryのデータをもとに、LookMLでディメンション・メジャー・ビューを設計。',
            point: '未経験から自分で学んで習得し、約2年間担当。',
          }),
        ],
      },
      {
        title: 'Web制作',
        isIllustration: true,
        note: 'WordPressなどのCMSやノーコードツールを使わず、コードでの制作も可能です。',
        cards: [
          filledWork({
            title: 'サポートサイトのリニューアル',
            images: ['images/work-support-site.svg'],
            tech: 'Zendesk Guide、HTML、CSS、JavaScript',
            summary: 'システム導入企業向けのサポートサイトを、約2週間で全面リニューアル。デザイン決定後のコーディング、テスト、スマホ対応、公開、マニュアル作成を一人で担当。',
            result: '公開後半年で、電話での問い合わせが219件から101件に（約54%減）。',
            problem: 'デザイン案が標準テーマの構造と大きく異なり、そのままでは実現できなかった。',
            action: 'コードで標準テーマを大幅に作り変え、カテゴリごとにデザインが異なる4階層のページを実装。',
            point: '記事エディターで表を編集すると、トップやカテゴリのページに反映される仕組みを設計。エンジニアがいなくても担当者が更新できるようにした。',
          }),
          filledWork({
            title: '自社サイトの制作・改修',
            images: ['images/work-wordpress-sites.svg'],
            tech: 'WordPress・HTML・CSS・JavaScript・PHP',
            summary: '会社HPや商品サイトなど、自社サイト計6種の制作・改修。',
            action: '子テーマを作成してカスタマイズ。プラグインを活用し、PHPも必要に応じて調べながら記述。',
            point: 'どの画面サイズでも崩れないよう表示確認を重視。文字を画像にせずテキストで組み、検索にも配慮。',
          }),
          filledWork({
            title: 'ECサイトの構築・運用',
            images: ['images/work-ec-shop.svg'],
            tech: 'BASE・HTML・CSS・JavaScript・Photoshop',
            summary: 'BASEでのECサイト構築から運用まで、提示されたデザインの実装、商品登録、発送まで担当。',
            point: '商品画像を背景処理やしわ取りを行い、100点以上を仕上げた。',
          }),
        ],
      },
      {
        title: 'グラフィック & ムービー',
        isIllustration: true,
        cards: [
          filledWork({
            title: '商品画像の加工',
            tech: 'Photoshop',
            summary: 'ECサイトに掲載する商品画像の加工。背景の処理やしわ取りなど、100点以上を仕上げた。',
            images: ['images/work-photo.svg'],
          }),
          filledWork({
            title: 'チラシのデザイン',
            tech: 'Illustrator',
            summary: 'ラフなチラシ案をもとに、A4サイズのデザインに書き起こし。約10点を制作。',
            images: ['images/work-flyer.svg'],
          }),
          filledWork({
            title: '動画編集',
            tech: 'Premiere Pro',
            summary: 'テロップや強調表現を加えた動画の編集。約5本を制作。',
            images: ['images/work-video.svg'],
          }),
        ],
      },
      {
        title: '個人制作',
        detailLabels: ['きっかけ', 'できること', 'こだわり'], // このグループだけ詳細の項目名を変える
        cards: [
          appWork({
            title: 'WordBook（単語帳アプリ）',
            images: [
              'images/app-wordbook-1.jpg', // 単語の一覧（カードの画像）
              'images/app-wordbook-2.jpg', // 単語帳一覧
              'images/app-wordbook-3.jpg', // 分析
              'images/app-wordbook-4.jpg', // テスト（文字）
              'images/app-wordbook-5.jpg', // テスト（音声）
            ],
            url: 'https://word-book-app-three.vercel.app/',
            tech: 'HTML、CSS、React、TypeScript、Node.js',
            summary: '使っている単語帳に合わせて自分で単語を登録し、学習とテストができる英単語アプリ。',
            trigger: '手持ちの単語帳に合わせて、自分で単語を登録できるアプリが見つからなかった。',
            features: '単語帳は100単語ずつ、いくつでも作成できる。音声を登録すれば流し聞きで学習でき、覚えた単語はチェックを付けて飛ばせる。テストは日本語→英語・英語→日本語を、文字と音声の両方で出題。',
            point: 'テスト結果を正答率で表示し、単語ごとに苦手が分かるようにした。',
          }),
          appWork({
            title: 'World Knowledge（国旗アプリ）',
            images: ['images/app-flag-1.jpg'],
            url: 'https://world-knowledge.netlify.app',
            tech: 'HTML、CSS、React、TypeScript、Node.js',
            summary: '国旗・国名・地図上の場所をあわせて覚えられる、世界の国を知るためのアプリ。',
            trigger: '国旗を見てどこの国か分かるようになれば、世界をもっと知れると思った。',
            features: '各国の国旗に、人口などの情報と地図上の位置を表示。国旗→国名、国名→国旗のゲームで遊びながら覚えられる。',
            point: '国旗・国名・場所の3つを結びつけて覚えられるよう、地図での位置も表示した。',
          }),
          appWork({
            title: 'huglog（日記アプリ）',
            tech: 'HTML、CSS、React、TypeScript、Node.js',
            summary: 'AIのキャラクターと会話するだけで、その日の日記をまとめてくれるアプリ。',
            trigger: '人に相談しにくいことでも、AIなら気軽に話せる。話しているうちに出来事や気持ちを要約して、日記にしてくれたら面白いと思った。',
            features: '会話の内容から日記を自動で作成。AIが作った日記は手直しでき、自分で一から書くこともできる。',
            point: '会話から読み取った感情を、カレンダーにアイコンで残すようにした。',
          }),
          {
            ...appWork({
              title: 'ポートフォリオサイト（このサイト）',
              tech: 'HTML、CSS、JavaScript',
              summary: 'このサイト。フレームワークを使わず、HTML・CSS・JavaScriptだけで制作し、GitHub Pagesで公開。',
              trigger: '画面の50%の位置を基準線にして本文の左端を揃え、余白や文字組み（字間・文節での改行）を全ページで統一した。',
              features: 'ホイール・スワイプ・キーボードでセクションを切り替えられるようにし、中身が長いページは最後まで読んでから次へ進む動きにした。お問い合わせフォームは、未入力の項目を欄の下に表示する。',
              point: '文章や実績は1つのファイルにまとめ、そこを書き換えるだけで更新できるようにした。Googleアナリティクスで閲覧状況も計測している。',
            }),
            images: ['ogp.png'],
            detailLabels: ['デザイン', '操作性', '運用のしやすさ'], // このカードだけ項目名を変える（trigger / features / point の順）
          },
        ],
      },
    ],

    // STRENGTH
    // description は 1要素 = 1行
    strengths: [
      {
        title: '自走力',
        description: [
          '前任者のいない環境で、技術担当を一人で務めてきました。',
          'Power AutomateやLookerは未経験から自分で調べて習得し、実際の業務に導入しています。',
          '初めて扱う技術でも、止まらずに形にします。',
        ],
      },
      {
        title: '運用しやすい設計',
        description: [
          '作って終わりではなく、使う人が自分で回せる状態を目指します。',
          '操作方法の統一やエラー内容の書き出し、修正マニュアルの作成まで設計し、リニューアルしたサポートサイトは公開後も担当者が自分で運用しています。',
        ],
      },
      {
        title: '代替案の提案',
        description: [
          '依頼された手順をそのまま作るのではなく、まず実現したい目的を確認します。',
          '技術的に難しい要望でも「できません」で終わらせず、目的を満たす別の方法を提案して形にしてきました。',
        ],
      },
    ],

    // SKILL
    skills: [
      { name: 'kintone', description: 'JavaScriptカスタマイズ、REST API連携、プラグイン開発' },
      { name: 'Excel VBA', description: '業務ツールの自動化、大量データの処理' },
      { name: 'Power Automate', description: 'メール連携の自動化、エラー内容の出力' },
      { name: 'Google Apps Script', description: '小規模な自動化' },
      { name: 'Looker / BigQuery', description: 'データの集計と可視化' },
      { name: 'Zendesk Guide', description: 'サポートサイトの制作' },
      { name: 'WordPress', description: '子テーマでのカスタマイズ' },
      { name: 'BASE', description: 'ECサイトの構築' },
      { name: 'Photoshop / Illustrator / Premiere Pro / Figma / Canva', description: 'デザインデータへの落とし込み、動画編集' },
    ],
    languages: [
      { label: '主に使用', items: ['HTML', 'CSS', 'JavaScript（jQuery）', 'Excel VBA', 'LookML'] },
      {
        label: '使用経験あり',
        items: ['React', 'TypeScript', 'Node.js', 'C#（Unity）', 'Ruby', 'Ruby on Rails', 'Google Apps Script', 'SQL', 'PHP'],
      },
    ],
    aiNote: '開発には生成AIも活用し、効率よく進めています。出力内容の確認と動作検証は自分で行います。',

    // CONTACT
    // 迷惑メール対策（ハニーポット等）は未導入。届くようになったら検討
    form: {
      action: 'https://docs.google.com/forms/d/e/1FAIpQLSdCCNX03l9aJMuiQIJj82sk-LhdS3MJzxuRopSt2XrEL5wtwg/formResponse',
      entries: {
        name: 'entry.1205416184',
        email: 'entry.196144356',
        type: 'entry.1328257245',
        message: 'entry.959593394',
      },
      // Googleフォームの選択肢と1文字でも違うと送信できない
      types: ['業務効率化', 'Web制作', 'アプリ制作', 'その他'],
      // 送信後のポップアップ
      thanks: {
        title: 'お問い合わせありがとうございます',
        message: '内容を確認のうえ、ご入力いただいたメールアドレス宛にご連絡いたします。',
      },
    },
    privacy: [
      'ご入力いただいた個人情報は、お問い合わせへの対応およびご連絡の目的にのみ利用いたします。',
      '法令に基づく場合を除き、第三者に開示・提供することはありません。',
      '本サイトではアクセス解析のためGoogleアナリティクスを使用しています。',
    ],
  };
})();
