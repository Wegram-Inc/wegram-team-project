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
    // In production, replace with Google Translate API
    const translations = texts.map((text: string) => {
      // Check if it's a number or special character only
      if (/^[\d\s\W]+$/.test(text)) {
        return text; // Don't translate numbers and special chars
      }

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
          'Search @handle or posts...': 'Buscar @usuario o publicaciones...',
          'Trenches': 'Trincheras',
          'followers': 'seguidores',
          'following': 'siguiendo',
          'Like': 'Me gusta',
          'Reply': 'Responder',
          'Share': 'Compartir',
          'View all trending': 'Ver todas las tendencias',
          'Game': 'Juego',
          'TRENDING': 'TENDENCIAS',
          'Follow': 'Seguir',
          'Unfollow': 'Dejar de seguir',
          'Block': 'Bloquear',
          'Report': 'Reportar',
          'Not Interested': 'No me interesa',
          'Analytics': 'Analíticas',
          'Wallet': 'Billetera',
          'Video': 'Video',
          'Rewards': 'Recompensas',
          'Create': 'Crear',
          'launch': 'lanzar',
          'token': 'token',
          'ready': 'listo',
          'Soon': 'Pronto',
          'Coming': 'Próximamente',
          'Get': 'Obtener',
          'own': 'propio',
          'cryptocurrency': 'criptomoneda',
          'zero': 'cero',
          'coding': 'codificación',
          'required': 'requerido',
          'deploy': 'desplegar',
          'manage': 'gestionar',
          'blockchain': 'blockchain',
          'powerful': 'poderoso',
          'Help': 'Ayuda',
          'Wegram AI': 'Wegram AI',
          'Livestream': 'Transmisión en vivo',
          'Buy Wegram': 'Comprar Wegram',
          '2FA Settings': 'Configuración 2FA',
          'Log Out': 'Cerrar sesión',
          'WeRunner': 'WeRunner',
          'Epic anime-style battle runner': 'Corredor de batalla estilo anime épico',
          'Stunning visuals and epic': 'Visuales impresionantes y épicos',
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
          'Search @handle or posts...': 'Rechercher @pseudo ou publications...',
          'Trenches': 'Tranchées',
          'followers': 'abonnés',
          'following': 'abonnements',
          'Like': 'J\'aime',
          'Reply': 'Répondre',
          'Share': 'Partager',
          'View all trending': 'Voir toutes les tendances',
          'Game': 'Jeu',
          'TRENDING': 'TENDANCES',
          'Follow': 'Suivre',
          'Unfollow': 'Ne plus suivre',
          'Block': 'Bloquer',
          'Report': 'Signaler',
          'Not Interested': 'Pas intéressé',
          'Analytics': 'Analytiques',
          'Wallet': 'Portefeuille',
          'Video': 'Vidéo',
          'Rewards': 'Récompenses',
          'Create': 'Créer',
          'launch': 'lancer',
          'token': 'jeton',
          'ready': 'prêt',
          'Soon': 'Bientôt',
          'Coming': 'À venir',
          'Get': 'Obtenir',
          'own': 'propre',
          'cryptocurrency': 'cryptomonnaie',
          'zero': 'zéro',
          'coding': 'codage',
          'required': 'requis',
          'deploy': 'déployer',
          'manage': 'gérer',
          'blockchain': 'blockchain',
          'powerful': 'puissant',
          'Help': 'Aide',
          'Wegram AI': 'Wegram AI',
          'Livestream': 'Diffusion en direct',
          'Buy Wegram': 'Acheter Wegram',
          '2FA Settings': 'Paramètres 2FA',
          'Log Out': 'Se déconnecter',
          'WeRunner': 'WeRunner',
          'Epic anime-style battle runner': 'Jeu de course de bataille style anime épique',
          'Stunning visuals and epic': 'Visuels époustouflants et épiques',
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
          'Analytics': '分析',
          'Wallet': '钱包',
          'Video': '视频',
          'Rewards': '奖励',
          'Create': '创建',
          'launch': '启动',
          'token': '代币',
          'ready': '准备好',
          'Soon': '即将推出',
          'Coming': '即将到来',
          'Get': '获得',
          'own': '自己的',
          'cryptocurrency': '加密货币',
          'zero': '零',
          'coding': '编码',
          'required': '需要',
          'deploy': '部署',
          'manage': '管理',
          'blockchain': '区块链',
          'powerful': '强大的',
          'Help': '帮助',
          'Wegram AI': 'Wegram AI',
          'Livestream': '直播',
          'Buy Wegram': '购买 Wegram',
          '2FA Settings': '双重认证设置',
          'Log Out': '登出',
          'WeRunner': 'WeRunner',
          'Epic anime-style battle runner': '史诗动漫风格战斗跑酷',
          'Stunning visuals and epic': '令人惊叹的视觉效果和史诗',
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