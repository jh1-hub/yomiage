/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SampleText {
  id: string;
  category: string;
  title: string;
  author?: string;
  description: string;
  text: string;
}

export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: 'rashomon',
    category: '名作文学',
    title: '羅生門（冒頭）',
    author: '芥川龍之介',
    description: '重厚な文体と緊張感あふれる近代日本文学の最高峰',
    text: `ある日の暮方の事である。一人の下人が、羅生門の下で雨やみを待っていた。
広い門の下には、この男のほかに誰もいない。ただ、所々丹塗のはげた、大きな円柱に、蟋蟀が一匹とまっている。羅生門が、朱雀大路にある以上は、この男のほかにも、雨やみをする市女笠や揉烏帽子が、もう二三人はありそうなものである。それが、この男のほかには誰もいない。
なぜかと云うと、この二三年、京都には、地震とか辻風とか火事とか饑饉とか云う災いがつづいて起った。そこで洛中のさびれ方は一通りではない。旧記によると、仏像や仏具を打砕いて、その丹のついた、あるいは金銀の箔のついた木を、路ばたに積み合せて、薪の料に売っていたと云う事である。洛中がその始末であるから、羅生門の修理などは、元より誰も捨てて顧る者がなかった。するとその荒れ果てたのをよい事にして、狐狸が棲む。盗人が棲む。とうとうしまいには、引取り手のない死人を、この門へ持って来て、棄てて行くと云う習慣さえ出来た。そこで、日の目が見えなくなると、誰でも気味を悪がって、この門の近所へは足ぶみをしないことになってしまったのである。`
  },
  {
    id: 'amenimo',
    category: '名作文学',
    title: '雨ニモマケズ',
    author: '宮沢賢治',
    description: 'リズム感のある美しい日本語の詩',
    text: `雨ニモマケズ
風ニモマケズ
雪ニモ夏ノ暑サニモマケヌ
丈夫ナカラダヲモチ
慾ハナク
決シテ瞋ラズ
イツモシヅカニワラッテヰル
一日ニ玄米四合ト
味噌ト少シノ野菜ヲタベ
アラユルコトヲ
ジブンヲカンジョウニ入レズニ
ヨクミキキシワカリ
ソシテワスレズ
野原ノ松ノ林ノ蔭ノ
小サナ萓ブキノ小屋ニヰテ
東ニ病気ノコドモアレバ
行ッテ看病シテヤリ
西ニツカレタ母アレバ
行ッテソノ稲ノ束ヲ負ヒ
南ニ死ニサウナ人アレバ
行ッテコハガラナクテモイヽトイヒ
北ニケンクヮヤソショウガアレバ
ツマラナイカラヤメロトイヒ
ヒデリノトキハナミダヲナガシ
サムサノナツハオロオロアルキ
ミンナニデクノボウトヨバレ
ホメラレモセズ
クニモサレズ
サウイフモノニ
ワタシハナリタイ`
  },
  {
    id: 'wagahai',
    category: '名作文学',
    title: '吾輩は猫である（冒頭）',
    author: '夏目漱石',
    description: '軽妙洒脱な語り口で親しまれる名作',
    text: `吾輩は猫である。名前はまだ無い。
どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。しかしその当時は何という考もなかったから別段恐しいとも思わなかった。ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。掌の上で少し落ちついて書生の顔を見たのがいわゆる人間というものの見始であろう。この時妙なものだと思った感じが今でも残っている。第一毛をもって装飾されべきはずの顔がつるつるしてまるで薬缶だ。その後猫にも大分逢ったがこんな片輪には一度も出会わした事がない。のみならず顔の真中があまりに突起している。そうしてその穴の中から時々ぷうぷうと煙を吹く。どうも咽せぽくて実に弱った。これが人間の飲む煙草というものである事は漸くここに至って知った。`
  },
  {
    id: 'tongue-twisters',
    category: '発音・滑舌',
    title: '日本の代表的な早口言葉',
    description: '読み上げ速度を上げて滑舌やイントネーションの確認に最適',
    text: `東京特許許可局局長、今日急遽許可却下。
生麦、生米、生卵。
赤巻紙、青巻紙、黄巻紙。
坊主が屏風に上手に坊主の絵を描いた。
隣の客はよく柿食う客だ。
竹垣に竹立てかけたのは竹立てかけたかったから竹立てかけた。
新人歌手新春シャンソンショー。
美術室、技術室、手術室、美術準備室、技術準備室、手術準備室。
魔術師手術中、手術中集中術。
この竹垣に竹立てかけたのは、竹立てかけたかったから、竹立てかけたのだ。`
  },
  {
    id: 'business-email',
    category: '実務・ビジネス',
    title: 'プロジェクト完了と御礼メール',
    description: '実務でよく使われるビジネスメールの読み合わせ確認',
    text: `件名：【御礼】新システム導入プロジェクト完了のご報告

株式会社サンプル
システム開発部　部長　山田 太郎 様

いつも大変お世話になっております。
株式会社イノベーションの佐藤でございます。

さて、昨年10月より進めてまいりました「新基幹システムリニューアルプロジェクト」におきまして、本日無事に全拠点の移行および本番稼働が完了いたしましたことをご報告申し上げます。

多大なるご協力を賜りました貴社プロジェクトメンバーの皆様、ならびに関係各位に心より深く御礼申し上げます。

なお、今後の保守運用体制やお問い合わせ窓口につきましては、添付の運用マニュアルをご参照ください。
本番稼働から1か月間は集中モニタリング期間とし、迅速なサポートを実施いたします。

ご不明な点やご要望がございましたら、いつでも佐藤までご連絡ください。
今後とも何卒よろしくお願い申し上げます。`
  },
  {
    id: 'news-weather',
    category: 'ニュース・情報',
    title: '天気予報と季節のニュース',
    description: 'アナウンサーのような流れるような音声読み上げのテスト',
    text: `気象庁の発表によりますと、日本列島は広い範囲で高気圧に覆われ、各地で穏やかな晴天となる見込みです。
本日の最高気温は、東京都心で22度、名古屋で23度、大阪で24度と、初夏を思わせる心地よい陽気となるでしょう。
一方、朝晩は放射冷却の影響で冷え込み、昼夜の気温差が10度以上開く地域もありますので、服装で上手に調節してください。
なお、週末にかけては南から前線が北上するため、太平洋側を中心に天気が下り坂に向かう見通しです。お出かけやお洗濯は、明日の日中がおすすめです。`
  },
  {
    id: 'english-japanese',
    category: '語学・学習',
    title: '旅行英会話＆日本語対訳',
    description: '日英混在文や語学学習のリスニング確認',
    text: `Excuse me, could you tell me how to get to the station?
すみません、駅へはどう行けばいいですか？

Sure! Go straight along this street and turn right at the second traffic light.
もちろんです！この道をまっすぐ進んで、2つ目の信号を右に曲がってください。

You will see the station entrance on your left. It takes about five minutes on foot.
左手に駅の入り口が見えますよ。歩いて5分ほどです。

Thank you so much for your kind help. Have a wonderful day!
ご親切に教えていただき、本当にありがとうございます。良い一日を！`
  }
];

