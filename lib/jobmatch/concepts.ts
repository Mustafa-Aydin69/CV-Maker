// lib/jobmatch/concepts.ts

import type { SkillConcept } from "./types";
import { searchableOf } from "./normalize";

export const SKILL_CONCEPTS: SkillConcept[] = [
  // ── Araçlar ──────────────────────────────────────────────────────────────────
  {
    id: "microsoft_office", label: "Microsoft Office", category: "tool",
    aliases: ["ms office","ms ofis","microsoft office","office 365","microsoft 365",
              "excel","word","powerpoint","outlook","access"],
    related: [],
  },
  {
    id: "git", label: "Git / Versiyon Kontrol", category: "tool",
    aliases: ["git","github","gitlab","bitbucket","versiyon kontrol","version control","svn"],
    related: [],
  },
  {
    id: "docker", label: "Docker / Konteyner", category: "tool",
    aliases: ["docker","docker-compose","docker compose","konteyner","container","podman"],
    related: ["kubernetes"],
  },
  {
    id: "kubernetes", label: "Kubernetes", category: "tool",
    aliases: ["kubernetes","k8s","helm","kubectl"],
    related: ["docker"],
  },
  {
    id: "figma_tool", label: "Figma / UI Tasarım", category: "tool",
    aliases: ["figma","sketch","adobe xd","invision","zeplin"],
    related: [],
  },
  // ── Frontend ──────────────────────────────────────────────────────────────────
  {
    id: "react", label: "React", category: "hard_skill",
    aliases: ["react","react.js","reactjs","react native"],
    related: ["nextjs","typescript","javascript"],
  },
  {
    id: "nextjs", label: "Next.js", category: "hard_skill",
    aliases: ["next.js","nextjs","next js"],
    related: ["react","typescript"],
  },
  {
    id: "vue", label: "Vue.js", category: "hard_skill",
    aliases: ["vue","vue.js","vuejs","nuxt","nuxt.js"],
    related: ["javascript","typescript"],
  },
  {
    id: "angular", label: "Angular", category: "hard_skill",
    aliases: ["angular","angularjs","angular.js"],
    related: ["typescript","javascript"],
  },
  {
    id: "typescript", label: "TypeScript", category: "hard_skill",
    aliases: ["typescript","ts","typed javascript"],
    related: ["javascript","react"],
  },
  {
    id: "javascript", label: "JavaScript", category: "hard_skill",
    aliases: ["javascript","js","ecmascript","es6","es2015"],
    related: ["typescript","react","vue"],
  },
  {
    id: "html_css", label: "HTML / CSS", category: "hard_skill",
    aliases: ["html","css","html5","css3","scss","sass","less","tailwind","tailwindcss","bootstrap"],
    related: ["javascript"],
  },
  // ── Backend ───────────────────────────────────────────────────────────────────
  {
    id: "nodejs", label: "Node.js", category: "hard_skill",
    aliases: ["node","node.js","nodejs","express","express.js","fastify","nestjs","nest.js"],
    related: ["javascript","typescript"],
  },
  {
    id: "python", label: "Python", category: "hard_skill",
    aliases: ["python","django","flask","fastapi","pytorch","tensorflow","pandas","numpy"],
    related: ["machine_learning"],
  },
  {
    id: "java", label: "Java", category: "hard_skill",
    aliases: ["java","spring","spring boot","spring framework","maven","gradle"],
    related: ["kotlin"],
  },
  {
    id: "kotlin", label: "Kotlin", category: "hard_skill",
    aliases: ["kotlin","android"],
    related: ["java"],
  },
  {
    id: "csharp", label: "C# / .NET", category: "hard_skill",
    aliases: ["c#","csharp",".net","dotnet","asp.net","asp net","blazor"],
    related: [],
  },
  {
    id: "cplusplus", label: "C / C++", category: "hard_skill",
    aliases: ["c++","cplusplus","c programlama","c dili","c language","embedded c","ansi c"],
    related: ["embedded_systems"],
  },
  {
    id: "sql", label: "SQL / Veritabanı", category: "hard_skill",
    aliases: ["sql","mysql","postgresql","postgres","mssql","oracle","sqlite"],
    related: ["nosql"],
  },
  {
    id: "nosql", label: "NoSQL", category: "hard_skill",
    aliases: ["nosql","mongodb","redis","elasticsearch","cassandra","dynamodb","firebase"],
    related: ["sql"],
  },
  {
    id: "rest_api", label: "REST API", category: "hard_skill",
    aliases: ["rest","rest api","restful","api geliştirme","graphql","swagger","openapi"],
    related: [],
  },
  // ── Cloud / DevOps ─────────────────────────────────────────────────────────────
  {
    id: "aws", label: "AWS", category: "tool",
    aliases: ["aws","amazon web services","ec2","s3","lambda","rds"],
    related: ["cloud"],
  },
  {
    id: "azure", label: "Microsoft Azure", category: "tool",
    aliases: ["azure","microsoft azure","azure devops"],
    related: ["cloud"],
  },
  {
    id: "gcp", label: "Google Cloud", category: "tool",
    aliases: ["gcp","google cloud","google cloud platform"],
    related: ["cloud"],
  },
  {
    id: "cloud", label: "Bulut Bilişim", category: "domain",
    aliases: ["cloud","bulut","bulut bilişim","cloud computing"],
    related: ["aws","azure","gcp"],
  },
  {
    id: "cicd", label: "CI/CD", category: "tool",
    aliases: ["ci/cd","cicd","ci cd","jenkins","github actions","gitlab ci","travis","pipeline"],
    related: ["docker","kubernetes"],
  },
  // ── Gömülü / Donanım ──────────────────────────────────────────────────────────
  {
    id: "embedded_systems", label: "Gömülü Sistemler", category: "hard_skill",
    aliases: ["gömülü sistem","gömülü yazılım","embedded systems","embedded software",
              "embedded c","mikrodenetleyici","microcontroller","stm32","esp32","pic","avr","rtos","freertos"],
    related: ["arm_architecture","communication_protocols","cplusplus"],
  },
  {
    id: "arm_architecture", label: "ARM Tabanlı Sistemler", category: "hard_skill",
    aliases: ["arm","arm cortex","cortex-m","cortex m","stm32","stm32f103","stm32h743",
              "stm32f4","stm32l4","arm tabanlı","arm işlemci"],
    related: ["embedded_systems"],
  },
  {
    id: "fpga", label: "FPGA", category: "hard_skill",
    aliases: ["fpga","vhdl","verilog","systemverilog","vivado","quartus","xilinx","altera"],
    related: ["embedded_systems"],
  },
  {
    id: "communication_protocols", label: "Haberleşme Protokolleri", category: "hard_skill",
    aliases: ["can bus","can protokol","uart","spi","i2c","rs485","rs232","modbus","lin bus"],
    related: ["embedded_systems"],
  },
  {
    id: "power_electronics", label: "Güç Elektroniği", category: "domain",
    aliases: ["güç elektroniği","power electronics","güç çevrimi","smps","inverter","converter","pwm"],
    related: ["embedded_systems"],
  },
  // ── Veri Bilimi ───────────────────────────────────────────────────────────────
  {
    id: "machine_learning", label: "Makine Öğrenimi / AI", category: "hard_skill",
    aliases: ["machine learning","makine öğrenimi","ml","deep learning","derin öğrenme",
              "yapay zeka","neural network","nlp","computer vision"],
    related: ["python","data_science"],
  },
  {
    id: "data_science", label: "Veri Bilimi", category: "hard_skill",
    aliases: ["data science","veri bilimi","data analysis","veri analizi","pandas","numpy","scikit-learn","jupyter"],
    related: ["machine_learning","python","sql"],
  },
  // ── Sektörel Bağlam ───────────────────────────────────────────────────────────
  {
    id: "defense_sector", label: "Savunma Sanayii", category: "domain",
    aliases: ["savunma","savunma sanayii","defense","military","askeri","iha","aviyonik"],
    related: ["embedded_systems","fpga"],
  },
  {
    id: "automotive", label: "Otomotiv", category: "domain",
    aliases: ["otomotiv","automotive","araç yazılımı","vehicle","autosar","elektrikli araç"],
    related: ["embedded_systems","communication_protocols"],
  },
  // ── Kişisel Yetkinlikler ──────────────────────────────────────────────────────
  {
    id: "teamwork", label: "Takım Çalışması", category: "soft_skill",
    aliases: ["takım çalışması","ekip çalışması","takım oyuncusu","team player",
              "cross-functional","scrum","agile","işbirliği","collaboration",
              "iş birliği","takıma yatkın","takım ruhu","benimseyenler","işbirliği kültürü"],
    related: ["communication_skills"],
  },
  {
    id: "communication_skills", label: "İletişim Becerileri", category: "soft_skill",
    aliases: ["iletişim","communication","sunum","presentation","raporlama","yazılı iletişim",
              "sözlü iletişim","yazılı ve sözlü","iletişim becerisi","temsil yetkinliği",
              "temsil becerisi","güçlü iletişim"],
    related: ["teamwork"],
  },
  {
    id: "analytical_thinking", label: "Analitik Düşünme / Problem Çözme", category: "soft_skill",
    aliases: ["analitik düşünme","analitik bakış","analitik bakış açısı","problem çözme",
              "problem solving","kök neden analizi","root cause","hata analizi","eleştirel düşünme",
              "liderlik","liderlik potansiyeli","liderlik becerisi","etki yaratma"],
    related: ["attention_to_detail"],
  },
  {
    id: "attention_to_detail", label: "Detay Odaklılık", category: "soft_skill",
    aliases: ["detay odaklı","dikkatli","özenli","detail oriented","titiz"],
    related: ["analytical_thinking"],
  },
  {
    id: "openness_to_learning", label: "Öğrenmeye Açıklık / Motivasyon", category: "soft_skill",
    aliases: ["öğrenmeye açık","gelişime açık","kendini geliştirme","continuous learning",
              "willingness to learn","adaptasyon","uyum sağlama","gelişim odaklı",
              "motivasyonlu","yüksek motivasyon","öğrenme isteği"],
    related: [],
  },
  {
    id: "proactivity", label: "İnisiyatif / Proaktiflik", category: "soft_skill",
    aliases: ["inisiyatif","proaktif","self-starter","bağımsız çalışma","sorumluluk alma",
              "sorumluluk alabilen","inisiyatif kullanabilen","inisiyatif kullanabilme"],
    related: [],
  },
  // ── Dil ───────────────────────────────────────────────────────────────────────
  {
    id: "english", label: "İngilizce", category: "tool",
    aliases: ["ingilizce","english","b2","c1","c2","upper intermediate","advanced","fluent",
              "business english","ielts","toefl","yds","yökdil"],
    related: [],
  },
  {
    id: "german", label: "Almanca", category: "tool",
    aliases: ["almanca","german","deutsch"],
    related: [],
  },
  // ── Uygunluk ──────────────────────────────────────────────────────────────────
  {
    id: "internship_eligibility", label: "Zorunlu Staj", category: "domain",
    aliases: ["zorunlu staj","staj yükümlülüğü","staj zorunluluğu","mandatory internship",
              "zorunlu stajı olan","staj hakkı","kısa dönem staj","uzun dönem staj"],
    related: ["university_insurance"],
  },
  {
    id: "university_insurance", label: "Üniversite Sigortası", category: "domain",
    aliases: ["üniversite sigortası","sgk","sigorta üniversite","okul sigortası",
              "sigortanın üniversite tarafından","university insurance"],
    related: ["internship_eligibility"],
  },
  {
    id: "student_status", label: "Öğrenci Olmak", category: "domain",
    aliases: ["öğrenci","student","üniversite öğrencisi","lisans öğrencisi","yüksek lisans",
              "undergraduate","graduate","mezun olmamış"],
    related: ["internship_eligibility"],
  },
  {
    id: "driving_license", label: "Ehliyet", category: "domain",
    aliases: ["ehliyet","driving license","b sınıfı ehliyet","sürücü belgesi"],
    related: [],
  },
];

export function findConceptById(id: string): SkillConcept | undefined {
  return SKILL_CONCEPTS.find((c) => c.id === id);
}

export function findConceptByText(text: string): SkillConcept | undefined {
  const s = searchableOf(text.toLowerCase());
  let best: SkillConcept | undefined;
  let bestLen = 0;
  for (const concept of SKILL_CONCEPTS) {
    for (const alias of concept.aliases) {
      const a = searchableOf(alias);
      if (a.length >= 3 && s.includes(a) && a.length > bestLen) {
        best = concept;
        bestLen = a.length;
      }
    }
  }
  return best;
}

export function textMatchesConcept(text: string, concept: SkillConcept): boolean {
  const s = searchableOf(text.toLowerCase());
  return concept.aliases.some((alias) => {
    const a = searchableOf(alias);
    return a.length >= 3 && s.includes(a);
  });
}
