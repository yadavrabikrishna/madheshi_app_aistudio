import { PostItem, CategoryItem } from './types';

// Fallback curated articles from Madheshi.com for offline resilience
export const BUNDLED_FALLBACK_POSTS: PostItem[] = [
  {
    id: 101,
    title: 'मधेश प्रदेश सरकारद्वारा कृषि सिँचाइ तथा सौर्य ऊर्जा परियोजना घोषणा',
    excerpt: 'तराई-मधेशका किसानहरूलाई खडेरी र सिँचाइ समस्याबाट मुक्त गर्न विशेष सौर्य पम्पिङ अनुदान योजना सुरु गरिएको छ।',
    content: `
      <p>मधेश प्रदेश सरकारको भूमि व्यवस्था, कृषि तथा सहकारी मन्त्रालयले चालू आर्थिक वर्षमा तराई-मधेशका आठवटै जिल्लाका साना तथा सीमान्तकृत किसानहरूका लागि बृहत् कृषि सिँचाइ तथा सौर्य ऊर्जा कार्यक्रम कार्यान्वयनमा ल्याएको छ।</p>
      <p>यस योजना अन्तर्गत विपन्न किसान समूहहरूलाई ७५ प्रतिशतसम्म अनुदानमा सोलार बोरिङ पम्पिङ सेट उपलब्ध गराइने भएको छ। धनुषा, महोत्तरी, सर्लाही, रौतहट, बारा, पर्सा, सिरहा र सप्तरी जिल्लामा किसानहरूले स्थानीय कृषि ज्ञान केन्द्र मार्फत आवेदन दिन सक्नेछन्।</p>
      <p>कार्यक्रमको मुख्य उद्देश्य भूमिगत जलस्रोतको दिगो उपयोग गर्दै हिउँदे र बर्खे बालीको उत्पादकत्वमा वृद्धि गर्नु र किसानको कृषि लागत घटाउनु रहेको मन्त्रालयका प्रवक्ताले जानकारी दिनुभयो।</p>
    `,
    date: '2026-11-05T08:30:00',
    link: 'https://madheshi.com/agriculture-solar-irrigation-project/',
    authorName: 'मधेशी डेस्क',
    featuredImageUrl: 'https://picsum.photos/seed/madhesh_agri/800/480',
    categories: [
      { id: 1, name: 'कृषि तथा विकास' },
      { id: 2, name: 'मधेश समाचार' },
    ],
    isCached: true,
  },
  {
    id: 102,
    title: 'जनकपुरधाममा मिथिला चित्रकला र परम्परागत हस्तकला प्रदर्शनी सुरु',
    excerpt: 'ऐतिहासिक मिथिला संस्कृतिको जगेर्ना र महिला सशक्तिकरणलाई टेवा पुर्याउने उद्देश्यले तीन दिने बृहत् कला प्रदर्शनी आयोजना।',
    content: `
      <p>जनकपुरधामको ऐतिहासिक जानकी मन्दिर परिसर नजिकै मिथिला चित्रकला, माटोका भाँडाकुँडा, बाँसका सामग्री र परम्परागत सिकिया हस्तकलाको तीन दिने राष्ट्रिय प्रदर्शनी आजदेखि सुरु भएको छ।</p>
      <p>प्रदर्शनीमा मधेशका विभिन्न ग्रामीण भेगका ५० भन्दा बढी महिला उद्यमी तथा सिद्धहस्त कलाकारहरूले आफ्ना मौलिक कलाकृतिहरू प्रदर्शन गरेका छन्। कोहबर, अरिपन र ग्रामीण जीवन झल्काउने जीवन्त चित्रहरूले आगन्तुकहरूको मन जितेका छन्।</p>
      <p>आयोजक संस्थाका अनुसार मिथिला कलालाई अन्तर्राष्ट्रिय बजारसँग जोड्न र नयाँ पुस्तालाई परम्परागत कलामा आकर्षित गर्न यो प्रदर्शनी निरन्तर आयोजना हुँदै आएको छ।</p>
    `,
    date: '2026-11-04T11:15:00',
    link: 'https://madheshi.com/janakpur-mithila-art-exhibition/',
    authorName: 'रामचन्द्र मण्डल',
    featuredImageUrl: 'https://picsum.photos/seed/mithila_art/800/480',
    categories: [
      { id: 3, name: 'कला र संस्कृति' },
      { id: 2, name: 'मधेश समाचार' },
    ],
    isCached: true,
  },
  {
    id: 103,
    title: 'हुलाकी राजमार्ग निर्माणमा तीव्रता: दक्षिण तराईका बस्तीहरूको आर्थिक कायापलट',
    excerpt: 'सप्तरीदेखि पर्सासम्म जोड्ने हुलाकी सडकखण्डमा कालोपत्रे कार्य अन्तिम चरणमा, सीमावर्ती बजारहरूमा व्यापारिक चहलपहल बढ्यो।',
    content: `
      <p>तराई-मधेशको जीवनरेखा मानिने हुलाकी राजमार्ग अन्तर्गतका विभिन्न खण्डहरूमा पुल तथा सडक स्तरोन्नति कार्य तीव्र पारिएको छ। यसले गर्दा लामो समयदेखि यातायातको पहुँचबाट टाढा रहेका दक्षिणवर्ती ग्रामीण बस्तीहरू प्रत्यक्ष रूपमा मुख्य व्यापारिक केन्द्रहरूसँग जोडिन थालेका छन्।</p>
      <p>स्थानीय व्यापारी तथा किसानहरूका अनुसार सडक निर्माणसँगै तरकारी, दूध र अन्य कृषि उपजहरू समयमै सहरका बजारहरूमा पुर्याउन सहज भएको छ। यात्रा समय आधा घटेको र स्थानीय अर्थतन्त्रमा सकारात्मक प्रभाव परेको छ।</p>
      <p>सडक विभागले बाँकी रहेका पुल तथा पहुँच मार्गहरूको काम पनि तोकिएको समयमै पूरा गर्ने प्रतिबद्धता जनाएको छ।</p>
    `,
    date: '2026-11-03T14:45:00',
    link: 'https://madheshi.com/hulaki-highway-progress-update/',
    authorName: 'सुरेश कुमार यादव',
    featuredImageUrl: 'https://picsum.photos/seed/highway_madhesh/800/480',
    categories: [
      { id: 4, name: 'यातायात र पूर्वाधार' },
      { id: 2, name: 'मधेश समाचार' },
    ],
    isCached: true,
  },
  {
    id: 104,
    title: 'वीरगञ्ज सुख्खा बन्दरगाहबाट निकासी-पैठारीमा नयाँ कीर्तिमान',
    excerpt: 'नेपाल-भारत व्यापारिक नाकामा डिजिटल प्रणाली र आधुनिक पूर्वाधार विस्तार भएसँगै राजस्व सङ्कलन र ढुवानी सहजीकरणमा उल्लेख्य सुधार।',
    content: `
      <p>देशको प्रमुख व्यापारिक प्रवेशद्वार वीरगञ्जस्थित एकीकृत जाँच चौकी (ICF) र सुख्खा बन्दरगाह (Dry Port) मार्फत हुने वैदेशिक व्यापारमा सकारात्मक सुधार देखिएको छ। मालवाहक रेल तथा कन्टेनर व्यवस्थापनमा लागु गरिएको नयाँ डिजिटलाइज्ड प्रणालीले प्रक्रियालाई छरितो बनाएको छ।</p>
      <p>व्यवसायीहरूका अनुसार भन्सार जाँचपासमा लाग्ने समय घटेको र अनलाइन कागजात प्रणालीले पारदर्शिता बढाएको छ। यसले गर्दा आयात-निर्यात लागतमा पनि कमी आएको उद्योग वाणिज्य महासङ्घका प्रतिनिधिहरूले बताएका छन्।</p>
    `,
    date: '2026-11-02T16:20:00',
    link: 'https://madheshi.com/birgunj-dry-port-trade-growth/',
    authorName: 'अमृता सिंह',
    featuredImageUrl: 'https://picsum.photos/seed/birgunj_port/800/480',
    categories: [
      { id: 5, name: 'अर्थ र वाणिज्य' },
    ],
    isCached: true,
  },
  {
    id: 105,
    title: 'मधेशका सामुदायिक विद्यालयहरूमा मातृभाषामा शिक्षण सामग्री वितरण',
    excerpt: 'मैथिली, भोजपुरी र बज्जिका भाषामा प्राथमिक तहका पाठ्यसामग्री तयार गरी वितरण सुरु गरिएको छ।',
    content: `
      <p>बालबालिकाको सिकाइ उपलब्धिलाई सुदृढ बनाउन मधेश प्रदेशका विभिन्न स्थानीय तहहरूले प्राथमिक तहका विद्यार्थीहरूका लागि स्थानीय मातृभाषाका पूरक पाठ्यपुस्तक तथा सचित्र शिक्षण सामग्री वितरण सुरु गरेका छन्।</p>
      <p>शिक्षाविद्हरूका अनुसार प्रारम्भिक बाल्यकालमा मातृभाषामा सिकाइ हुँदा बालबालिकाको समझदारी शक्ति र विद्यालयमा टिकिराख्ने दर दुवै उच्च रहन्छ। यस कार्यक्रमलाई आगामी वर्षहरूमा अझै व्यवस्थित बनाउने शिक्षा विकास निर्देशनालयले जनाएको छ।</p>
    `,
    date: '2026-11-01T09:00:00',
    link: 'https://madheshi.com/madhesh-mother-tongue-education/',
    authorName: 'दिलीप शाह',
    featuredImageUrl: 'https://picsum.photos/seed/education_nepal/800/480',
    categories: [
      { id: 6, name: 'शिक्षा र समाज' },
    ],
    isCached: true,
  },
];

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 0, name: 'सबै', slug: 'all', count: 5 },
  { id: 2, name: 'मधेश समाचार', slug: 'madhesh-samachar', count: 3 },
  { id: 1, name: 'कृषि तथा विकास', slug: 'agriculture', count: 1 },
  { id: 3, name: 'कला र संस्कृति', slug: 'culture', count: 1 },
  { id: 4, name: 'यातायात र पूर्वाधार', slug: 'infrastructure', count: 1 },
  { id: 5, name: 'अर्थ र वाणिज्य', slug: 'economy', count: 1 },
  { id: 6, name: 'शिक्षा र समाज', slug: 'education', count: 1 },
];

