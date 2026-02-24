import type { AppLocale } from "@/i18n/routing";

type LegalDocument = "privacy" | "terms" | "gdpr" | "dpa";

const LABELS: Record<LegalDocument, Record<AppLocale, string>> = {
	privacy: {
		en: "Privacy Policy",
		es: "Política de privacidad",
		fr: "Politique de confidentialité",
		de: "Datenschutzrichtlinie",
		pt: "Política de Privacidade",
		hi: "गोपनीयता नीति",
		ja: "プライバシーポリシー",
		zh: "隐私政策",
		it: "Informativa sulla Privacy",
		ar: "سياسة الخصوصية",
		ko: "개인정보 처리방침",
		ru: "Политика конфиденциальности",
		tr: "Gizlilik Politikası",
		nl: "Privacybeleid",
	},
	terms: {
		en: "Terms of Service",
		es: "Términos del servicio",
		fr: "Conditions d'utilisation",
		de: "Nutzungsbedingungen",
		pt: "Termos de Serviço",
		hi: "सेवा की शर्तें",
		ja: "利用規約",
		zh: "服务条款",
		it: "Termini di Servizio",
		ar: "شروط الخدمة",
		ko: "서비스 이용약관",
		ru: "Условия использования",
		tr: "Hizmet Şartları",
		nl: "Servicevoorwaarden",
	},
	gdpr: {
		en: "GDPR Compliance",
		es: "Cumplimiento RGPD",
		fr: "Conformité RGPD",
		de: "DSGVO-Konformität",
		pt: "Conformidade com o RGPD",
		hi: "GDPR अनुपालन",
		ja: "GDPR準拠",
		zh: "GDPR合规",
		it: "Conformità GDPR",
		ar: "الامتثال للائحة GDPR",
		ko: "GDPR 준수",
		ru: "Соответствие GDPR",
		tr: "KVKK/GDPR Uyumluluğu",
		nl: "AVG-naleving",
	},
	dpa: {
		en: "Data Processing Agreement",
		es: "Acuerdo de tratamiento de datos",
		fr: "Accord de traitement des données",
		de: "Auftragsverarbeitungsvertrag",
		pt: "Acordo de Processamento de Dados",
		hi: "डेटा प्रोसेसिंग समझौता",
		ja: "データ処理契約",
		zh: "数据处理协议",
		it: "Accordo sul Trattamento dei Dati",
		ar: "اتفاقية معالجة البيانات",
		ko: "데이터 처리 계약",
		ru: "Соглашение об обработке данных",
		tr: "Veri İşleme Sözleşmesi",
		nl: "Verwerkersovereenkomst",
	},
};

export function getLegalLabel(document: LegalDocument, locale: AppLocale): string {
	return LABELS[document][locale] ?? LABELS[document].en;
}
