import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "uz" | "ru";

type Dict = Record<string, { uz: string; ru: string }>;

export const dict: Dict = {
  brand: { uz: "Mulk-Go", ru: "Mulk-Go" },
  tagline: {
    uz: "Mol-mulk oldi-sotdisi va ijarasi uchun online platforma",
    ru: "Онлайн-платформа для покупки, продажи и аренды имущества",
  },
  heroTitle: {
    uz: "Mulkingizni xavfsiz soting, kerakligini toping",
    ru: "Продавайте имущество безопасно и находите нужное",
  },
  heroSub: {
    uz: "Ko'chmas mulk, transport, texnika va boshqa aktivlar — bir joyda, rasmiy va ishonchli.",
    ru: "Недвижимость, транспорт, техника и другие активы — в одном месте, официально и надёжно.",
  },
  searchPlaceholder: { uz: "Nima qidiryapsiz?", ru: "Что вы ищете?" },
  search: { uz: "Qidirish", ru: "Найти" },
  categories: { uz: "Kategoriyalar", ru: "Категории" },
  allCategories: { uz: "Barcha kategoriyalar", ru: "Все категории" },
  real_estate: { uz: "Ko'chmas mulk", ru: "Недвижимость" },
  vehicles: { uz: "Transport", ru: "Транспорт" },
  electronics: { uz: "Elektronika", ru: "Электроника" },
  furniture: { uz: "Mebel", ru: "Мебель" },
  other: { uz: "Boshqa", ru: "Другое" },
  sale: { uz: "Sotuv", ru: "Продажа" },
  rent: { uz: "Ijara", ru: "Аренда" },
  allTypes: { uz: "Barcha turlar", ru: "Все типы" },
  freshListings: { uz: "Yangi elonlar", ru: "Свежие объявления" },
  allListings: { uz: "Barcha elonlar", ru: "Все объявления" },
  seeAll: { uz: "Hammasini ko'rish", ru: "Смотреть все" },
  listings: { uz: "Elonlar", ru: "Объявления" },
  newListing: { uz: "Elon berish", ru: "Подать объявление" },
  myListings: { uz: "Mening elonlarim", ru: "Мои объявления" },
  favorites: { uz: "Sevimlilar", ru: "Избранное" },
  messages: { uz: "Xabarlar", ru: "Сообщения" },
  profile: { uz: "Profil", ru: "Профиль" },
  signIn: { uz: "Kirish", ru: "Войти" },
  signUp: { uz: "Ro'yxatdan o'tish", ru: "Регистрация" },
  signOut: { uz: "Chiqish", ru: "Выйти" },
  email: { uz: "Email", ru: "Email" },
  password: { uz: "Parol", ru: "Пароль" },
  fullName: { uz: "F.I.Sh.", ru: "Ф.И.О." },
  phone: { uz: "Telefon raqami", ru: "Номер телефона" },
  address: { uz: "Manzil", ru: "Адрес" },
  save: { uz: "Saqlash", ru: "Сохранить" },
  cancel: { uz: "Bekor qilish", ru: "Отмена" },
  delete: { uz: "O'chirish", ru: "Удалить" },
  edit: { uz: "Tahrirlash", ru: "Редактировать" },
  title: { uz: "Sarlavha", ru: "Заголовок" },
  description: { uz: "Tavsif", ru: "Описание" },
  price: { uz: "Narx", ru: "Цена" },
  priceFrom: { uz: "Narx, dan", ru: "Цена, от" },
  priceTo: { uz: "Narx, gacha", ru: "Цена, до" },
  location: { uz: "Joylashuv", ru: "Расположение" },
  imageUrl: { uz: "Rasm havolasi (URL)", ru: "Ссылка на фото (URL)" },
  contactPhone: { uz: "Aloqa telefoni", ru: "Контактный телефон" },
  category: { uz: "Kategoriya", ru: "Категория" },
  type: { uz: "Turi", ru: "Тип" },
  publish: { uz: "Elonni joylash", ru: "Опубликовать" },
  views: { uz: "ko'rish", ru: "просмотров" },
  seller: { uz: "Sotuvchi", ru: "Продавец" },
  writeToSeller: { uz: "Sotuvchiga yozish", ru: "Написать продавцу" },
  callSeller: { uz: "Qo'ng'iroq qilish", ru: "Позвонить" },
  addFavorite: { uz: "Sevimlilarga", ru: "В избранное" },
  inFavorites: { uz: "Sevimlilarda", ru: "В избранном" },
  loginRequired: { uz: "Buning uchun tizimga kiring", ru: "Для этого войдите в систему" },
  nothingFound: { uz: "Hech narsa topilmadi", ru: "Ничего не найдено" },
  noListingsYet: { uz: "Hali elon yo'q", ru: "Объявлений пока нет" },
  loading: { uz: "Yuklanmoqda...", ru: "Загрузка..." },
  sendMessage: { uz: "Xabar yuborish", ru: "Отправить сообщение" },
  messagePlaceholder: { uz: "Xabaringizni yozing...", ru: "Напишите сообщение..." },
  sent: { uz: "Yuborildi", ru: "Отправлено" },
  noMessages: { uz: "Xabarlar yo'q", ru: "Сообщений нет" },
  howItWorks: { uz: "Qanday ishlaydi", ru: "Как это работает" },
  step1t: { uz: "Elon joylang", ru: "Разместите объявление" },
  step1d: {
    uz: "Mulkingiz haqida ma'lumot, rasm va narxni kiriting — bir necha daqiqada.",
    ru: "Добавьте описание, фото и цену — за пару минут.",
  },
  step2t: { uz: "Xaridor bilan kelishing", ru: "Договоритесь с покупателем" },
  step2d: {
    uz: "Chat yoki telefon orqali bevosita muloqot qiling.",
    ru: "Общайтесь напрямую в чате или по телефону.",
  },
  step3t: { uz: "Rasmiylashtiring", ru: "Оформите сделку" },
  step3d: {
    uz: "Kelishuvdan so'ng shartnomani rasmiy tarzda yakunlang.",
    ru: "После договорённости официально завершите сделку.",
  },
  footerNote: {
    uz: "Mulk-Go — O'zbekistondagi mol-mulk bozori uchun ochiq platforma.",
    ru: "Mulk-Go — открытая площадка для рынка имущества в Узбекистане.",
  },
  account: { uz: "Hisobim", ru: "Аккаунт" },
  haveAccount: { uz: "Hisobingiz bormi?", ru: "Уже есть аккаунт?" },
  noAccount: { uz: "Hisobingiz yo'qmi?", ru: "Нет аккаунта?" },
  checkEmail: {
    uz: "Emailingizni tasdiqlang — havola yuborildi.",
    ru: "Подтвердите email — мы отправили ссылку.",
  },
  active: { uz: "Faol", ru: "Активно" },
  archived: { uz: "Arxivda", ru: "В архиве" },
  sold: { uz: "Sotilgan", ru: "Продано" },
  archive: { uz: "Arxivlash", ru: "В архив" },
  activate: { uz: "Faollashtirish", ru: "Активировать" },
  markSold: { uz: "Sotildi", ru: "Продано" },
  sortNew: { uz: "Avval yangilari", ru: "Сначала новые" },
  sortCheap: { uz: "Arzonidan", ru: "Сначала дешевле" },
  sortExpensive: { uz: "Qimmatidan", ru: "Сначала дороже" },
  filters: { uz: "Filtrlar", ru: "Фильтры" },
  reset: { uz: "Tozalash", ru: "Сбросить" },
  results: { uz: "natija", ru: "результатов" },
  profileSaved: { uz: "Profil saqlandi", ru: "Профиль сохранён" },
  listingCreated: { uz: "Elon joylandi", ru: "Объявление опубликовано" },
  listingDeleted: { uz: "Elon o'chirildi", ru: "Объявление удалено" },
  backToListings: { uz: "Elonlarga qaytish", ru: "К объявлениям" },
  contactedYou: { uz: "siz bilan bog'landi", ru: "написал вам" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string };

const I18nContext = createContext<Ctx>({ lang: "uz", setLang: () => {}, t: (k) => dict[k]?.uz ?? String(k) });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");

  useEffect(() => {
    const stored = window.localStorage.getItem("mulkgo-lang");
    if (stored === "uz" || stored === "ru") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("mulkgo-lang", l);
  };

  const t = (k: keyof typeof dict) => dict[k]?.[lang] ?? String(k);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

export function formatPrice(value: number, currency: string, lang: Lang) {
  const n = new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "uz-UZ").format(value);
  return `${n} ${currency === "UZS" ? (lang === "ru" ? "сум" : "so'm") : currency}`;
}
