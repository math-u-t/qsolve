import type { User, Problem } from '@/types'

const avatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
]

const names = [
  '田中太郎', '佐藤花子', '鈴木一郎', '高橋美咲',
  '伊藤翔太', '渡辺愛', '山本健太', '中村さくら',
  '小林優斗', '加藤結衣', '吉田蓮', '山田陽菜'
]

const grades = [
  '1年A組', '1年B組', '1年C組',
  '2年A組', '2年B組', '2年C組',
  '3年A組', '3年B組', '3年C組'
]

export function generateMockUsers(count: number = 20): User[] {
  const users: User[] = []

  for (let i = 0; i < count; i++) {
    users.push({
      id: `user-${i + 1}`,
      name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
      avatar: avatars[i % avatars.length],
      grade: grades[i % grades.length],
      totalPoints: Math.floor(Math.random() * 5000) + 100,
      rank: 0, // Will be calculated
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      todayPoints: Math.floor(Math.random() * 200),
      todayPostCount: Math.floor(Math.random() * 3)
    })
  }

  // Sort by points and assign ranks
  users.sort((a, b) => b.totalPoints - a.totalPoints)
  users.forEach((user, index) => {
    user.rank = index + 1
  })

  return users
}

const problemTitles = [
  '数学オリンピック級の難問',
  '論理パズル：帽子の色',
  '漢字クイズ：四字熟語',
  'プログラミング：フィボナッチ数列',
  '物理：等加速度運動',
  '化学：モル計算',
  '英語：イディオム当て',
  '歴史：戦国時代の人物',
  '地理：世界の首都',
  '国語：古文の解釈',
  '数学：確率の問題',
  '理科：天体の動き'
]

const problemContents = [
  `# 問題

次の数列の規則性を見つけて、□に入る数を答えなさい。

2, 5, 11, 23, 47, □

**ヒント**: 各項の関係に注目してください。`,

  `# 論理パズル

3人の囚人が赤い帽子か青い帽子のどちらかをかぶせられています。自分の帽子の色は見えませんが、他の2人の帽子は見えます。

実際には赤い帽子は2つ、青い帽子は3つあります。全員が赤い帽子をかぶっている場合、誰が最初に自分の帽子の色を当てられるでしょうか？

答えは「A」「B」「C」または「誰も当てられない」で答えてください。`,

  `# 四字熟語

次の説明に当てはまる四字熟語を答えなさい。

**説明**: 物事の始まりと終わりが一致すること。最初の志を最後まで貫き通すこと。

漢字4文字で答えてください。`,

  `# フィボナッチ数列

フィボナッチ数列の20番目の数は何でしょうか？

数列: 1, 1, 2, 3, 5, 8, 13, ...`,

  `# 物理の問題

初速度0 m/sで加速度2 m/s²で等加速度運動をする物体が、10秒後に到達する速度は何m/sでしょうか？

**公式**: v = v₀ + at`
]

export function generateMockProblems(users: User[], count: number = 10): Problem[] {
  const problems: Problem[] = []

  for (let i = 0; i < count; i++) {
    const mode = Math.random() > 0.5 ? 'speed' : 'challenge'
    const author = users[Math.floor(Math.random() * users.length)]
    const createdDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)

    let status: Problem['status'] = 'open'
    if (Math.random() > 0.7) {
      status = 'solved'
    } else if (Math.random() > 0.8) {
      status = 'sampling'
    }

    const problem: Problem = {
      id: `problem-${i + 1}`,
      authorId: author.id,
      mode,
      title: problemTitles[i % problemTitles.length],
      content: problemContents[i % problemContents.length],
      answer: mode === 'speed' ? '95' : '有言実行',
      answerType: 'text',
      status,
      samplingUsers: status === 'sampling'
        ? users.slice(0, 5).filter(u => u.id !== author.id).map(u => u.id)
        : [],
      samplingEndTime: status === 'sampling'
        ? new Date(Date.now() + 30 * 60 * 1000)
        : undefined,
      createdAt: createdDate,
      solvedAt: status === 'solved' ? new Date(createdDate.getTime() + Math.random() * 24 * 60 * 60 * 1000) : undefined,
      timeLimit: mode === 'speed' ? 3600 : undefined, // 1 hour for speed mode
      accumulatedPoints: mode === 'speed' ? 100 : Math.floor(50 + Math.random() * 200),
      attemptCount: Math.floor(Math.random() * 20),
      solvedBy: status === 'solved' ? users[Math.floor(Math.random() * users.length)].id : undefined
    }

    problems.push(problem)
  }

  return problems
}

export function initializeMockData() {
  // Check if data already exists
  const existingUsers = localStorage.getItem('qsolve-users')
  const existingProblems = localStorage.getItem('qsolve-problems')

  if (!existingUsers || !existingProblems) {
    // Generate mock data
    const users = generateMockUsers(20)
    const problems = generateMockProblems(users, 15)

    // Save to localStorage
    localStorage.setItem('qsolve-users', JSON.stringify(users))
    localStorage.setItem('qsolve-problems', JSON.stringify(problems))

    console.log('Mock data initialized')
    return true
  }

  return false
}
