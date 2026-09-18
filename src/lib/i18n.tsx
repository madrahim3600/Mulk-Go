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
  searchPlaceholder: {
    uz: "Nomi, joylashuv yoki 12 xonali ID",
    ru: "Название, место или 12-значный ID",
  },
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
  sellerUnavailable: {
    uz: "Bu e'lon sotuvchi akkauntiga ulanmagan.",
    ru: "Это объявление не связано с аккаунтом продавца.",
  },
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
  chatWithSeller: { uz: "Sotuvchi bilan chat", ru: "Чат с продавцом" },
  chatPrivateNote: {
    uz: "Yozishmalar faqat siz va sotuvchi o'rtasida ko'rinadi.",
    ru: "Переписка видна только вам и продавцу.",
  },
  chatEmpty: {
    uz: "Suhbatni birinchi bo'lib boshlang.",
    ru: "Начните диалог первым.",
  },
  buyers: { uz: "Xaridorlar", ru: "Покупатели" },
  noBuyersYet: { uz: "Hali hech kim yozmagan", ru: "Пока никто не написал" },
  comments: { uz: "Izohlar", ru: "Комментарии" },
  commentsPublicNote: {
    uz: "Izohlarni barcha ko'radi.",
    ru: "Комментарии видны всем.",
  },
  commentPlaceholder: { uz: "Izohingizni yozing...", ru: "Напишите комментарий..." },
  addComment: { uz: "Izoh qoldirish", ru: "Оставить комментарий" },
  noComments: { uz: "Hali izoh yo'q", ru: "Комментариев пока нет" },
  deleteAction: { uz: "O'chirish", ru: "Удалить" },
  you: { uz: "Siz", ru: "Вы" },
  userLabel: { uz: "Foydalanuvchi", ru: "Пользователь" },
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

  // Rasmiylashtirish / Оформление
  notary: { uz: "Rasmiylashtirish", ru: "Оформление" },
  notaryLong: { uz: "Online notarius xizmati", ru: "Онлайн-нотариус" },
  notarySub: {
    uz: "Shartnomani onlayn rasmiylashtiring: mulk ma'lumotlari, tomonlar va shaxsni tasdiqlash — bir joyda.",
    ru: "Оформите договор онлайн: данные об имуществе, стороны и подтверждение личности — в одном месте.",
  },
  servicePrices: { uz: "Xizmat narxlari", ru: "Цены на услуги" },
  newRequest: { uz: "Yangi ariza", ru: "Новая заявка" },
  myRequests: { uz: "Mening arizalarim", ru: "Мои заявки" },
  noRequests: { uz: "Hali ariza yo'q", ru: "Заявок пока нет" },
  chooseService: { uz: "Xizmat turini tanlang", ru: "Выберите услугу" },
  propertySource: { uz: "Mulk manbai", ru: "Источник имущества" },
  fromListing: { uz: "Elon orqali", ru: "По объявлению" },
  fromFavorites: { uz: "Sevimlilardan tanlash", ru: "Выбрать из избранного" },
  manualProperty: { uz: "Elonda yo'q mulk", ru: "Имущество без объявления" },
  listingId: { uz: "Elon ID raqami", ru: "ID объявления" },
  loadListing: { uz: "Yuklash", ru: "Загрузить" },
  listingNumber: { uz: "Elon ID", ru: "ID объявления" },
  searchByListingNumber: { uz: "12 xonali ID orqali qidiring", ru: "Поиск по 12-значному ID" },
  manageListings: { uz: "Elonlarni boshqarish", ru: "Управление объявлениями" },
  deleteListing: { uz: "Elonni o'chirish", ru: "Удалить объявление" },
  listingLoaded: { uz: "Elon topildi", ru: "Объявление найдено" },
  listingNotFound: { uz: "Bunday elon topilmadi", ru: "Объявление не найдено" },
  propertyType: { uz: "Mulk turi", ru: "Тип имущества" },
  propertyTitle: { uz: "Mulk nomi", ru: "Наименование имущества" },
  propertyAddress: { uz: "Mulk manzili", ru: "Адрес имущества" },
  propertyArea: { uz: "Maydoni (m²)", ru: "Площадь (м²)" },
  cadastre: { uz: "Kadastr raqami", ru: "Кадастровый номер" },
  propertyValue: { uz: "Mulk qiymati (so'm)", ru: "Стоимость имущества (сум)" },
  sellerInfo: { uz: "Sotuvchi ma'lumotlari", ru: "Данные продавца" },
  buyerInfo: { uz: "Xaridor ma'lumotlari", ru: "Данные покупателя" },
  passport: { uz: "Pasport seriya va raqami", ru: "Серия и номер паспорта" },
  pinfl: { uz: "JSHSHIR (PINFL)", ru: "ПИНФЛ" },
  notes: { uz: "Qo'shimcha izoh", ru: "Дополнительный комментарий" },
  submitRequest: { uz: "Arizani yuborish", ru: "Отправить заявку" },
  requestSent: { uz: "Ariza yuborildi", ru: "Заявка отправлена" },
  serviceFee: { uz: "Xizmat narxi", ru: "Стоимость услуги" },
  identity: { uz: "Shaxsni tasdiqlash", ru: "Подтверждение личности" },
  faceId: { uz: "FaceID / MyID", ru: "FaceID / MyID" },
  verifyFace: { uz: "FaceID orqali tasdiqlash", ru: "Подтвердить через FaceID" },
  faceHint: {
    uz: "Yuzingizni ramka ichida joylashtiring va suratga oling.",
    ru: "Разместите лицо в рамке и сделайте снимок.",
  },
  capture: { uz: "Suratga olish", ru: "Сделать снимок" },
  retake: { uz: "Qayta olish", ru: "Переснять" },
  cameraError: {
    uz: "Kameraga ruxsat berilmadi yoki kamera topilmadi.",
    ru: "Нет доступа к камере или камера не найдена.",
  },
  identityPending: { uz: "Tasdiqlash kutilmoqda", ru: "Ожидает подтверждения" },
  identityVerified: { uz: "Shaxs tasdiqlangan", ru: "Личность подтверждена" },
  identityFailed: { uz: "Tasdiqlanmadi", ru: "Не подтверждено" },
  myidNote: {
    uz: "Rasmiy MyID ulanishi faollashtirilgach, tekshiruv avtomatik bo'ladi. Hozircha surat notariusga yuboriladi.",
    ru: "После подключения официального MyID проверка станет автоматической. Пока снимок отправляется нотариусу.",
  },
  status_draft: { uz: "Qoralama", ru: "Черновик" },
  status_submitted: { uz: "Yuborilgan", ru: "Отправлена" },
  status_under_review: { uz: "Ko'rib chiqilmoqda", ru: "На рассмотрении" },
  status_approved: { uz: "Tasdiqlangan", ru: "Одобрена" },
  status_rejected: { uz: "Rad etilgan", ru: "Отклонена" },
  status_completed: { uz: "Yakunlangan", ru: "Завершена" },
  adminPanel: { uz: "Admin panel", ru: "Админ-панель" },
  managePrices: { uz: "Narxlarni boshqarish", ru: "Управление ценами" },
  allRequests: { uz: "Barcha arizalar", ru: "Все заявки" },
  saved: { uz: "Saqlandi", ru: "Сохранено" },
  activeService: { uz: "Faol", ru: "Активна" },
  approve: { uz: "Tasdiqlash", ru: "Одобрить" },
  reject: { uz: "Rad etish", ru: "Отклонить" },
  complete: { uz: "Yakunlash", ru: "Завершить" },
  formalize: { uz: "Rasmiylashtirish", ru: "Оформить" },
  applicant: { uz: "Ariza beruvchi", ru: "Заявитель" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string };

const I18nContext = createContext<Ctx>({
  lang: "uz",
  setLang: () => {},
  t: (k) => dict[k]?.uz ?? String(k),
});

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