export const DEFAULT_PRONUNCIATION_RULES = [
  { id: '1', pattern: 'AI', replacement: 'エーアイ', enabled: true },
  { id: '2', pattern: 'URL', replacement: 'ユーアールエル', enabled: true },
  { id: '3', pattern: 'ID', replacement: 'アイディー', enabled: true },
  { id: '4', pattern: 'PDF', replacement: 'ピーディーエフ', enabled: true },
  { id: '5', pattern: 'PC', replacement: 'ピーシー', enabled: true },
  { id: '6', pattern: 'SNS', replacement: 'エスエヌエス', enabled: true },
  { id: '7', pattern: 'IT', replacement: 'アイティー', enabled: true },
  { id: '8', pattern: 'DX', replacement: 'ディーエックス', enabled: true },
  { id: '9', pattern: 'Wi-Fi', replacement: 'ワイファイ', enabled: true },
  { id: '10', pattern: 'WiFi', replacement: 'ワイファイ', enabled: true },
  { id: '11', pattern: 'SDGs', replacement: 'エスディージーズ', enabled: true },
  { id: '12', pattern: '1日', replacement: '一日（ついたち）', enabled: true },
  { id: '13', pattern: '20日', replacement: '二十日（はつか）', enabled: true },
  { id: '14', pattern: '1人', replacement: 'ひとり', enabled: true },
  { id: '15', pattern: '2人', replacement: 'ふたり', enabled: true },
  { id: '16', pattern: '1つ', replacement: 'ひとつ', enabled: true },
  { id: '17', pattern: '2つ', replacement: 'ふたつ', enabled: true },
  { id: '18', pattern: '3つ', replacement: 'みっつ', enabled: true },
  { id: '19', pattern: '％', replacement: 'パーセント', enabled: true },
  { id: '20', pattern: '&', replacement: 'アンド', enabled: true },
];
