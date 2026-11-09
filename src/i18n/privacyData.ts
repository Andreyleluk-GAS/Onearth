import { Language } from './types';

export interface PrivacySection {
  title: string;
  items: string[];
}

export interface PrivacyPolicyData {
  title: string;
  subtitle: string;
  badge: string;
  preamble: string;
  effectiveDate: string;
  sections: PrivacySection[];
}

export const PRIVACY_POLICY: Record<Language, PrivacyPolicyData> = {
  ru: {
    title: "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ",
    subtitle: 'Регламент обработки и защиты персональных данных пользователей корпоративного сайта Hubei Onearth Trading Company Limited',
    badge: 'Федеральный закон № 152-ФЗ «О персональных данных»',
    preamble: "Настоящая Политика конфиденциальности персональных данных (далее – Политика конфиденциальности) действует в отношении всей информации, которую Сайт может получить о Пользователе во время просмотра сайта.",
    effectiveDate: 'Редакция действует с 09 ноября 2026 года',
    sections: [
      {
            "title": "1. ОПРЕДЕЛЕНИЕ ТЕРМИНОВ",
            "items": [
                  "1.1 В настоящей Политике конфиденциальности используются следующие термины:",
                  "1.1.1. «Администрация сайта» – уполномоченные сотрудники на управление сайтом, которые организуют и (или) осуществляет обработку персональных данных, а также определяет цели обработки персональных данных, состав персональных данных, подлежащих обработке, действия (операции), совершаемые с персональными данными.",
                  "1.1.2. «Персональные данные» — любая информация, относящаяся к прямо или косвенно определенному или определяемому физическому лицу (субъекту персональных данных).",
                  "1.1.3. «Обработка персональных данных» — любое действие (операция) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных.",
                  "1.1.4. «Конфиденциальность персональных данных» — обязательное для соблюдения Оператором или иным получившим доступ к персональным данным лицом требование не допускать их распространения без согласия субъекта персональных данных или наличия иного законного основания.",
                  "1.1.5. «Пользователь сайта» (далее - Пользователь) – лицо, имеющее доступ к Сайту, посредством сети Интернет и использующее Сайт.",
                  "1.1.6. «Cookies» — небольшой фрагмент данных, отправленный веб-сервером и хранимый на компьютере пользователя, который веб-клиент или веб-браузер каждый раз пересылает веб-серверу в HTTP-запросе при попытке открыть страницу соответствующего сайта.",
                  "1.1.7. «IP-адрес» — уникальный сетевой адрес узла в компьютерной сети, построенной по протоколу IP."
            ]
      },
      {
            "title": "2. ОБЩИЕ ПОЛОЖЕНИЯ",
            "items": [
                  "2.1. Использование Пользователем Сайта означает согласие с настоящей Политикой конфиденциальности и условиями обработки персональных данных Пользователя.",
                  "2.2. В случае несогласия с условиями Политики конфиденциальности Пользователь должен прекратить использование Сайта.",
                  "2.3. Настоящая Политика конфиденциальности применяется только к данному сайту. Администрация сайта не контролирует и не несет ответственность за сайты третьих лиц, на которые Пользователь может перейти по ссылкам, доступным на Сайте.",
                  "2.4. Администрация сайта не проверяет достоверность персональных данных, предоставляемых Пользователем Сайта."
            ]
      },
      {
            "title": "3. ПРЕДМЕТ ПОЛИТИКИ КОНФИДЕНЦИАЛЬНОСТИ",
            "items": [
                  "3.1. Настоящая Политика конфиденциальности устанавливает обязательства Администрации сайта по неразглашению и обеспечению режима защиты конфиденциальности персональных данных, которые Пользователь предоставляет по запросу Администрации сайта при регистрации на Сайте или при оформлении заказа для приобретения Товара, оказания Услуг или выполнения Работ.",
                  "3.2. Персональные данные, разрешённые к обработке в рамках настоящей Политики конфиденциальности, предоставляются Пользователем путём заполнения формы на Сайте и могут включать в себя следующую информацию:",
                  "3.2.1. фамилию, имя, отчество Пользователя;",
                  "3.2.2. контактный телефон Пользователя;",
                  "3.2.3. адрес электронной почты (e-mail);",
                  "3.2.4. адрес доставки Товара или место оказания Услуг (если требуется);",
                  "3.2.5. место жительство Пользователя (если требуется).",
                  "3.3. Сайт защищает Данные, которые автоматически передаются в процессе просмотра рекламных блоков и при посещении страниц, на которых установлен статистический скрипт системы («пиксель»):",
                  "IP адрес;",
                  "информация из cookies;",
                  "информация о браузере (или иной программе, которая осуществляет доступ к показу рекламы);",
                  "время доступа;",
                  "адрес страницы, на которой расположен рекламный блок;",
                  "реферер (адрес предыдущей страницы).",
                  "3.3.1. Отключение cookies может повлечь невозможность доступа к частям Сайта, требующим авторизации.",
                  "3.3.2. Сайт осуществляет сбор статистики об IP-адресах своих посетителей. Данная информация используется с целью выявления и решения технических проблем, для контроля законности проводимых финансовых платежей.",
                  "3.4. Любая иная персональная информация неоговоренная выше (история покупок, используемые браузеры и операционные системы и т.д.) подлежит надежному хранению и нераспространению, за исключением случаев, предусмотренных в п.п. 5.2. и 5.3. настоящей Политики конфиденциальности."
            ]
      },
      {
            "title": "4. ЦЕЛИ СБОРА ПЕРСОНАЛЬНОЙ ИНФОРМАЦИИ ПОЛЬЗОВАТЕЛЯ",
            "items": [
                  "4.1. Персональные данные Пользователя Администрация сайта может использовать в целях:",
                  "4.1.1. Идентификации Пользователя, зарегистрированного на Сайте, для оформления заказа и (или) заключения Договора купли-продажи товара либо оказания услуг дистанционным способом.",
                  "4.1.2. Предоставления Пользователю доступа к персонализированным ресурсам Сайта.",
                  "4.1.3. Установления с Пользователем обратной связи, включая направление уведомлений, запросов, касающихся использования Сайта, оказания услуг, обработка запросов и заявок от Пользователя.",
                  "4.1.4. Определения места нахождения Пользователя для обеспечения безопасности, предотвращения мошенничества.",
                  "4.1.5. Подтверждения достоверности и полноты персональных данных, предоставленных Пользователем.",
                  "4.1.6. Создания учетной записи для совершения покупок либо заказа услуг, если Пользователь дал согласие на создание учетной записи.",
                  "4.1.7. Уведомления Пользователя Сайта о состоянии Заказа.",
                  "4.1.8. Обработки и получения платежей, подтверждения налога или налоговых льгот, оспаривания платежа, определения права на получение кредитной линии Пользователем.",
                  "4.1.9. Предоставления Пользователю эффективной клиентской и технической поддержки при возникновении проблем, связанных с использованием Сайта.",
                  "4.1.10. Предоставления Пользователю с его согласия, обновлений продукции либо услуг, специальных предложений, информации о ценах, новостной рассылки и иных сведений от имени Сайта или от имени партнеров Сайта.",
                  "4.1.11. Осуществления рекламной деятельности с согласия Пользователя.",
                  "4.1.12. Предоставления доступа Пользователю на сайты или сервисы партнеров Сайта с целью получения продуктов, обновлений и услуг."
            ]
      },
      {
            "title": "5. СПОСОБЫ И СРОКИ ОБРАБОТКИ ПЕРСОНАЛЬНОЙ ИНФОРМАЦИИ",
            "items": [
                  "5.1. Обработка персональных данных Пользователя осуществляется без ограничения срока, любым законным способом, в том числе в информационных системах персональных данных с использованием средств автоматизации или без использования таких средств.",
                  "5.2. Пользователь соглашается с тем, что Администрация сайта вправе передавать персональные данные третьим лицам, в частности, курьерским службам, организациями почтовой связи, операторам электросвязи, исключительно в целях выполнения заказа Пользователя, оформленного на Сайте, включая доставку Товара, оказания Услуг или выполнения Работ.",
                  "5.3. Персональные данные Пользователя могут быть переданы уполномоченным органам государственной власти Российской Федерации только по основаниям и в порядке, установленным законодательством Российской Федерации.",
                  "5.4. При утрате или разглашении персональных данных Администрация сайта информирует Пользователя об утрате или разглашении персональных данных.",
                  "5.5. Администрация сайта принимает необходимые организационные и технические меры для защиты персональной информации Пользователя от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий третьих лиц.",
                  "5.6. Администрация сайта совместно с Пользователем принимает все необходимые меры по предотвращению убытков или иных отрицательных последствий, вызванных утратой или разглашением персональных данных Пользователя."
            ]
      },
      {
            "title": "6. ОБЯЗАТЕЛЬСТВА СТОРОН",
            "items": [
                  "6.1. Пользователь обязан:",
                  "6.1.1. Предоставить информацию о персональных данных, необходимую для пользования Сайтом.",
                  "6.1.2. Обновить, дополнить предоставленную информацию о персональных данных в случае изменения данной информации.",
                  "6.2. Администрация сайта обязана:",
                  "6.2.1. Использовать полученную информацию исключительно для целей, указанных в п. 4 настоящей Политики конфиденциальности.",
                  "6.2.2. Обеспечить хранение конфиденциальной информации в тайне, не разглашать без предварительного письменного разрешения Пользователя, а также не осуществлять продажу, обмен, опубликование, либо разглашение иными возможными способами переданных персональных данных Пользователя, за исключением п.п. 5.2. и 5.3. настоящей Политики Конфиденциальности.",
                  "6.2.3. Принимать меры предосторожности для защиты конфиденциальности персональных данных Пользователя согласно порядку, обычно используемого для защиты такого рода информации в существующем деловом обороте.",
                  "6.2.4. Осуществить блокирование персональных данных, относящихся к соответствующему Пользователю, с момента обращения или запроса Пользователя или его законного представителя либо уполномоченного органа по защите прав субъектов персональных данных на период проверки, в случае выявления недостоверных персональных данных или неправомерных действий."
            ]
      },
      {
            "title": "7. ОТВЕТСТВЕННОСТЬ СТОРОН",
            "items": [
                  "7.1. Администрация сайта, не исполнившая свои обязательства, несёт ответственность за убытки, понесённые Пользователем в связи с неправомерным использованием персональных данных, в соответствии с законодательством Российской Федерации, за исключением случаев, предусмотренных п.п. 5.2., 5.3. и 7.2. настоящей Политики Конфиденциальности.",
                  "7.2. В случае утраты или разглашения Конфиденциальной информации Администрация сайта не несёт ответственность, если данная конфиденциальная информация:",
                  "7.2.1. Стала публичным достоянием до её утраты или разглашения.",
                  "7.2.2. Была получена от третьей стороны до момента её получения Администрацией сайта.",
                  "7.2.3. Была разглашена с согласия Пользователя."
            ]
      },
      {
            "title": "8. РАЗРЕШЕНИЕ СПОРОВ",
            "items": [
                  "8.1. До обращения в суд с иском по спорам, возникающим из отношений между Пользователем Сайта и Администрацией сайта, обязательным является предъявление претензии (письменного предложения о добровольном урегулировании спора).",
                  "8.2. Получатель претензии в течение 30 календарных дней со дня получения претензии, письменно уведомляет заявителя претензии о результатах рассмотрения претензии.",
                  "8.3. При не достижении соглашения спор будет передан на рассмотрение в судебный орган в соответствии с действующим законодательством Российской Федерации.",
                  "8.4. К настоящей Политике конфиденциальности и отношениям между Пользователем и Администрацией сайта применяется действующее законодательство Российской Федерации."
            ]
      },
      {
            "title": "9. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ",
            "items": [
                  "9.1. Администрация сайта вправе вносить изменения в настоящую Политику конфиденциальности без согласия Пользователя.",
                  "9.2. Новая Политика конфиденциальности вступает в силу с момента ее размещения на Сайте, если иное не предусмотрено новой редакцией Политики конфиденциальности."
            ]
      }
]
  },
  en: {
    title: 'PRIVACY POLICY',
    subtitle: 'Regulations on personal data processing and privacy protection for users of Hubei Onearth Trading Company Limited portal',
    badge: 'Data Protection & Compliance Standard',
    preamble: 'This Personal Data Privacy Policy (hereinafter referred to as the Privacy Policy) applies to all information that the Site may receive about the User during their visit and use of the Site.',
    effectiveDate: 'Effective date: November 09, 2026',
    sections: [
      {
            "title": "1. DEFINITION OF TERMS",
            "items": [
                  "1.1 In this Privacy Policy, the following terms are used with the meanings set forth below:",
                  "1.1.1. \"Site Administration\" – authorized representatives responsible for website management who organize and/or perform personal data processing, as well as determine the purposes of processing, categories of personal data subject to processing, and operations performed with personal data.",
                  "1.1.2. \"Personal Data\" — any information relating directly or indirectly to an identified or identifiable natural person (personal data subject).",
                  "1.1.3. \"Processing of Personal Data\" — any action (operation) or set of actions (operations) performed on personal data with or without automated means, including collection, recording, systematization, accumulation, storage, clarification (updating, modification), retrieval, utilization, transfer (distribution, provision, access), anonymization, blocking, deletion, and destruction.",
                  "1.1.4. \"Confidentiality of Personal Data\" — mandatory compliance by the Operator or other party having access to personal data not to disseminate such data without the consent of the subject or other legitimate statutory ground.",
                  "1.1.5. \"User\" – an individual accessing and utilizing the Website via the Internet.",
                  "1.1.6. \"Cookies\" — small data packets transmitted by a web server and stored on the user's computer, which the web browser retransmits to the server upon each HTTP request when accessing web pages.",
                  "1.1.7. \"IP Address\" — unique network node address in a computer network configured using the Internet Protocol."
            ]
      },
      {
            "title": "2. GENERAL PROVISIONS",
            "items": [
                  "2.1. Use of the Website by the User constitutes unconditional acceptance of this Privacy Policy and the terms of processing the User's personal data.",
                  "2.2. In case of disagreement with the provisions of the Privacy Policy, the User must immediately discontinue using the Website.",
                  "2.3. This Privacy Policy applies exclusively to this Website. The Site Administration neither controls nor bears responsibility for third-party websites accessible via hyperlinks provided on the Site.",
                  "2.4. The Site Administration does not verify the authenticity of personal data submitted by the User."
            ]
      },
      {
            "title": "3. SUBJECT MATTER OF THE PRIVACY POLICY",
            "items": [
                  "3.1. This Privacy Policy establishes the obligations of the Site Administration regarding non-disclosure and confidentiality protection of personal data provided by the User upon sending an equipment inquiry, requesting commercial proposals, or ordering equipment.",
                  "3.2. Personal data permitted for processing under this Privacy Policy is provided by the User by completing feedback and RFQ forms on the Site and may include:",
                  "3.2.1. Full name of the User;",
                  "3.2.2. Contact phone number;",
                  "3.2.3. Electronic mail address (e-mail);",
                  "3.2.4. Delivery destination or site commissioning location (if required);",
                  "3.2.5. Registered office or residence of the User (if required).",
                  "3.3. The Site protects data automatically transmitted during web browsing and statistical analytics script execution:",
                  "— IP address;",
                  "— Information stored in cookies;",
                  "— Browser type and technical environment data;",
                  "— Access timestamp;",
                  "— Requested URL and referring web address (HTTP referrer).",
                  "3.3.1. Disabling cookies may limit access to specific interactive features of the Site.",
                  "3.3.2. The Site gathers statistical visitor IP logs used for diagnosing technical errors and ensuring transaction security.",
                  "3.4. Any other non-specified personal information (browsing history, operating system, etc.) is stored securely and not subject to unauthorized distribution, except as provided in clauses 5.2 and 5.3 of this Policy."
            ]
      },
      {
            "title": "4. PURPOSES OF USER PERSONAL DATA COLLECTION",
            "items": [
                  "4.1. The Site Administration may use the User's personal data for the following purposes:",
                  "4.1.1. Identification of the User for processing commercial equipment inquiries, price quotes, and contracts.",
                  "4.1.2. Providing the User with personalized technical datasheets and product catalogs.",
                  "4.1.3. Establishing bilateral communication, including notifications, technical clarifications, and commercial proposals regarding transformer equipment.",
                  "4.1.4. Geolocation identification for cargo dispatch planning and fraud prevention.",
                  "4.1.5. Verifying the accuracy and completeness of submitted project parameters.",
                  "4.1.6. Registering client accounts for equipment ordering (upon client request).",
                  "4.1.7. Notifying the User about order execution stages and delivery milestones.",
                  "4.1.8. Processing international settlements, tax documentation, and letter of credit conditions.",
                  "4.1.9. Providing comprehensive engineering consultation and technical support.",
                  "4.1.10. Providing product updates, promotional offers, and specialized pricing with the User's explicit consent.",
                  "4.1.11. Conducting informational and marketing communication where consented.",
                  "4.1.12. Facilitating direct interaction with Chinese manufacturing partner facilities."
            ]
      },
      {
            "title": "5. METHODS AND TIME PERIODS OF PERSONAL DATA PROCESSING",
            "items": [
                  "5.1. Personal data processing is conducted indefinitely by any lawful means, utilizing automated information systems or manual paper/electronic records.",
                  "5.2. The User agrees that the Site Administration may transfer personal data to third parties (forwarding agencies, international logistics carriers, telecommunication operators) solely to execute the User's equipment order.",
                  "5.3. Personal data may be disclosed to authorized state bodies only on statutory grounds and under procedures established by applicable law.",
                  "5.4. In the event of data loss or unauthorized disclosure, the Site Administration shall notify the User.",
                  "5.5. The Site Administration implements required technical and organizational measures to safeguard personal data against unauthorized or accidental access, alteration, blocking, copying, or dissemination.",
                  "5.6. Joint measures are undertaken by the Site Administration and the User to mitigate damages or adverse effects caused by data loss."
            ]
      },
      {
            "title": "6. OBLIGATIONS OF THE PARTIES",
            "items": [
                  "6.1. The User is obligated to:",
                  "6.1.1. Provide valid and complete personal data necessary for commercial interaction.",
                  "6.1.2. Promptly update personal data in case of relevant changes.",
                  "6.2. The Site Administration is obligated to:",
                  "6.2.1. Use received personal data strictly for purposes defined in Section 4 of this Policy.",
                  "6.2.2. Keep confidential information strictly secret without sale, exchange, or unauthorized disclosure.",
                  "6.2.3. Exercise standard commercial care and modern cryptographic protocols to protect personal data.",
                  "6.2.4. Block personal data relating to the User upon their formal request or during verification periods."
            ]
      },
      {
            "title": "7. LIABILITY OF THE PARTIES",
            "items": [
                  "7.1. The Site Administration failing to honor its obligations bears liability for direct losses incurred by the User due to unlawful processing, per applicable legislation.",
                  "7.2. The Site Administration is exempt from liability if confidential information:",
                  "7.2.1. Became public prior to its loss or disclosure.",
                  "7.2.2. Was obtained from an independent third party prior to receipt by the Site Administration.",
                  "7.2.3. Was disclosed with the prior explicit consent of the User."
            ]
      },
      {
            "title": "8. DISPUTE RESOLUTION",
            "items": [
                  "8.1. Prior to filing a judicial claim, the submission of a written pre-trial claim (formal amicable settlement proposal) is mandatory.",
                  "8.2. The recipient of the claim shall provide written notice of examination findings within 30 calendar days from receipt.",
                  "8.3. Unresolved disputes shall be submitted to the competent judicial authority in accordance with applicable legislation.",
                  "8.4. Applicable substantive law shall govern relations between the User and the Site Administration."
            ]
      },
      {
            "title": "9. ADDITIONAL TERMS",
            "items": [
                  "9.1. The Site Administration reserves the right to amend this Privacy Policy unilaterally.",
                  "9.2. Revised Privacy Policy versions become legally effective upon publication on the Website."
            ]
      }
]
  },
  zh: {
    title: '个人信息保护与隐私政策',
    subtitle: '湖北万域贸易有限公司（Hubei Onearth Trading Company Limited）网站用户个人信息处理与合规保护规程',
    badge: '个人信息保护法与国际合规准则',
    preamble: '本个人信息保护与隐私权政策（以下简称“隐私政策”）适用于用户在访问、浏览及使用本网站期间，本网站可能获取的所有用户信息与数据。',
    effectiveDate: '本规程生效日期：2026年11月09日',
    sections: [
      {
            "title": "1. 术语定义",
            "items": [
                  "1.1 本《隐私政策》中所使用的关键术语具有如下法律含义：",
                  "1.1.1. “网站运营方” — 经授权负责本网站日常运营管理的专业人员及实体，负责组织和/或执行个人信息处理活动，并决定处理目的、个人信息类别及具体操作环节。",
                  "1.1.2. “个人信息” — 以电子或者其他方式记录的与已识别或者可识别的自然人有关的各种信息。",
                  "1.1.3. “个人信息处理” — 包括个人信息的收集、存储、使用、加工、传输、提供、公开、删除等全部或部分操作。",
                  "1.1.4. “个人信息保密义务” — 网站运营方及其他合法接触个人信息的人员必须承担的法定保密责任，未经个人同意或法律授权，不得对外泄露。",
                  "1.1.5. “网站用户”（以下简称“用户”） — 通过互联网网络访问、浏览并使用本网站服务的自然人或法人代表。",
                  "1.1.6. “Cookies” — 由网络服务器生成并储存在用户终端设备上的数据文件，用于在用户后续访问时保持会话状态并优化用户体验。",
                  "1.1.7. “IP 地址” — 用户计算机或移动设备接入互联网时分配的独立网络协议地址。"
            ]
      },
      {
            "title": "2. 基本原则与通用条款",
            "items": [
                  "2.1. 用户访问并使用本网站即视为无条件充分理解并同意接受本《隐私政策》及个人信息处理条款。",
                  "2.2. 如用户不同意本政策之任何条款，应立即停止浏览与使用本网站。",
                  "2.3. 本隐私政策仅适用于本网站。对于通过本网站链接跳转的第三方网站，本网站不具备控制权，亦不承担任何连带责任。",
                  "2.4. 网站运营方不对用户所提交个人信息的真实性与完整性承担实质审查责任。"
            ]
      },
      {
            "title": "3. 隐私政策的主体范围与数据类别",
            "items": [
                  "3.1. 本政策规定了网站运营方在用户提交设备技术咨询、索取商务报价或下单订货时，对所提供个人信息承担的保密与合规保护义务。",
                  "3.2. 依据本政策处理的个人信息由用户在网站在线表单中自愿提交，主要包括：",
                  "3.2.1. 用户的姓名与职务；",
                  "3.2.2. 联系电话号码；",
                  "3.2.3. 电子邮箱地址（E-mail）；",
                  "3.2.4. 设备交货目的地或工程现场地址（如适用）；",
                  "3.2.5. 企业住所地或常住地址（如适用）。",
                  "3.3. 本网站自动记录与保护技术访问日志数据：",
                  "— 网络 IP 地址；",
                  "— Cookies 所包含的技术标识符；",
                  "— 浏览器类型及操作系统版本；",
                  "— 访问时间戳及停留时长；",
                  "— 来源网址（Referrer）及浏览页面 URL。",
                  "3.3.1. 禁用 Cookies 可能导致网站部分高级交互功能无法正常使用。",
                  "3.3.2. IP 地址统计主要用于分析网络故障、维护服务器安全及防范网络欺诈。",
                  "3.4. 除本政策第 5.2 条和第 5.3 条明确规定的情形外，未经用户授权，所有非公开个人信息均受到严格保密与安全存储。"
            ]
      },
      {
            "title": "4. 收集与使用用户个人信息的目的",
            "items": [
                  "4.1. 网站运营方收集与使用用户个人信息仅限于以下合法业务目的：",
                  "4.1.1. 核实用户身份，以便准确受理变压器技术选型询价并出具正式商业报价方案；",
                  "4.1.2. 向用户提供定制化的技术图纸、规格说明书及产品选型手册；",
                  "4.1.3. 保持业务沟通，包括发送工程进度通知、技术参数确认及合同履约答复；",
                  "4.1.4. 确认交货地理区域，优化国际物流路线及防范交易风险；",
                  "4.1.5. 核验工程技术协议与单线图数据的准确性；",
                  "4.1.6. 为长期合作客户建立专属技术档案与采购账户；",
                  "4.1.7. 及时通知订单排产、工厂出厂试验及交货节点状态；",
                  "4.1.8. 协助进行跨境商务结算、信用证条款审核与外贸单证处理；",
                  "4.1.9. 提供快速响应的技术咨询与售后工程支持；",
                  "4.1.10. 在取得明确授权的前提下，向用户推荐适用的新型节能电力变压器与优惠商务方案；",
                  "4.1.11. 开展合规的行业资讯与技术研讨交流；",
                  "4.1.12. 协助买方直接与中国专业输变电制造工厂进行技术澄清。"
            ]
      },
      {
            "title": "5. 个人信息的处理方式与保存期限",
            "items": [
                  "5.1. 个人信息的处理不受固定期限限制，采用自动化系统或必要的人工方式在法律允许的范围内进行。",
                  "5.2. 用户知悉并同意：为履行采购合同之目的，网站运营方有权在必要范围内向第三方（如国际货代、物流承运人、报关行等）提供相关联系信息。",
                  "5.3. 依据法定程序及有管辖权的国家行政或司法机关之合法要求，可依法披露个人信息。",
                  "5.4. 如发生信息泄露等安全事件，网站运营方将依法启动应急预案并履行告知义务。",
                  "5.5. 运营方采取业界通行的组织与技术防范措施，包括访问控制、数据加密及安全审计，确保信息安全。",
                  "5.6. 双方共同采取合理措施，防范因不可抗力或信息安全事件造成的潜在损失。"
            ]
      },
      {
            "title": "6. 双方权利与义务",
            "items": [
                  "6.1. 用户义务：",
                  "6.1.1. 提供真实、准确、合法的业务联系人信息；",
                  "6.1.2. 联系信息变更时及时告知并进行更新。",
                  "6.2. 网站运营方义务：",
                  "6.2.1. 严格按照本政策第 4 条所列目的使用个人信息；",
                  "6.2.2. 对商业与个人数据严加保密，不予出售、转让或未经授权对外公开；",
                  "6.2.3. 采用符合行业标准的防护技术保障数据私密性；",
                  "6.2.4. 收到用户正式书面申请后，及时核实、更正或依法删除相关个人信息。"
            ]
      },
      {
            "title": "7. 违约与法律责任",
            "items": [
                  "7.1. 因运营方故意或重大过失违法使用个人信息造成用户直接经济损失的，运营方依法承担相应赔偿责任。",
                  "7.2. 发生下列情形之一的，网站运营方不承担法律责任：",
                  "7.2.1. 该信息在披露前已为公众所知晓；",
                  "7.2.2. 从合法第三方处独立获取且未附带保密限制；",
                  "7.2.3. 经用户事前书面同意而披露。"
            ]
      },
      {
            "title": "8. 争议解决与法律适用",
            "items": [
                  "8.1. 任何因本隐私政策或个人信息处理引起的争议，双方均应首先通过友好协商及正式书面申诉解决。",
                  "8.2. 收到书面通知后，接收方应在 30 个自然日内给予正式书面回复。",
                  "8.3. 协商不成的，任何一方均可依法向有管辖权的人民法院提起诉讼。",
                  "8.4. 本政策之订立、执行及解释均适用现行有效之法律法规。"
            ]
      },
      {
            "title": "9. 附则与政策修订",
            "items": [
                  "9.1. 网站运营方有权根据业务发展及法律法规变化对本隐私政策进行修订。",
                  "9.2. 新版隐私政策自本网站正式发布之日起生效实施。"
            ]
      }
]
  }
};
