// Translation API using Google Translate
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { texts, targetLang, sourceLang = 'en' } = req.body;

    if (!texts || !targetLang) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // For now, return a simple transformation
    // In production, you would integrate with Google Translate API or another translation service
    // You would need to add GOOGLE_TRANSLATE_API_KEY to your environment variables

    // Mock translation for demonstration
    const translations = texts.map((text: string) => {
      // Basic mock translations
      const basicTranslations: any = {
        'es': {
          'Home': 'Inicio',
          'Profile': 'Perfil',
          'Messages': 'Mensajes',
          'Settings': 'Configuración',
          'Get Verified': 'Verificarse',
          'Trending': 'Tendencias',
          'Explore': 'Explorar',
          'Bookmarks': 'Marcadores',
          'Games': 'Juegos',
          'Staking': 'Apuesta',
          'Launch Your Token': 'Lanza Tu Token',
          'Sign Out': 'Cerrar Sesión',
          'Members': 'Miembros',
          'Following': 'Siguiendo',
          'Followers': 'Seguidores',
          'Posts': 'Publicaciones',
          'Edit Profile': 'Editar Perfil',
          'Delete Account': 'Eliminar Cuenta',
        },
        'fr': {
          'Home': 'Accueil',
          'Profile': 'Profil',
          'Messages': 'Messages',
          'Settings': 'Paramètres',
          'Get Verified': 'Être Vérifié',
          'Trending': 'Tendances',
          'Explore': 'Explorer',
          'Bookmarks': 'Signets',
          'Games': 'Jeux',
          'Staking': 'Jalonnement',
          'Launch Your Token': 'Lancez Votre Jeton',
          'Sign Out': 'Déconnexion',
          'Members': 'Membres',
          'Following': 'Abonnements',
          'Followers': 'Abonnés',
          'Posts': 'Publications',
          'Edit Profile': 'Modifier le Profil',
          'Delete Account': 'Supprimer le Compte',
        },
        'zh': {
          'Home': '主页',
          'Profile': '个人资料',
          'Messages': '消息',
          'Settings': '设置',
          'Get Verified': '获得验证',
          'Trending': '趋势',
          'Explore': '探索',
          'Bookmarks': '书签',
          'Games': '游戏',
          'Staking': '质押',
          'Launch Your Token': '启动您的代币',
          'Sign Out': '登出',
          'Members': '成员',
          'Following': '关注',
          'Followers': '粉丝',
          'Posts': '帖子',
          'Edit Profile': '编辑资料',
          'Delete Account': '删除账户',
        },
        'ja': {
          'Home': 'ホーム',
          'Profile': 'プロフィール',
          'Messages': 'メッセージ',
          'Settings': '設定',
          'Get Verified': '認証を取得',
          'Trending': 'トレンド',
          'Explore': '探索',
          'Bookmarks': 'ブックマーク',
          'Games': 'ゲーム',
          'Staking': 'ステーキング',
          'Launch Your Token': 'トークンを起動',
          'Sign Out': 'サインアウト',
          'Members': 'メンバー',
          'Following': 'フォロー中',
          'Followers': 'フォロワー',
          'Posts': '投稿',
          'Edit Profile': 'プロフィールを編集',
          'Delete Account': 'アカウントを削除',
        }
      };

      const langTranslations = basicTranslations[targetLang];
      if (langTranslations && langTranslations[text]) {
        return langTranslations[text];
      }

      // Return original text if no translation available
      return text;
    });

    return res.status(200).json({
      success: true,
      translations
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return res.status(500).json({
      error: 'Translation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}