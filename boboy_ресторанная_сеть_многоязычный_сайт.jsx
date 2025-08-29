import React, { useEffect, useMemo, useState } from "react";
import { Leaf, Utensils, Globe2, X, MapPin, Phone, Star, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Boboy — Single-file React site
 * - TailwindCSS styling
 * - Language gate (UZ / RU / EN)
 * - Hero: Dish of the Day with premium visuals
 * - Menu below: categories, search, vegetarian filter, item modal with ingredients
 * - Footer with addresses & socials
 *
 * To use: drop this into a React app (Vite/Next/CRA). Tailwind is assumed available.
 */

export default function BoboySite() {
  const [lang, setLang] = useState(() => localStorage.getItem("boboy_lang") || "ru");
  const [showLangGate, setShowLangGate] = useState(() => !localStorage.getItem("boboy_lang"));
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [activeItem, setActiveItem] = useState(null as null | MenuItem);

  const strings = STR[lang as Lang];
  const menu = MENU[lang as Lang];

  const allItems = useMemo(() => menu.flatMap((c) => c.items.map((i) => ({ ...i, category: c.name }))), [menu]);

  // Choose Dish of the Day deterministically by date
  const dishOfDay = useMemo(() => {
    const featuredKeys = [
      "festive_pilaf",
      "lagman_uyghur",
      "kazan_kebab",
      "norin",
      "san_sebastian",
      "passion_mango_lemonade",
    ];
    const idx = new Date().getDate() % featuredKeys.length;
    const key = featuredKeys[idx];
    // find by id across categories
    for (const cat of menu) {
      const found = cat.items.find((i) => i.id === key);
      if (found) return found;
    }
    return menu[0]?.items[0];
  }, [menu]);

  const filtered = useMemo(() => {
    return allItems.filter((i) => {
      const text = (i.name + " " + (i.ingredients?.join(" ") || "") + " " + (i.category || "")).toLowerCase();
      const okQuery = !query || text.includes(query.toLowerCase());
      const okVeg = !vegOnly || i.veg;
      return okQuery && okVeg;
    });
  }, [allItems, query, vegOnly]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    runSelfTestsForBoboy();
  }, []);

  const onChooseLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("boboy_lang", l);
    setShowLangGate(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <LanguageGate
        open={showLangGate}
        onSelect={onChooseLang}
      />

      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 via-rose-400 to-fuchsia-500 shadow-lg" />
            <div className="leading-tight">
              <div className="font-semibold text-lg tracking-wide">BOBOY</div>
              <div className="text-xs text-white/60">{strings.topbarSubtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLangGate(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10"
            >
              <Globe2 className="h-4 w-4" />
              <span className="text-sm">{strings.changeLanguage}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero — Dish of the Day */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* premium gradients */}
          <div className="absolute -top-20 -left-32 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/30 to-rose-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-500/10 to-emerald-400/20 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                <Star className="h-4 w-4 text-amber-300" />
                <span className="text-xs uppercase tracking-widest text-white/80">{strings.dishOfDay}</span>
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight">
                {dishOfDay?.name}
              </h1>
              <p className="mt-3 text-white/70 max-w-prose">
                {strings.dishOfDayDesc}
              </p>
              <div className="mt-5 flex items-center gap-4">
                {dishOfDay?.veg && (
                  <span className="inline-flex items-center gap-2 text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 px-3 py-1 rounded-full text-sm">
                    <Leaf className="h-4 w-4" /> {strings.vegetarian}
                  </span>
                )}
                {dishOfDay?.price && (
                  <span className="inline-flex items-center gap-2 text-amber-200 bg-amber-500/10 border border-amber-400/20 px-3 py-1 rounded-full text-sm">
                    {new Intl.NumberFormat("ru-RU").format(dishOfDay.price)} UZS
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ rotateY: -12, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.1 }}
              className="[perspective:1200px]"
            >
              <div className="relative mx-auto w-full max-w-md">
                <div className="relative rounded-3xl p-1 bg-gradient-to-br from-white/30 via-white/10 to-white/0">
                  <div className="rounded-3xl p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-2xl">
                    {/* stylized plate */}
                    <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.08),transparent_45%)]" />
                      <div className="absolute inset-6 rounded-2xl border border-white/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-56 w-56 rounded-full bg-gradient-to-tr from-amber-300/30 via-rose-400/30 to-emerald-300/20 blur-2xl" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-44 w-44 rounded-full bg-gradient-to-b from-amber-200/90 to-amber-500/60 shadow-2xl" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-40 w-40 rounded-full bg-[conic-gradient(from_200deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.1)_60%,transparent_60%)]" />
                      </div>
                      <div className="absolute bottom-4 right-4 text-right">
                        <div className="text-sm text-white/70">{strings.chefRecommends}</div>
                        <div className="text-lg font-medium">{dishOfDay?.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-[57px] z-30 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={strings.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-amber-400/40"
            />
          </div>
          <button
            onClick={() => setVegOnly((v) => !v)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition ${vegOnly ? "bg-emerald-500/15 border-emerald-400/30" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
          >
            <Filter className="h-4 w-4" />
            <Leaf className="h-4 w-4" /> {strings.vegOnly}
          </button>
        </div>
      </section>

      {/* MENU */}
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-14">
        {/* If something is filtered, show smart results grid */}
        {query || vegOnly ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">{strings.results}</h2>
            <MenuGrid items={filtered} onOpen={(it) => setActiveItem(it)} lang={lang as Lang} />
          </div>
        ) : (
          menu.map((cat) => (
            <section key={cat.id} id={cat.id}>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 tracking-wide">{cat.name}</h2>
              <MenuGrid items={cat.items} onOpen={(it) => setActiveItem(it)} lang={lang as Lang} />
            </section>
          ))
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/50">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="font-semibold text-lg">BOBOY</div>
            <p className="text-white/60 text-sm mt-2">{strings.footerCopy}</p>
          </div>
          <div>
            <div className="font-medium mb-3">{strings.locations}</div>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> Tashkent City Mall, 3rd Floor</li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5" /> +998 77 109 88 77</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> Taras Shevchenko Street, 38A</li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5" /> +998 77 235 88 77</li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-3">Instagram</div>
            <a href="#" className="inline-flex items-center gap-2 text-white/80 hover:text-white">@boboycafe_uz</a>
            <p className="text-xs text-white/50 mt-3">{strings.allergyNote}</p>
          </div>
        </div>
      </footer>

      {/* ITEM MODAL */}
      <AnimatePresence>
        {activeItem && (
          <ItemModal item={activeItem} onClose={() => setActiveItem(null)} strings={strings} />)
        }
      </AnimatePresence>
    </div>
  );
}

// ——— UI pieces ———
function LanguageGate({ open, onSelect }: { open: boolean; onSelect: (l: Lang) => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-white/40 via-white/15 to-white/0 shadow-2xl">
        <div className="rounded-3xl p-6 bg-neutral-900/90 border border-white/10">
          <div className="flex items-center gap-2 text-white/70 text-sm"><Globe2 className="h-4 w-4" /> BOBOY</div>
          <h3 className="mt-1 text-2xl font-semibold">Choose language / Tilni tanlang / Выберите язык</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
            <LangButton code="uz" label="O‘zbek" onClick={() => onSelect("uz")}/>
            <LangButton code="ru" label="Русский" onClick={() => onSelect("ru")}/>
            <LangButton code="en" label="English" onClick={() => onSelect("en")}/>
          </div>
          <p className="text-xs text-white/50 mt-4">We store your choice only in your browser.</p>
        </div>
      </motion.div>
    </div>
  );
}

function LangButton({ code, label, onClick }: { code: Lang; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10">
      <div className="font-medium">{label}</div>
      <div className="text-xs text-white/60 mt-0.5 uppercase tracking-widest">{code}</div>
    </button>
  );
}

function MenuGrid({ items, onOpen, lang }: { items: (MenuItem & { category?: string })[]; onOpen: (i: MenuItem) => void; lang: Lang }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it) => (
        <button key={it.id} onClick={() => onOpen(it)} className="group text-left rounded-2xl p-[1px] bg-gradient-to-br from-white/20 via-white/10 to-white/0">
          <div className="h-full rounded-2xl p-4 bg-neutral-900/70 border border-white/10 hover:border-white/20 transition flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-base leading-snug group-hover:text-white">{it.name}</div>
                {it.category && <div className="text-xs text-white/50 mt-0.5">{it.category}</div>}
              </div>
              <div className="text-amber-200/90 text-sm whitespace-nowrap">{new Intl.NumberFormat("ru-RU").format(it.price)} UZS</div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-white/60 text-xs">
              <Utensils className="h-3.5 w-3.5" />
              {it.veg && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/20"><Leaf className="h-3 w-3" /> veg</span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function ItemModal({ item, onClose, strings }: { item: MenuItem; onClose: () => void; strings: typeof STR["ru"] }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="relative w-full max-w-lg mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-white/40 via-white/15 to-white/0"
      >
        <div className="rounded-3xl bg-neutral-900/95 border border-white/10">
          <div className="flex items-start justify-between gap-3 p-5">
            <div>
              <div className="text-lg font-semibold leading-tight">{item.name}</div>
              <div className="text-sm text-white/60 mt-1">{new Intl.NumberFormat("ru-RU").format(item.price)} UZS</div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"><X className="h-4 w-4" /></button>
          </div>
          <div className="px-5 pb-5">
            <div className="flex items-center gap-2 text-sm">
              {item.veg ? (
                <span className="inline-flex items-center gap-2 text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 px-3 py-1 rounded-full"><Leaf className="h-4 w-4" /> {strings.vegetarian}</span>
              ) : (
                <span className="inline-flex items-center gap-2 text-white/70 bg-white/5 border border-white/10 px-3 py-1 rounded-full">{strings.notVegetarian}</span>
              )}
            </div>
            <div className="mt-5">
              <div className="font-medium mb-2">{strings.ingredients}</div>
              {item.ingredients?.length ? (
                <ul className="list-disc list-inside text-white/80 space-y-1">
                  {item.ingredients.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              ) : (
                <p className="text-white/60 text-sm">{strings.ingredientsSoon}</p>
              )}
              <p className="text-xs text-white/40 mt-4">{strings.allergyNote}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ——— Data ———

type Lang = "ru" | "en" | "uz";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  veg?: boolean;
  ingredients?: string[];
};

type MenuCategory = { id: string; name: string; items: MenuItem[] };

type MenuByLang = Record<Lang, MenuCategory[]>;

const STR: Record<Lang, any> = {
  ru: {
    topbarSubtitle: "Национальная кухня Узбекистана",
    changeLanguage: "Язык",
    dishOfDay: "Блюдо дня",
    dishOfDayDesc: "Сегодня шеф рекомендует фирменное блюдо с домашними специями и сезонными продуктами.",
    chefRecommends: "Рекомендует шеф",
    vegetarian: "Вегетарианское",
    notVegetarian: "Содержит мясо/птицу/рыбу",
    searchPlaceholder: "Поиск по меню…",
    vegOnly: "Только вегетарианское",
    results: "Результаты",
    ingredients: "Ингредиенты",
    ingredientsSoon: "Состав скоро будет указан. Уточните у официанта.",
    locations: "Адреса",
    footerCopy: "Атмосфера Узбекистана: уникальные ароматы и вкусы.",
    allergyNote: "Пожалуйста, предупредите нас о любых аллергиях. Состав блюд может незначительно отличаться.",
  },
  en: {
    topbarSubtitle: "Uzbek national cuisine",
    changeLanguage: "Language",
    dishOfDay: "Dish of the Day",
    dishOfDayDesc: "Chef’s special prepared with house spices and seasonal produce.",
    chefRecommends: "Chef recommends",
    vegetarian: "Vegetarian",
    notVegetarian: "Contains meat/poultry/fish",
    searchPlaceholder: "Search the menu…",
    vegOnly: "Vegetarian only",
    results: "Results",
    ingredients: "Ingredients",
    ingredientsSoon: "Ingredients coming soon. Please ask your server.",
    locations: "Locations",
    footerCopy: "Immerse yourself in Uzbekistan’s unique tastes and aromas.",
    allergyNote: "Please let us know about any allergies. Ingredients may vary slightly.",
  },
  uz: {
    topbarSubtitle: "Oʻzbek milliy taomlari",
    changeLanguage: "Til",
    dishOfDay: "Kun taomi",
    dishOfDayDesc: "Shefning uy ziravorlari va mavsumiy mahsulotlardan tayyorlangan maxsus taomi.",
    chefRecommends: "Shef tavsiya qiladi",
    vegetarian: "Vegetarian",
    notVegetarian: "Goʻsht/tovuq/baliq bor",
    searchPlaceholder: "Menyu bo‘yicha qidirish…",
    vegOnly: "Faqat vegetarian",
    results: "Natijalar",
    ingredients: "Tarkibi",
    ingredientsSoon: "Tarkib tez orada qoʻshiladi. Ofitsiantdan soʻrang.",
    locations: "Manzillar",
    footerCopy: "Oʻzbekistonning oʻziga xos tamlari va hidlari.",
    allergyNote: "Allergiyangiz bo‘lsa, oldindan ayting. Tarkib biroz farq qilishi mumkin.",
  },
};

// Helper to DRY create items
const I = (id: string, name: Record<Lang, string> | string, price: number, opts: Partial<MenuItem> = {}): Record<Lang, MenuItem> => {
  const nm = typeof name === "string" ? { ru: name, en: name, uz: name } : name;
  return {
    ru: { id, name: nm.ru, price, ...opts },
    en: { id, name: nm.en, price, ...opts },
    uz: { id, name: nm.uz, price, ...opts },
  };
};

// Common ingredient presets (approximate; verify on site)
const ING = {
  pilaf: ["рис", "морковь", "лук", "зира", "барбарис", "говядина/баранина"],
  lagman: ["ручная лапша", "говядина", "овощи", "перец", "лук", "помидор"],
  kazanKebab: ["баранина", "картофель", "лук", "зира", "масло"],
  norin: ["лапша", "конина/говядина", "лук", "перец"],
  somsaMeat: ["тесто", "говядина", "лук", "зира"],
  somsaCheese: ["тесто", "сыр", "зелень", "кунжут"],
  khachapuri: ["тесто", "сыр сулугуни", "яйцо (аджар)", "масло"],
  cheburekBeef: ["тесто", "говядина", "лук", "специи"],
  cheburekCheese: ["тесто", "сыр", "зелень"],
  greek: ["огурец", "помидор", "оливки", "сыр фета", "лук", "оливковое масло"],
  caesar: ["курица", "салат ромен", "пармезан", "крутоны", "соус цезарь"],
  eggplantTempura: ["бакинский баклажан", "тесто темпура", "соус", "зелень"],
  assortedVeg: ["сезонные овощи"],
  lentilSoup: ["чечевица", "овощи", "специи"],
  manpar: ["домашняя лапша", "бульон", "говядина", "овощи"],
  chuchvara: ["пельмени", "говядина", "лук", "бульон"],
  sayBeef: ["говядина", "болгарский перец", "лук", "специи"],
  sayChicken: ["курица", "перец", "лук", "специи"],
  dolma: ["виноградные листья", "фарш", "рис", "соус"],
  beshbarmak: ["тесто", "мясо", "лук"] ,
  manti: ["тесто", "фарш", "лук", "специи"],
  sokoro: ["тушёное мясо", "овощи", "специи"],
  somboro: ["овощи", "яйцо", "специи"],
  fries: ["картофель", "масло", "соль"],
  rice: ["рис", "масло", "соль"],
  vegKebab: ["овощи гриль", "перец", "кабачок", "баклажан", "лук"],
  liver: ["печень", "лук", "специи"],
  waguri: ["мраморная говядина", "специи"],
  khalim: ["пшеница", "мясо", "лук", "масло"],
  tushenka: ["говядина", "специи"],
  nohot: ["нут", "мясо", "лук", "специи"],
  bakhlava: ["слоёное тесто", "орехи", "мёд"],
  tiramisu: ["маскарпоне", "савоярди", "эспрессо"],
  napoleon: ["слоёное тесто", "крем"],
  sanseb: ["сырный крем", "печёная корочка"],
};

// Build categories
const MENU: MenuByLang = {
  ru: buildMenu("ru"),
  en: buildMenu("en"),
  uz: buildMenu("uz"),
};

function buildMenu(lang: Lang): MenuCategory[] {
  const t = (map: Record<Lang, string>) => map[lang];

  // Category names localized
  const CAT = {
    starters: { ru: "Закуски", en: "Starters", uz: "Yaxna taomlar" },
    salads: { ru: "Салаты", en: "Salads", uz: "Salatlar" },
    soups: { ru: "Супы", en: "Soups", uz: "Sho‘rvalar" },
    mains: { ru: "Горячие блюда", en: "Main Courses", uz: "Asosiy taomlar" },
    kebabs: { ru: "Шашлыки и гарниры", en: "Kebabs & Sides", uz: "Kaboblar va qo‘shimchalar" },
    desserts: { ru: "Десерты", en: "Desserts", uz: "Shirinliklar" },
    drinks: { ru: "Напитки (выбор)", en: "Drinks (selection)", uz: "Ichimliklar (tanlov)" },
  };

  const items: Record<string, Record<Lang, MenuItem>> = {
    // — Starters
    suzma: I("suzma", { ru: "Сузма", en: "Suzma", uz: "Suzma" }, 25000, { veg: true, ingredients: ["кисломолочный соус", "зелень"] }),
    marinated_veg: I("marinated_veg", { ru: "Маринованные овощи", en: "Marinated Vegetables", uz: "Tuzlangan sabzavotlar" }, 38000, { veg: true, ingredients: ING.assortedVeg }),
    kulcha: I("kulcha", { ru: "Домашний хлеб (кулча)", en: "House Bread (Kulcha)", uz: "Non (Kulcha)" }, 15000, { veg: true, ingredients: ["пшеничная лепёшка", "кунжут"] }),
    garlic_nan: I("garlic_nan", { ru: "Чесночный нан", en: "Garlic Nan", uz: "Sarimsoqli non" }, 28000, { veg: true, ingredients: ["лепёшка", "чесночное масло", "зелень"] }),
    khach_ap: I("khach_ap", { ru: "Хачапури по-аджарски", en: "Khachapuri (Adjarian)", uz: "Xachapuri-Ajar" }, 73000, { veg: true, ingredients: ING.khachapuri }),
    khach_meg: I("khach_meg", { ru: "Хачапури по-мегрельски", en: "Khachapuri (Megrelian)", uz: "Xachapuri-Megrel" }, 73000, { veg: true, ingredients: ING.khachapuri }),
    cheb_beef: I("cheb_beef", { ru: "Мини-чебурек с говядиной (4 шт)", en: "Mini Cheburek with Beef (4 pcs)", uz: "Mini cheburek (go‘shtli) (4 dona)" }, 40000, { veg: false, ingredients: ING.cheburekBeef }),
    cheb_cheese: I("cheb_cheese", { ru: "Мини-чебурек с сыром (4 шт)", en: "Mini Cheburek with Cheese (4 pcs)", uz: "Mini cheburek (pishloqli) (4 dona)" }, 35000, { veg: true, ingredients: ING.cheburekCheese }),
    somsa_trad: I("somsa_trad", { ru: "Самса традиционная (1 шт)", en: "Somsa Traditional (1 pc)", uz: "Tandir somsa (1 dona)" }, 20000, { veg: false, ingredients: ING.somsaMeat }),
    somsa_olot: I("somsa_olot", { ru: "Самса Олот (1 шт)", en: "Somsa Olot (1 pc)", uz: "Olot somsa (1 dona)" }, 15000, { veg: false, ingredients: ING.somsaMeat }),
    turkish_meze: I("turkish_meze", { ru: "Турецкий мезе сет", en: "Turkish Meze Set", uz: "Turkcha mezze seti" }, 95000, { veg: false, ingredients: ["ачылы эзме", "оливки", "хумус", "суджук", "хайдари", "нан"] }),

    // — Salads
    achik: I("achik", { ru: "Ачик-чучук", en: "Achik Chuchuk", uz: "Achik chuchuk" }, 29000, { veg: true, ingredients: ["помидор", "лук", "перец", "зелень"] }),
    caesar: I("caesar", { ru: "Салат Цезарь с курицей", en: "Caesar Salad with Chicken", uz: "Salat Sezar tovuqli" }, 79000, { veg: false, ingredients: ING.caesar }),
    greek: I("greek", { ru: "Греческий салат", en: "Greek Salad", uz: "Greck salad" }, 45000, { veg: true, ingredients: ING.greek }),
    bakhor: I("bakhor", { ru: "Салат Бахор", en: "Salad Bakhor", uz: "Bahor salati" }, 63000, { veg: true, ingredients: ["сезонные овощи", "зелень", "соус"] }),
    olivier: I("olivier", { ru: "Оливье", en: "Olivier Salad", uz: "Salat Olivye" }, 69000, { veg: false, ingredients: ["овощи", "майонез", "ветчина/курица"] }),
    eggplant_tempura: I("eggplant_tempura", { ru: "Салат с баклажаном темпура", en: "Eggplant Tempura Salad", uz: "Qarsildoq baqlajon" }, 69000, { veg: true, ingredients: ING.eggplantTempura }),
    choban: I("choban", { ru: "Чобан салад", en: "Choban Salad", uz: "Choban salat" }, 49000, { veg: true, ingredients: ["помидор", "огурец", "перец", "лук", "зелень"] }),
    assorted_fresh: I("assorted_fresh", { ru: "Овощное ассорти", en: "Assorted Fresh Vegetables", uz: "Sabzavot assortisi" }, 49000, { veg: true, ingredients: ING.assortedVeg }),
    chirokchi: I("chirokchi", { ru: "Салат Чирокчи", en: "Chirokchi Salad", uz: "Salat Chiroqchi" }, 63000, { veg: false, ingredients: ["овощи", "сыр/мясо", "соус"] }),
    smak: I("smak", { ru: "Салат Смак", en: "Smak Salad", uz: "Smak salat" }, 67000, { veg: false, ingredients: ["овощи", "соус", "мясо"] }),
    muzh: I("muzh", { ru: "Мужской каприз", en: "Mujskoy Kapriz", uz: "Salat Mujskoy Kapriz" }, 75000, { veg: false, ingredients: ["мясо", "яйцо", "сыр", "майонез"] }),
    tulum: I("tulum", { ru: "Салат Тулум", en: "Salad Tulum", uz: "Salat Tulum" }, 93000, { veg: false, ingredients: ["сыр тулум", "овощи", "соус"] }),
    thai_beef: I("thai_beef", { ru: "Тёплый тайский с говядиной", en: "Thai Warm Beef Salad", uz: "Mol go‘shtli TAI salati" }, 79000, { veg: false, ingredients: ["говядина", "тайский соус", "овощи", "зелень"] }),

    // — Soups
    kainatma: I("kainatma", { ru: "Кайнатма шурпа", en: "Kainatma Shurpa", uz: "Qaynatma sho‘rva" }, 63000, { veg: false, ingredients: ["баранина", "овощи", "бульон"] }),
    lagman_uyghur: I("lagman_uyghur", { ru: "Лагман уйгурский", en: "Lagman Uyghur", uz: "Uyg‘ur lag‘mon" }, 55000, { veg: false, ingredients: ING.lagman }),
    mastava: I("mastava", { ru: "Мастава", en: "Mastava", uz: "Mastava" }, 49000, { veg: false, ingredients: ["рис", "овощи", "мясо", "бульон"] }),
    chicken_noodle: I("chicken_noodle", { ru: "Куриный суп с лапшой", en: "Chicken Noodle Soup", uz: "Tovuqli sho‘rva" }, 61000, { veg: false, ingredients: ["курица", "лапша", "овощи"] }),
    chuchvara: I("chuchvara", { ru: "Чучвара", en: "Chuchvara", uz: "Chuchvara" }, 65000, { veg: false, ingredients: ING.chuchvara }),
    moshxurda: I("moshxurda", { ru: "Мошхурда", en: "Moshxurda", uz: "Moshxo‘rda" }, 40000, { veg: false, ingredients: ["маш", "мясо", "овощи"] }),
    lentil: I("lentil", { ru: "Чечевичный суп", en: "Lentil Soup", uz: "Chechevichniy sho‘rva" }, 69000, { veg: true, ingredients: ING.lentilSoup }),
    shurpa_jug: I("shurpa_jug", { ru: "Шурпа в кувшине", en: "Shurpa in a Jug", uz: "Ko‘za sho‘rva" }, 75000, { veg: false, ingredients: ["мясо", "овощи", "бульон"] }),
    manpar: I("manpar", { ru: "Манпар", en: "Manpar Soup", uz: "Manpar" }, 75000, { veg: false, ingredients: ING.manpar }),

    // — Mains
    festive_pilaf: I("festive_pilaf", { ru: "Праздничный плов", en: "Festive Pilaf", uz: "Osh" }, 50000, { veg: false, ingredients: ING.pilaf }),
    say_beef: I("say_beef", { ru: "Сай говяжий", en: "Beef SAY", uz: "Go‘shtli Say" }, 89000, { veg: false, ingredients: ING.sayBeef }),
    manti: I("manti", { ru: "Манты (1 шт)", en: "Manti (1 pc)", uz: "Manti (1 dona)" }, 19000, { veg: false, ingredients: ING.manti }),
    waguri: I("waguri", { ru: "Вагури (300 г)", en: "Waguri (300 g)", uz: "Vaguri (300 g)" }, 249000, { veg: false, ingredients: ING.waguri }),
    dolma: I("dolma", { ru: "Долма (Ток ош)", en: "Dolma (Tok Osh)", uz: "Do‘lma (Tok osh)" }, 85000, { veg: false, ingredients: ING.dolma }),
    kazan_kebab: I("kazan_kebab", { ru: "Казан-кабоб", en: "Kazan Kebab", uz: "Qozon kabob" }, 159000, { veg: false, ingredients: ING.kazanKebab }),
    assorted_boboy: I("assorted_boboy", { ru: "Ассорти Boboy", en: "Assorted Boboy Set", uz: "Assorti Boboy" }, 150000, { veg: false, ingredients: ["сеты горячих блюд"] }),
    sokoro: I("sokoro", { ru: "Сокоро", en: "Sokoro", uz: "Sokoro" }, 109000, { veg: false, ingredients: ING.sokoro }),
    somboro: I("somboro", { ru: "Сомборо", en: "Somboro", uz: "Somboro" }, 109000, { veg: false, ingredients: ING.somboro }),
    fried_lagman: I("fried_lagman", { ru: "Лагман жареный", en: "Fried Lagman", uz: "Qovurma lag‘mon" }, 73000, { veg: false, ingredients: ING.lagman }),
    beshbarmak: I("beshbarmak", { ru: "Бешбармак", en: "Beshbarmak", uz: "Beshbarmoq" }, 139000, { veg: false, ingredients: ING.beshbarmak }),
    nohot: I("nohot", { ru: "Нохот шурак", en: "Nohot Shurak", uz: "Noxot sho‘rak" }, 79000, { veg: false, ingredients: ING.nohot }),
    tushenka: I("tushenka", { ru: "Тушёнка (говядина)", en: "Tushenka", uz: "Tushonka (mol go‘shti)" }, 115000, { veg: false, ingredients: ING.tushenka }),
    khalim: I("khalim", { ru: "Халим", en: "Khalim", uz: "Xalim" }, 75000, { veg: false, ingredients: ING.khalim }),
    norin: I("norin", { ru: "Норин", en: "Norin", uz: "Norin" }, 93000, { veg: false, ingredients: ING.norin }),
    say_chicken: I("say_chicken", { ru: "Сай куриный", en: "SAY with Chicken", uz: "Tovuqli Say" }, 73000, { veg: false, ingredients: ING.sayChicken }),
    say_beef_egg: I("say_beef_egg", { ru: "Сай с говядиной и яйцом", en: "SAY with Beef & Egg", uz: "Tuxum va go‘shtli Say" }, 89000, { veg: false, ingredients: ING.sayBeef }),

    // — Kebabs & Sides
    minced_beef: I("minced_beef", { ru: "Кийма (фарш) шашлык", en: "Minced Beef Kebab", uz: "Qiyma kabob" }, 35000, { veg: false, ingredients: ["фарш говяжий", "лук", "специи"] }),
    beef_kebab: I("beef_kebab", { ru: "Мол жиз (шашлык)", en: "Beef Kebab", uz: "Mol jaz" }, 43000, { veg: false }),
    lamb_kebab: I("lamb_kebab", { ru: "Кой жиз (шашлык)", en: "Lamb Kebab", uz: "Qo‘y jaz" }, 45000, { veg: false }),
    lamb_chops: I("lamb_chops", { ru: "Каре ягнёнка", en: "Lamb chops", uz: "Qo‘zi qovurg‘asi" }, 75000, { veg: false }),
    chicken_wings: I("chicken_wings", { ru: "Куриные крылья", en: "Chicken Wings", uz: "Tovuq qanoti" }, 42000, { veg: false }),
    chicken_thighs: I("chicken_thighs", { ru: "Куриное бедро (жиз)", en: "Chicken Thighs", uz: "Tovuq jaz" }, 42000, { veg: false }),
    liver: I("liver", { ru: "Печень", en: "Liver", uz: "Jigar" }, 35000, { veg: false, ingredients: ING.liver }),
    veg_kebab: I("veg_kebab", { ru: "Овощной шашлык", en: "Vegetarian Kebab", uz: "Sabzavotli kabob" }, 35000, { veg: true, ingredients: ING.vegKebab }),
    lamb_ribs: I("lamb_ribs", { ru: "Хрустящие бараньи рёбра", en: "Lamb Crispy Ribs", uz: "Qo‘y qovurg‘a jaz" }, 60000, { veg: false }),
    rolls: I("rolls", { ru: "Рулет", en: "Rolls", uz: "Rulet" }, 43000, { veg: false }),
    charvi: I("charvi", { ru: "Чарви кебаб", en: "Charvi Kebab", uz: "Charvi kabob" }, 39000, { veg: false }),
    fries: I("fries", { ru: "Картофель фри", en: "French Fries", uz: "Kartoshka fri" }, 35000, { veg: true, ingredients: ING.fries }),
    rice: I("rice", { ru: "Гарнир рис", en: "Rice", uz: "Guruch" }, 24000, { veg: true, ingredients: ING.rice }),

    // — Desserts (selected)
    napoleon: I("napoleon", { ru: "Наполеон", en: "Napoleon", uz: "Napoleon" }, 69000, { veg: true, ingredients: ING.napoleon }),
    oreshky: I("oreshky", { ru: "Орешки (6 шт)", en: "Oreshky (6 pcs)", uz: "Oreshkalar (6 dona)" }, 50000, { veg: true }),
    honey_cake: I("honey_cake", { ru: "Медовик", en: "Honey Cake", uz: "Medovik" }, 72000, { veg: true }),
    meringue: I("meringue", { ru: "Меренга рулеты", en: "Meringue Rolls", uz: "Merenga" }, 69000, { veg: true }),
    afghan: I("afghan", { ru: "Афганский десерт", en: "Afghan dessert", uz: "Afg‘on shirinlik" }, 69000, { veg: true }),
    san_sebastian: I("san_sebastian", { ru: "Сан-Себастьян чизкейк", en: "San Sebastian Cheesecake", uz: "San Sebastyan chiskeyk" }, 79000, { veg: true, ingredients: ING.sanseb }),
    tiramisu: I("tiramisu", { ru: "Тирамису", en: "Tiramisu", uz: "Tiramisu" }, 83000, { veg: true, ingredients: ING.tiramisu }),
    kiev: I("kiev", { ru: "Киев", en: "Kiev", uz: "Kievskiy tort" }, 75000, { veg: true }),
    snickers: I("snickers", { ru: "Сникерс роллы", en: "Snickers Rolls", uz: "Snikers tort" }, 79000, { veg: true }),
    fondue: I("fondue", { ru: "Шоколадное фондю", en: "Chocolate Fondue", uz: "Shokoladli fondyu" }, 105000, { veg: true }),
    profiteroles: I("profiteroles", { ru: "Профитроли", en: "Profiteroles", uz: "Profitroli" }, 69000, { veg: true }),
    bakhlava: I("bakhlava", { ru: "Пахлава", en: "Bakhlava", uz: "Paxlava" }, 59000, { veg: true, ingredients: ING.bakhlava }),
    matilda: I("matilda", { ru: "Матильда", en: "Matilda", uz: "Matilda" }, 75000, { veg: true }),
    chak_chak: I("chak_chak", { ru: "Чак-чак чизкейк", en: "Chak Chak Cheesecake", uz: "Chak Chak chiskeyk" }, 75000, { veg: true }),
    assorted_milliy: I("assorted_milliy", { ru: "Ассорти Миллий сет", en: "Assorted Milliy Set", uz: "Assorti Milliy" }, 87000, { veg: true }),

    // — Drinks (selection; showcase)
    iced_tea: I("iced_tea", { ru: "Айсти (ассорти)", en: "Iced Tea", uz: "Aysti" }, 31000, { veg: true }),
    cappuccino: I("cappuccino", { ru: "Капучино", en: "Cappuccino", uz: "Cappuccino" }, 42000, { veg: true }),
    americano: I("americano", { ru: "Американо", en: "Americano", uz: "Americano" }, 35000, { veg: true }),
    latte: I("latte", { ru: "Латте", en: "Latte", uz: "Latte" }, 52000, { veg: true }),
    mojito: I("mojito", { ru: "Мохито классический", en: "Classic Mojito", uz: "Klassik moxito" }, 65000, { veg: true }),
    passion_mango_lemonade: I("passion_mango_lemonade", { ru: "Лимонад маракуйя-манго", en: "Passionfruit Mango Lemonade", uz: "Marakuya Mango limonad" }, 57000, { veg: true }),
  };

  const cat = (id: keyof typeof CAT, ids: (keyof typeof items)[]): MenuCategory => ({
    id,
    name: t(CAT[id]),
    items: ids.map((key) => items[key][lang]),
  });

  return [
    cat("starters", [
      "suzma",
      "marinated_veg",
      "kulcha",
      "garlic_nan",
      "khach_ap",
      "khach_meg",
      "cheb_beef",
      "cheb_cheese",
      "somsa_trad",
      "somsa_olot",
      "turkish_meze",
    ]),
    cat("salads", [
      "achik",
      "caesar",
      "greek",
      "bakhor",
      "olivier",
      "eggplant_tempura",
      "choban",
      "assorted_fresh",
      "chirokchi",
      "smak",
      "muzh",
      "tulum",
      "thai_beef",
    ]),
    cat("soups", [
      "kainatma",
      "lagman_uyghur",
      "mastava",
      "chicken_noodle",
      "chuchvara",
      "moshxurda",
      "lentil",
      "shurpa_jug",
      "manpar",
    ]),
    cat("mains", [
      "festive_pilaf",
      "say_beef",
      "manti",
      "waguri",
      "dolma",
      "kazan_kebab",
      "assorted_boboy",
      "sokoro",
      "somboro",
      "fried_lagman",
      "beshbarmak",
      "nohot",
      "tushenka",
      "khalim",
      "norin",
      "say_chicken",
      "say_beef_egg",
    ]),
    cat("kebabs", [
      "minced_beef",
      "beef_kebab",
      "lamb_kebab",
      "lamb_chops",
      "chicken_wings",
      "chicken_thighs",
      "liver",
      "veg_kebab",
      "lamb_ribs",
      "rolls",
      "charvi",
      "fries",
      "rice",
    ]),
    cat("desserts", [
      "napoleon",
      "oreshky",
      "honey_cake",
      "meringue",
      "afghan",
      "san_sebastian",
      "tiramisu",
      "kiev",
      "snickers",
      "fondue",
      "profiteroles",
      "bakhlava",
      "matilda",
      "chak_chak",
      "assorted_milliy",
    ]),
    cat("drinks", [
      "iced_tea",
      "americano",
      "cappuccino",
      "latte",
      "mojito",
      "passion_mango_lemonade",
    ]),
  ];
}

/* ---------------------------------------------
   Self-tests (non-breaking): logs to browser console.
   View: open DevTools → Console. These do not throw.
------------------------------------------------ */
function runSelfTestsForBoboy() {
  try {
    const tests: Array<[string, boolean]> = [];

    // RU description should be a single-line string without newlines
    tests.push([
      "RU dishOfDayDesc has no newline",
      typeof STR.ru.dishOfDayDesc === "string" && !/\n/.test(STR.ru.dishOfDayDesc),
    ]);

    // Menus exist for all languages and categories have items
    (['ru','en','uz'] as Lang[]).forEach((l) => {
      const m = MENU[l];
      tests.push([`MENU[${l}] has categories`, Array.isArray(m) && m.length >= 5]);
      tests.push([
        `All categories in ${l} have items`,
        m.every((c) => Array.isArray(c.items) && c.items.length > 0),
      ]);
    });

    // Featured keys must exist in RU menu
    const featured = [
      'festive_pilaf',
      'lagman_uyghur',
      'kazan_kebab',
      'norin',
      'san_sebastian',
      'passion_mango_lemonade',
    ];
    tests.push([
      'Featured keys exist',
      featured.every((id) => MENU.ru.some((cat) => cat.items.some((i) => i.id === id))),
    ]);

    // At least one vegetarian item exists
    tests.push([
      'Has at least one vegetarian item',
      MENU.ru.some((c) => c.items.some((i) => i.veg === true)),
    ]);

    const passed = tests.filter(([, ok]) => ok).length;
    console.log(`BOBOY self-tests: ${passed}/${tests.length} passed.`);
    tests.forEach(([name, ok]) => console.assert(ok, `Test failed: ${name}`));
  } catch (err) {
    console.warn('Self-tests encountered an error', err);
  }
}
