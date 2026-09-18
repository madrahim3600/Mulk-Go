import type { Lang } from "@/lib/i18n";

export type PropertyKind = "real_estate" | "land" | "vehicle" | "movable" | "other";

export type L = { uz: string; ru: string };

export type FieldDef = {
  key: string;
  label: L;
  type?: "text" | "number";
  placeholder?: string;
  required?: boolean;
};

export const PROPERTY_KINDS: Array<{ value: PropertyKind; label: L }> = [
  { value: "real_estate", label: { uz: "Ko'chmas mulk (uy, kvartira, ofis)", ru: "Недвижимость (дом, квартира, офис)" } },
  { value: "land", label: { uz: "Yer uchastkasi", ru: "Земельный участок" } },
  { value: "vehicle", label: { uz: "Avtomobil / transport vositasi", ru: "Автомобиль / транспорт" } },
  { value: "movable", label: { uz: "Ko'char mulk (texnika, mebel)", ru: "Движимое имущество (техника, мебель)" } },
  { value: "other", label: { uz: "Boshqa", ru: "Другое" } },
];

export const PROPERTY_FIELDS: Record<PropertyKind, FieldDef[]> = {
  real_estate: [
    { key: "object_kind", label: { uz: "Obyekt turi (kvartira/uy/ofis)", ru: "Вид объекта (квартира/дом/офис)" }, required: true },
    { key: "rooms", label: { uz: "Xonalar soni", ru: "Количество комнат" }, type: "number" },
    { key: "floor", label: { uz: "Qavat", ru: "Этаж" }, type: "number" },
    { key: "total_floors", label: { uz: "Binoning qavatlari", ru: "Этажность дома" }, type: "number" },
    { key: "build_year", label: { uz: "Qurilgan yili", ru: "Год постройки" }, type: "number" },
    { key: "ownership_doc", label: { uz: "Mulk huquqi hujjati (guvohnoma raqami)", ru: "Документ о праве (номер свидетельства)" } },
  ],
  land: [
    { key: "land_purpose", label: { uz: "Yerning maqsadli vazifasi", ru: "Целевое назначение земли" }, required: true },
    { key: "land_area", label: { uz: "Maydoni (sotix)", ru: "Площадь (сотка)" }, type: "number" },
    { key: "ownership_doc", label: { uz: "Yer hujjati raqami", ru: "Номер земельного документа" } },
  ],
  vehicle: [
    { key: "make", label: { uz: "Markasi", ru: "Марка" }, placeholder: "Chevrolet", required: true },
    { key: "model", label: { uz: "Modeli", ru: "Модель" }, placeholder: "Cobalt", required: true },
    { key: "year", label: { uz: "Ishlab chiqarilgan yili", ru: "Год выпуска" }, type: "number", required: true },
    { key: "plate", label: { uz: "Davlat raqami", ru: "Гос. номер" }, placeholder: "01 A 123 BC", required: true },
    { key: "vin", label: { uz: "Kuzov (VIN) raqami", ru: "Номер кузова (VIN)" }, required: true },
    { key: "engine_number", label: { uz: "Dvigatel raqami", ru: "Номер двигателя" } },
    { key: "engine_volume", label: { uz: "Dvigatel hajmi (l)", ru: "Объём двигателя (л)" } },
    { key: "body_type", label: { uz: "Kuzov turi", ru: "Тип кузова" }, placeholder: "Sedan" },
    { key: "color", label: { uz: "Rangi", ru: "Цвет" } },
    { key: "mileage", label: { uz: "Yurgan masofasi (km)", ru: "Пробег (км)" }, type: "number" },
    { key: "tech_passport", label: { uz: "Texnik pasport seriya va raqami", ru: "Серия и номер техпаспорта" }, required: true },
  ],
  movable: [
    { key: "item_kind", label: { uz: "Mulk turi (texnika, mebel...)", ru: "Вид имущества (техника, мебель...)" }, required: true },
    { key: "brand", label: { uz: "Brend", ru: "Бренд" } },
    { key: "model", label: { uz: "Model", ru: "Модель" } },
    { key: "serial_number", label: { uz: "Seriya / IMEI raqami", ru: "Серийный номер / IMEI" } },
    { key: "quantity", label: { uz: "Soni", ru: "Количество" }, type: "number" },
    { key: "condition", label: { uz: "Holati", ru: "Состояние" }, placeholder: "Yangi / Ishlatilgan" },
  ],
  other: [
    { key: "object_kind", label: { uz: "Obyekt tavsifi", ru: "Описание объекта" }, required: true },
    { key: "doc_number", label: { uz: "Hujjat raqami", ru: "Номер документа" } },
  ],
};

export function kindLabel(kind: string, lang: Lang) {
  return PROPERTY_KINDS.find((k) => k.value === kind)?.label[lang] ?? kind;
}

export function fieldLabel(field: FieldDef, lang: Lang) {
  return field.label[lang];
}

export function findFieldLabel(kind: string, key: string, lang: Lang) {
  const list = PROPERTY_FIELDS[kind as PropertyKind] ?? [];
  return list.find((f) => f.key === key)?.label[lang] ?? key;
}

export function categoryToKind(category: string): PropertyKind {
  if (category === "real_estate") return "real_estate";
  if (category === "vehicles") return "vehicle";
  if (category === "electronics" || category === "furniture") return "movable";
  return "other";
}

export const AREA_KINDS: PropertyKind[] = ["real_estate", "land"];
