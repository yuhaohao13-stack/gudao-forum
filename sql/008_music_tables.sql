-- Music Categories
CREATE TABLE IF NOT EXISTS music_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Music Songs
CREATE TABLE IF NOT EXISTS music_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES music_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  mp3_url TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  lyrics TEXT,
  cover_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE music_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_songs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read music_categories" ON music_categories;
CREATE POLICY "Allow public read music_categories" ON music_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read music_songs" ON music_songs;
CREATE POLICY "Allow public read music_songs" ON music_songs
  FOR SELECT USING (true);

-- Insert categories
INSERT INTO music_categories (name, slug, description, icon, sort_order) VALUES
  ('8090经典曲目', 'classic-8090', '重温黄金年代的旋律，那些年我们一起听过的歌', '📼', 1),
  ('网络红歌', 'viral-hits', '刷屏神曲，全网爆火，听完就上头', '🌊', 2),
  ('民谣', 'folk', '一把吉他，一段故事，唱尽人间烟火', '🎸', 3),
  ('中文名曲', 'chinese-classics', '华语乐坛传世经典，百听不厌的金曲', '🎤', 4),
  ('国际英文歌曲', 'english-songs', '跨越语言的感动，全球热单一网打尽', '🌍', 5),
  ('助眠夜曲', 'sleep-music', '纯音乐·白噪音，放下焦虑，陪你入梦', '🌙', 6)
ON CONFLICT (slug) DO NOTHING;