const LOCAL_STORAGE_CACHE_KEY = 'madheshi_news_cache';
const LOCAL_STORAGE_BOOKMARKS_KEY = 'madheshi_news_bookmarks';

/**
 * Fetch news from WordPress REST API via server proxy or client fallback.
 */
export async function fetchNewsPosts(options?: {
  categoryId?: number;
  search?: string;
  page?: number;
}): Promise<{ posts: PostItem[]; isOffline: boolean }> {
  const queryParams = new URLSearchParams();
  if (options?.categoryId && options.categoryId > 0) {
    queryParams.set('category', options.categoryId.toString());
  }
  if (options?.search) {
    queryParams.set('search', options.search.trim());
  }
  if (options?.page) {
    queryParams.set('page', options.page.toString());
  }

  try {
    const res = await fetch(`/api/news?${queryParams.toString()}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.posts) && data.posts.length > 0) {
        // Cache to localStorage
        savePostsToLocalCache(data.posts);
        return { posts: data.posts, isOffline: !!data.isOffline };
      }
    }
  } catch (err) {
    console.warn('Network fetch error, falling back to cached news:', err);
  }

  // Fallback to local storage or bundled fallback
  const cached = getPostsFromLocalCache();
  let results = cached.length > 0 ? cached : BUNDLED_FALLBACK_POSTS;

  if (options?.categoryId && options.categoryId > 0) {
    results = results.filter((p) => p.categories.some((c) => c.id === options.categoryId));
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    results = results.filter(
      (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    );
  }

  return {
    posts: results.map((p) => ({ ...p, isCached: true })),
    isOffline: true,
  };
}

export function savePostsToLocalCache(posts: PostItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getPostsFromLocalCache();
    const map = new Map<number, PostItem>();
    existing.forEach((p) => map.set(p.id, p));
    posts.forEach((p) => map.set(p.id, { ...p, isCached: true }));
    const merged = Array.from(map.values()).slice(0, 30);
    localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(merged));
  } catch {
    // Ignore storage quota or disabled errors
  }
}

export function getPostsFromLocalCache(): PostItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore
  }
  return [];
}

export function clearLocalNewsCache(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_CACHE_KEY);
  } catch {
    // Ignore
  }
}

// Bookmarks (Saved Articles)
export function getSavedBookmarks(): PostItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore
  }
  return [];
}

export function isArticleBookmarked(postId: number): boolean {
  const bookmarks = getSavedBookmarks();
  return bookmarks.some((b) => b.id === postId);
}

export function toggleArticleBookmark(post: PostItem): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const bookmarks = getSavedBookmarks();
    const idx = bookmarks.findIndex((b) => b.id === post.id);
    let newBookmarks: PostItem[];
    let bookmarked: boolean;
    if (idx >= 0) {
      newBookmarks = bookmarks.filter((b) => b.id !== post.id);
      bookmarked = false;
    } else {
      newBookmarks = [post, ...bookmarks];
      bookmarked = true;
    }
    localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    return bookmarked;
  } catch {
    return false;
  }
}
