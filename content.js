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
    details: [TBD, TBD, TBD], // 課題 / やったこと / 工夫
    images: ['', ''], // 空なら Coming soon
    url: '', // 入れると名前の横にリンクアイコンが出る
    ...overrides,
  });

  const toolWork = (tool) => work(tool, { title: tool, name: tool });

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

    // WORKS（isReproduction: 画像に「再現イメージ」を付ける）
    works: [
      {
        title: '業務効率化',
        isReproduction: true,
        cards: [
          work('kintone', { result: '月20時間の集計作業を2時間に短縮（仮）' }),
          work('Excel VBA'),
          work('Power Automate'),
          work('Google Apps Script'),
          work('Looker（LookML）、BigQuery'),
        ],
      },
      {
        title: 'Web制作',
        isReproduction: true,
        note: 'WordPressなどのCMSやノーコードツールを使わず、コードでの制作も可能です。',
        cards: [
          work('Zendesk Guide、HTML、CSS、JavaScript'),
          work('WordPress'),
          work(TBD),
          work('BASE'),
        ],
      },
      {
        title: 'グラフィック & ムービー',
        isReproduction: true,
        cards: ['Photoshop', 'Illustrator', 'Premiere Pro', 'Figma', 'Canva'].map(toolWork),
      },
      {
        title: '個人制作',
        cards: [
          work(TBD, { title: '【単語帳アプリ名】', name: '【単語帳アプリ名】' }),
          work(TBD, { title: '【国旗アプリ名】', name: '【国旗アプリ名】' }),
          work(TBD, { title: '【日記アプリ名】', name: '【日記アプリ名】' }),
          work('HTML、CSS、JavaScript'),
        ],
      },
    ],

    // STRENGTH
    strengths: [
      { title: '自走力', description: TBD },
      { title: '運用しやすい設計', description: TBD },
      { title: '代替案の提案', description: TBD },
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
    languages: ['HTML', 'CSS', 'JavaScript', 'Excel VBA', 'PHP', 'LookML', 'Google Apps Script'],
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
