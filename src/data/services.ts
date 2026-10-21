import type { Service } from '@/lib/types';

export const services: Service[] = [
  {
    id: 'custom-web-development',
    title: 'Custom Web Development',
    shortDescription: 'Full-stack web applications built with modern technologies for scalable, performant solutions.',
    fullDescription: 'We build custom web applications from the ground up using cutting-edge technologies. Whether you need a complex SaaS platform, an e-commerce solution, or an enterprise dashboard, our team delivers production-ready code with clean architecture, comprehensive testing, and scalable infrastructure.',
    icon: 'Code',
    features: [
      'Modern React/Next.js frontends with TypeScript',
      'Robust Node.js/Python/Go backends',
      'PostgreSQL, MongoDB, or database of your choice',
      'RESTful APIs & GraphQL with proper documentation',
      'Authentication & authorization (OAuth, JWT, SSO)',
      'Real-time features with WebSockets/Socket.io',
      'Automated CI/CD pipelines',
      'Docker containerization & Kubernetes deployment',
      'Comprehensive test coverage (unit, integration, e2e)',
      'Performance optimization & monitoring',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS/GCP', 'GraphQL'],
    category: 'development',
    startingPrice: '$500+',
    popular: true,
  },
  {
    id: 'ai-ml-solutions',
    title: 'AI & Machine Learning Solutions',
    shortDescription: 'Integrate intelligent features into your products with custom ML models and AI-powered automation.',
    fullDescription: 'Transform your business with artificial intelligence. We build custom ML models, integrate LLMs, and create AI-powered features that solve real business problems. From recommendation engines to document processing, chatbots to predictive analytics.',
    icon: 'Brain',
    features: [
      'Custom ML model development & training',
      'LLM fine-tuning & RAG implementations',
      'AI chatbots & virtual assistants',
      'Computer vision & image recognition',
      'Natural language processing pipelines',
      'Predictive analytics & forecasting',
      'Document automation & data extraction',
      'Recommendation & personalization engines',
      'MLOps & model deployment pipelines',
      'AI ethics & bias auditing',
    ],
    techStack: ['Python', 'PyTorch', 'TensorFlow', 'OpenAI', 'LangChain', 'Vector DBs', 'MLflow', 'Kubeflow'],
    category: 'ai',
    startingPrice: '$2,000+',
    popular: true,
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    shortDescription: 'Native and cross-platform mobile applications for iOS and Android with exceptional UX.',
    fullDescription: 'We create mobile experiences that users love. From consumer apps to enterprise solutions, we build performant, beautiful applications using React Native, Flutter, or native Swift/Kotlin. App Store ready with proper CI/CD, analytics, and crash reporting.',
    icon: 'Smartphone',
    features: [
      'Cross-platform with React Native / Flutter',
      'Native iOS (Swift) & Android (Kotlin) development',
      'Offline-first architecture with sync',
      'Push notifications & deep linking',
      'In-app purchases & subscriptions',
      'Biometric authentication',
      'App Store & Play Store deployment',
      'Over-the-air updates (CodePush)',
      'Performance profiling & optimization',
      'Accessibility compliance (WCAG 2.1)',
    ],
    techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo', 'Firebase', 'App Store Connect'],
    category: 'mobile',
    startingPrice: '$1,500+',
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Infrastructure & DevOps',
    shortDescription: 'Scalable, secure cloud architecture with automated deployments and monitoring.',
    fullDescription: 'Modern cloud infrastructure that scales with your business. We design and implement cloud-native architectures on AWS, GCP, or Azure with Infrastructure as Code, automated CI/CD, comprehensive monitoring, and security best practices built-in.',
    icon: 'Cloud',
    features: [
      'Infrastructure as Code (Terraform, Pulumi)',
      'Kubernetes (EKS, GKE, AKS) cluster management',
      'Serverless architectures (Lambda, Cloud Functions)',
      'CI/CD pipelines (GitHub Actions, GitLab CI, ArgoCD)',
      'Observability (Prometheus, Grafana, Datadog)',
      'Log aggregation (ELK, Loki, CloudWatch)',
      'Security hardening & compliance (SOC2, HIPAA)',
      'Cost optimization & FinOps',
      'Disaster recovery & backup strategies',
      'Multi-cloud & hybrid cloud strategies',
    ],
    techStack: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Terraform', 'Docker', 'Prometheus', 'Grafana'],
    category: 'cloud',
    startingPrice: '$1,000+',
  },
  {
    id: 'api-development',
    title: 'API Development & Integration',
    shortDescription: 'Robust, well-documented APIs with modern patterns for seamless system integration.',
    fullDescription: 'APIs are the backbone of modern software. We design and build RESTful, GraphQL, and gRPC APIs with comprehensive documentation, versioning, rate limiting, and security. We also integrate third-party APIs (payment, CRM, ERP, communication) seamlessly.',
    icon: 'Link',
    features: [
      'REST API design with OpenAPI/Swagger specs',
      'GraphQL schemas with federation support',
      'gRPC services with Protocol Buffers',
      'API gateway & rate limiting',
      'OAuth 2.0 / OIDC authentication',
      'Webhook systems with retry logic',
      'Third-party integrations (Stripe, Salesforce, HubSpot, etc.)',
      'API versioning & deprecation strategies',
      'Comprehensive testing (contract, load, chaos)',
      'Developer portal & documentation',
    ],
    techStack: ['Node.js', 'Go', 'GraphQL', 'gRPC', 'Kong', 'Postman', 'OpenAPI', 'Redis'],
    category: 'development',
    startingPrice: '$1,100+',
  },
  {
    id: 'ecommerce-solutions',
    title: 'E-commerce Solutions',
    shortDescription: 'High-converting online stores with custom features, headless architecture, and omnichannel support.',
    fullDescription: 'Build or migrate to a modern e-commerce platform that drives revenue. We work with Shopify Plus, custom headless solutions (Next.js + Commerce.js/Medusa), and marketplace integrations. Features include subscriptions, B2B workflows, internationalization, and advanced analytics.',
    icon: 'ShoppingCart',
    features: [
      'Headless commerce (Next.js + Medusa/Shopify Hydrogen)',
      'Shopify Plus development & customization',
      'Multi-vendor marketplace development',
      'Subscription & recurring billing',
      'B2B wholesale portals with custom pricing',
      'Multi-currency & multi-language support',
      'Advanced product configurators',
      'POS integration & omnichannel',
      'Conversion rate optimization',
      'Analytics & attribution tracking',
    ],
    techStack: ['Next.js', 'Medusa', 'Shopify', 'Stripe', 'Sanity', 'Algolia', 'Klaviyo'],
    category: 'development',
    startingPrice: '$2,000+',
    popular: true,
  },
  {
    id: 'software-consulting',
    title: 'Software Consulting & Architecture',
    shortDescription: 'Expert guidance on technology decisions, architecture reviews, and team augmentation.',
    fullDescription: 'Make confident technology decisions with expert guidance. We provide architecture reviews, technology selection, code audits, performance assessments, and strategic consulting. We also offer team augmentation with senior engineers who integrate seamlessly with your existing team.',
    icon: 'Lightbulb',
    features: [
      'Technical architecture reviews & design',
      'Technology stack evaluation & selection',
      'Code quality audits & security assessments',
      'Performance profiling & optimization',
      'Legacy system modernization strategies',
      'Technical due diligence for investments',
      'Team augmentation (senior/lead engineers)',
      'Engineering process improvement',
      'CTO-as-a-service for startups',
      'Workshops & knowledge transfer',
    ],
    techStack: ['Architecture', 'Code Review', 'Security', 'Performance', 'Process', 'Mentoring'],
    category: 'consulting',
    startingPrice: '$1,000+/week',
  },
  {
    id: 'blockchain-web3',
    title: 'Blockchain & Web3 Development',
    shortDescription: 'Smart contracts, dApps, and Web3 infrastructure for the decentralized future.',
    fullDescription: 'Build on the decentralized web. We develop secure smart contracts, decentralized applications (dApps), DeFi protocols, NFT platforms, and Web3 infrastructure. Security-first approach with comprehensive auditing, formal verification, and test coverage.',
    icon: 'Globe',
    features: [
      'Smart contract development (Solidity, Rust)',
      'DeFi protocol development (AMM, lending, staking)',
      'NFT marketplaces & dynamic NFTs',
      'DAO tooling & governance systems',
      'Web3 frontend (wagmi, viem, RainbowKit)',
      'Layer 2 solutions (Arbitrum, Optimism, Polygon)',
      'Smart contract auditing & formal verification',
      'Tokenomics design & implementation',
      'Cross-chain bridges & interoperability',
      'Indexing & analytics (The Graph, SubQuery)',
    ],
    techStack: ['Solidity', 'Rust', 'Foundry', 'Hardhat', 'wagmi', 'viem', 'The Graph', 'Ethers.js'],
    category: 'development',
    startingPrice: '$5,000+',
  },
];

export const serviceCategories = [
  { id: 'all', label: 'All Services', count: services.length },
  { id: 'development', label: 'Development', count: services.filter(s => s.category === 'development').length },
  { id: 'ai', label: 'AI & ML', count: services.filter(s => s.category === 'ai').length },
  { id: 'mobile', label: 'Mobile', count: services.filter(s => s.category === 'mobile').length },
  { id: 'cloud', label: 'Cloud & DevOps', count: services.filter(s => s.category === 'cloud').length },
  { id: 'consulting', label: 'Consulting', count: services.filter(s => s.category === 'consulting').length },
];

export function getServiceById(id: string): Service | undefined {
  return services.find(s => s.id === id);
}

export function searchServices(query: string): Service[] {
  const lowerQuery = query.toLowerCase();
  return services.filter(service =>
    service.title.toLowerCase().includes(lowerQuery) ||
    service.shortDescription.toLowerCase().includes(lowerQuery) ||
    service.features.some(f => f.toLowerCase().includes(lowerQuery)) ||
    service.techStack.some(t => t.toLowerCase().includes(lowerQuery)) ||
    service.category.toLowerCase().includes(lowerQuery)
  );
}

export function filterServicesByCategory(category: string): Service[] {
  if (category === 'all') return services;
  return services.filter(s => s.category === category);
}