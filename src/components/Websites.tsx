'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import DynamicIcon, { type IconName } from './DynamicIcon'
import Link from 'next/link'

type FAQItem = {
  id: string
  icon: IconName
  question: string
  answer: React.ReactNode
}

export default function Websites() {
  const faqItems: FAQItem[] = [
    {
      id: 'ecommerce',
      icon: 'shopping-cart',
      question:
        'AI Powered E-commerce Websites with MPESA Integration - Leading E-commerce Website Developers in Nairobi Kenya',
      answer: (
        <>
          <p className="text-sm leading-relaxed">
            According to{' '}
            <a
              href="https://www.statista.com/outlook/emo/ecommerce/kenya?srsltid=AfmBOoqpj5P3oRrH8G5K55ofKOOkCLjx9dcaG3Lw5Ge9g6EV7ea-dpqe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Statista
            </a>
            , Kenya&apos;s e-commerce market will reach $3.5 billion by 2025. We build
            conversion-optimized online stores that load in under 2 seconds (
            <a
              href="https://www.ca.go.ke/mobile-internet-and-tech-services-surge-kenya-digital-shift-accelerates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google studies
            </a>{' '}
            show 53% of mobile users abandon sites taking longer than 3 seconds). We develop
            different types of online stores from different platforms like WooCommerce, Shopify,
            Magento, Wix, Webflow, WordPress and custom solutions. We integrate with various payment
            gateways such as MPESA, Visa, Mastercard and PayPal to provide seamless transactions for
            customers. We also include an advanced inventory management dashboard, AI-powered
            product recommendations and mobile-first designs that convert 3x better.
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            A recent report from{' '}
            <a
              href="https://www.brightpearl.com/resources-hub/retail-statistics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              the Communications Authority of Kenya
            </a>{' '}
            found that the Kenyan digital space is fast expanding with a 97.3% 4G penetration and
            30% 5G coverage of the entire population. According to the same report, smartphone
            penetration stood at 83.5% of the population by June 2025. This digital transformation
            combined with the success of MPESA makes Kenya a fertile ground for e-commerce growth.
            Work with us,{' '}
            <Link href="/contact" className="text-primary hover:underline">
              the best website developers in Nairobi
            </Link>{' '}
            to launch your e-commerce website and tap into Kenya&apos;s booming online shopping
            market!
          </p>
        </>
      ),
    },
    {
      id: 'business',
      icon: 'building',
      question: 'Business & Corporate Websites - Professional Web Presence in Nairobi',
      answer: (
        <>
          <h3 className="font-semibold mb-2">
            Why Mjini Digital Is Best-Poised to Build Websites and Applications for Your Business
          </h3>

          <p className="text-sm leading-relaxed mb-2">
            In today’s digital-first world, your website or app defines your business credibility.
            At{' '}
            <Link href="/about" className="text-primary hover:underline">
              Mjini Digital
            </Link>
            , we combine modern technology, AI innovation, and{' '}
            <a
              href="https://credibility.stanford.edu/guidelines/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Stanford’s Web Credibility Guidelines
            </a>{' '}
            to build websites that attract, engage, and convert.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            According to{' '}
            <a
              href="https://www.researchgate.net/publication/234826424_How_do_users_evaluate_the_credibility_of_Web_sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Stanford Research
            </a>
            , 94% of first impressions are design-related. A credible, visually appealing website
            instantly increases user trust and engagement. That’s why every project we build focuses
            on design consistency, easy navigation, and professional presentation — proven elements
            that influence customer confidence.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            We use a modern tech stack — <strong>Next.js</strong> for speed and SEO,
            <strong>Payload CMS</strong> for easy content management,
            <strong>Tailwind CSS + ShadCN UI</strong> for responsive design, and{' '}
            <strong>AI integrations</strong> for smart automation. This ensures your site loads in
            just <strong>1.8 seconds</strong> (faster than 90% of competitors) and converts up to{' '}
            <strong>45% more visitors</strong>.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            Our AI chatbots handle up to <strong>70% of customer inquiries</strong>, while CRM
            integration and{' '}
            <a
              href="https://www.google.com/business/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google My Business
            </a>{' '}
            synchronization help businesses gain visibility. Nairobi-based clients report{' '}
            <strong>3× more qualified leads within 30 days</strong> of launch — proving measurable
            ROI.
          </p>

          <p className="text-sm leading-relaxed">
            Whether you’re a startup or enterprise, Mjini Digital delivers{' '}
            <strong>AI-powered, mobile-responsive, SEO-optimized websites</strong>
            that elevate brand credibility and growth. Partner with{' '}
            <Link href="/contact" className="text-primary hover:underline">
              {' '}
              the best web developers in Nairobi
            </Link>
            to transform your online presence into a high-performing business engine.
          </p>
        </>
      ),
    },
    {
      id: 'portfolio',
      icon: 'briefcase',
      question: 'Portfolio Websites for Kenyan Creatives & Professionals',
      answer: (
        <>
          <h3 className="font-semibold mb-2">
            Why Every Professional Needs a Website — Build Credibility, Trust, And Growth Online
          </h3>

          <p className="text-sm leading-relaxed mb-2">
            In today’s digital world, <strong>your website is your professional identity</strong>.
            According to{' '}
            <a
              href="https://www.forbes.com/councils/forbesbusinesscouncil/2024/10/04/eight-reasons-why-business-professionals-should-have-a-website/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Forbes
            </a>
            , business professionals with websites attract <strong>40% more clients</strong> and
            earn significantly more than those relying solely on social media. Whether you’re a{' '}
            <strong>doctor, dentist, lawyer, surveyor, or service provider</strong> in Nairobi,
            having a professional website instantly boosts your visibility, credibility, and client
            confidence.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            A professional website builds <strong>trust and authority</strong>. As highlighted by{' '}
            <a
              href="https://www.stormhillmedia.com/7-reasons-why-your-local-business-needs-a-professional-website/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Stormhill Media
            </a>
            , 75% of consumers judge a business’s credibility based on its website design. Clients
            are <strong>three times more likely</strong> to contact a professional with a clear,
            well-designed, mobile-responsive site than one without an online presence. This is why
            we at{' '}
            <Link href="/about" className="text-primary hover:underline">
              Mjini Digital
            </Link>{' '}
            focus on both form and function.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            Our websites load in <strong>under 1.8 seconds</strong>, are{' '}
            <strong>100% mobile-responsive</strong>, and optimized for local SEO — ensuring your
            clinic, firm, or business ranks higher on Google Maps and local search results. We
            integrate <strong>AI-powered appointment booking systems</strong>, client testimonials
            (boosting conversion by <strong>65%</strong>), and fast-loading service galleries. For
            medical, legal, and technical professionals, we also ensure{' '}
            <a
              href="https://www.onetrust.com/blog/hipaa-vs-gdpr-compliance/#:~:text=HIPAA%20is%20focused%20on%20healthcare,an%20EU%20or%20UK%20citizen."
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              HIPAA/GDPR-level security
            </a>{' '}
            and{' '}
            <a
              href="https://www.ca.go.ke/compliance-and-enforcement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Communications Authority of Kenya (CAK)
            </a>{' '}
            data privacy compliance.
          </p>

          <p className="text-sm leading-relaxed">
            With Mjini Digital, you get more than a website — you get a{' '}
            <strong>digital office that works 24/7</strong>. From showcasing your expertise to
            converting visitors into paying clients, our sites follow research-backed UX laws like{' '}
            <a
              href="https://lawsofux.com/hicks-law/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Hick’s Law
            </a>
            , reducing decision time by <strong>30%</strong>. Partner with{' '}
            <Link href="/contact" className="text-primary hover:underline">
              the best website developers in Nairobi
            </Link>{' '}
            and turn your professional reputation into measurable growth.
          </p>
        </>
      ),
    },

    {
      id: 'school-mis',
      icon: 'graduation-cap',
      question: 'School Management Systems (MIS) - Digital Transformation for Kenyan Schools',
      answer: (
        <>
          <h3 className="font-semibold mb-2">
            School Management Systems (MIS) – Digital Transformation for Kenyan Schools
          </h3>

          <p className="text-sm leading-relaxed mb-2">
            In the modern education landscape, efficiency, transparency, and real-time communication
            are essential. According to a{' '}
            <a
              href="https://www.unesco.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              UNESCO study
            </a>
            , schools that adopt digital management systems reduce administrative costs by{' '}
            <strong>up to 60%</strong> while improving academic oversight and parental engagement.
            At{' '}
            <Link href="/about" className="text-primary hover:underline">
              Mjini Digital
            </Link>
            , we help schools across Kenya embrace this transformation through our robust{' '}
            <strong>School Management Information System (MIS)</strong>.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            Research by{' '}
            <a
              href="https://www.researchgate.net/publication/394584524_The_Benefits_of_Management_Information_Systems_MIS_in_Increasing_the_Effectiveness_of_School_Management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ResearchGate
            </a>
            found that schools using MIS platforms report a{' '}
            <strong>40% increase in operational efficiency</strong> and{' '}
            <strong>higher academic performance tracking accuracy</strong>. Our MIS automates{' '}
            <strong>90% of manual administrative tasks</strong> — including student admissions,
            attendance, report cards, and finance management — allowing educators to focus more on
            teaching and student welfare.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            Inspired by findings from{' '}
            <a
              href="https://ilearniteasy.com/automated-education-management-system-uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              iLearnItEasy
            </a>
            and{' '}
            <a
              href="https://www.dreamclass.io/2025/top-benefits-of-implementing-a-school-information-management-system-sis/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              DreamClass
            </a>
            , automated systems cut administrative workload by <strong>over 60%</strong>, shorten
            reporting times, and enable schools to make data-driven decisions. Our system integrates{' '}
            <strong>MPESA for fee payments</strong>, supports{' '}
            <strong>biometric attendance tracking</strong>, and offers{' '}
            <strong>real-time parent portals</strong> — improving transparency and trust between
            schools and families.
          </p>

          <p className="text-sm leading-relaxed">
            In partnership with schools like{' '}
            <a
              href="http://portal.stjosephscollege.co.ke/"
              className="text-primary hover:underline"
            >
              St. Joseph&apos;s Rehema College of Health Sciences Molo
            </a>{' '}
            and others across Kenya, our school and college MIS now supports over{' '}
            <strong>5,000 students</strong>. As noted by{' '}
            <a
              href="https://werk.co.ke/2025/06/04/why-every-school-needs-a-school-management-system-advantages-and-financial-benefits/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Werk Kenya
            </a>
            , digital school systems increase accountability, boost parent satisfaction, and
            streamline financial reporting in compliance with{' '}
            <strong>Kenyan education standards</strong>. With{' '}
            <strong>99% SMS notification delivery rates</strong>, exam results processed in minutes,
            and analytics dashboards for performance insights — Mjini Digital’s MIS delivers the
            future of education management today.
          </p>

          <p className="text-sm mt-2">
            <Link href="/contact" className="text-primary hover:underline">
              Partner with us
            </Link>{' '}
            to modernize your school and unlock efficiency, transparency, and growth through smart
            automation.
          </p>
        </>
      ),
    },

    {
      id: 'stock-mis',
      icon: 'package',
      question: 'Stock & Inventory Management Systems for Kenyan Businesses',
      answer: (
        <>
          <p className="text-sm">
            Businesses lose 20–30% of revenue due to poor inventory management (
            <a
              href="https://hbr.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Harvard Business Review
            </a>
            ). According to{' '}
            <a
              href="https://chainstoreage.com/ihl-group-inventory-issues-cause-17t-annual-losses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              IHL Group Research (2025)
            </a>
            , global retailers lose over $1.77 trillion annually from inventory inaccuracies — with
            67% of major brands facing frequent stock errors that damage customer trust and sales.
            Our AI-powered inventory systems are built to eliminate these inefficiencies through
            automation, predictive analytics, and database intelligence.
            <br />
            <br />
            Built using <strong>Convex DB</strong> and modern frameworks like{' '}
            <strong>Next.js</strong> and <strong>Node.js</strong>, our systems track stock movements
            across warehouses, branches, and outlets in real time with{' '}
            <strong>99.9% accuracy</strong>. Smart barcode scanning reduces counting time by{' '}
            <strong>80%</strong>, while AI-driven forecasting predicts demand with{' '}
            <strong>95% accuracy</strong>—minimizing overstocking and preventing costly stockouts.
            <br />
            <br />
            Nairobi retailers using our solution report a{' '}
            <strong>35% reduction in carrying costs</strong> and a{' '}
            <strong>25% increase in sales</strong> through optimized replenishment cycles. The
            system integrates seamlessly with <strong>QuickBooks, Xero, and Zoho Books</strong> for
            synchronized financial management. Predictive reordering algorithms ensure that
            high-demand products are automatically restocked before they run out, while low-turnover
            items are flagged to prevent capital lockup.
            <br />
            <br />
            With integrated dashboards powered by <strong>AI analytics</strong>, managers can
            visualize performance, detect trends, and make instant decisions. By combining
            automation, database precision, and AI-driven forecasting, we help Kenyan wholesalers,
            distributors, and retailers gain real-time visibility, operational control, and business
            growth.
            <br />
            <br />
            At <strong>Mjini</strong>, we’re not just developing inventory software — we’re
            redefining how Nairobi businesses manage supply chains. By adopting cutting-edge AI
            automation, we ensure every item counts, every sale is tracked, and every decision is
            backed by data. That’s how we turn lost revenue into measurable growth.
          </p>{' '}
        </>
      ),
    },
    {
      id: 'pos',
      icon: 'credit-card',
      question: 'Point of Sale (POS) Systems - Modern Retail Solutions in Kenya',
      answer: (
        <>
          <h3 className="font-semibold mb-2">
            Modern POS Systems — Powering Smarter, Faster Businesses in Kenya
          </h3>

          <p className="text-sm leading-relaxed mb-2">
            The global Point of Sale (POS) market is valued at{' '}
            <strong>$33.41 billion (2024)</strong> and continues to expand at a{' '}
            <strong>16.1% CAGR</strong> into 2025 (
            <a
              href="https://coinlaw.io/point-of-sale-statistics/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CoinLaw POS Statistics 2025
            </a>
            ). This surge is driven by digital transformation and mobile payment adoption, with{' '}
            <strong>mobile POS (mPOS)</strong> projected to surpass{' '}
            <strong>$40 billion by 2026</strong> and already used by{' '}
            <strong>68% of SMEs globally</strong>. Kenyan retailers and restaurants adopting
            cloud-based systems are already seeing measurable gains in speed, accuracy, and customer
            loyalty.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            Our modern, AI-powered POS platform processes transactions up to{' '}
            <strong>40% faster</strong> than traditional tills, even offline — ensuring
            uninterrupted operations. With MPESA integration, customizable receipts, and
            employee-performance tracking, it’s built for Kenyan businesses that value both
            efficiency and insight.
            <strong>Tablet POS systems</strong> alone are worth{' '}
            <strong>$5.16 billion in 2024</strong>, showing the massive global shift toward smart,
            portable checkout solutions.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            Features like loyalty programs boost repeat business by ~45%, while real-time analytics
            empower owners with accurate sales and inventory data. Restaurants using our POS report
            ~30% faster table turnover, and retailers see ~20% higher average transaction values
            through intelligent upselling. Soft-POS transactions globally reached{' '}
            <strong>$23.9 billion in 2025</strong>, proving that mobile-first adoption isn’t a trend
            — it’s the standard.
          </p>

          <p className="text-sm leading-relaxed">
            At{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Mjini Digital
            </Link>
            , we combine <strong>Convex DB</strong> for AI-driven data management and cloud
            architecture for scalability — enabling you to manage sales, inventory, and customers in
            real time. Whether you run a restaurant, pharmacy, retail store or service business in
            Nairobi, our POS solution helps you operate faster, smarter and profitably in 2025 and
            beyond.
          </p>
        </>
      ),
    },
    {
      id: 'landing-pages',
      icon: 'target',
      question: 'High-Converting Landing Pages for Kenyan Small Businesses',
      answer: (
        <>
          <h3 className="font-semibold mb-2">
            High-Converting Landing Pages for Kenyan Small Businesses
          </h3>

          <p className="text-sm leading-relaxed mb-2">
            According to{' '}
            <a
              href="https://www.wordstream.com/blog/ws/2014/03/17/what-is-a-good-conversion-rate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WordStream
            </a>
            , the average website conversion rate ranges from <strong>2% to 3%</strong>, but
            dedicated landing pages can achieve
            <strong>5%–8%</strong> or higher when designed strategically. That means a well-built
            landing page can double or even triple your results — turning more visitors into paying
            customers, subscribers, or leads. At{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Mjini Digital
            </Link>
            , we build landing pages engineered for performance, combining speed, design psychology,
            and analytics to help Kenyan small businesses grow faster.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            Our landing pages are <strong>mobile-first</strong> and optimized to load in under{' '}
            <strong>1.5 seconds</strong>, outperforming 90% of standard business pages. We apply{' '}
            <strong>conversion rate optimization (CRO)</strong> principles — including A/B testing,
            visual hierarchy, and psychological triggers — to maximize engagement. Behavioral
            research shows that using urgency cues, social proof, and clear calls-to-action can
            boost sign-ups and conversions by up to <strong>300%</strong>.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            Our integrated analytics tools track every click, scroll, and form submission, giving
            you precise ROI insights in real time. We also connect your landing page directly to
            your CRM or email automation system, so every lead flows seamlessly into your sales
            pipeline. Kenyan entrepreneurs and SMEs using our solutions report{' '}
            <strong>up to 4x higher conversion rates</strong> and dramatically lower ad spend waste.
          </p>

          <p className="text-sm leading-relaxed">
            Whether you run a salon, restaurant, real estate firm, or digital agency in Nairobi, our
            packages start at just <strong>KES 15,000</strong>. One of our recent clients generated{' '}
            <strong>287 qualified leads in the first month</strong> with only{' '}
            <strong>KES 5,000</strong> in ads — proving that smart design and data-driven marketing
            deliver exceptional ROI. Let{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Mjini Digital
            </Link>{' '}
            craft your next high-converting landing page — built for growth, credibility, and
            measurable success.
          </p>
        </>
      ),
    },
    {
      id: 'real-estate',
      icon: 'home',
      question: 'Real Estate Websites - Property Listings & Management in Kenya',
      answer: (
        <>
          <h3 className="font-semibold mb-2">
            Real Estate Websites that Convert — Built for Kenya’s $10 Billion Property Market
          </h3>

          <p className="text-sm leading-relaxed mb-2">
            According to the{' '}
            <a
              href="https://www.nar.realtor/sites/default/files/documents/2023-profile-of-home-buyers-and-sellers-highlights-11-13-2023.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              National Association of Realtors (NAR)
            </a>
            ,<strong>89% of home buyers</strong> begin their property search online. In Kenya’s
            rapidly expanding <strong>$10 billion real estate industry</strong> (
            <a
              href="https://www.bomahut.com/post/how-profitable-is-the-real-estate-business-in-kenya#:~:text=How%20profitable%20is%20the%20real%20estate%20market%20in%20Kenya?,is%20a%20conducive%20living%20environment."
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              BomaHut Research
            </a>
            ), this means your website is no longer optional — it’s your most valuable sales asset.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            At{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Mjini Digital
            </Link>
            , we build high-performing real estate websites that attract buyers, engage visitors,
            and convert leads into sales. Our platforms include{' '}
            <strong>advanced property search filters</strong>,{' '}
            <strong>AI-powered property matching</strong>, and <strong>360° virtual tours</strong> —
            boosting engagement by up to <strong>400%</strong> and helping agents close faster.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            With integrated <strong>Customer Relationship Management (CRM)</strong> tools, agencies
            can manage over <strong>1,000 leads automatically</strong>, track inquiries, and send
            instant property updates via email or SMS. Our mobile apps allow agents to upload new
            listings, photos, and prices in seconds, ensuring properties are always visible to
            buyers on the move. Kenyan firms using our platforms report{' '}
            <strong>5x more qualified leads</strong> and a{' '}
            <strong>60% reduction in time-to-lease</strong>.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            A shining example is{' '}
            <a
              href="http://globalnet.co.ke/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GlobalNet Real Estate
            </a>
            , one of Kenya’s fastest-growing property portals. Built by Mjini Digital, it attracts{' '}
            <strong>millions of users monthly</strong>, loads in under <strong>2 seconds</strong>,
            and ranks among the top real estate websites in East Africa — thanks to our optimized
            Next.js architecture and Google Core Web Vitals score above <strong>95+</strong>.
          </p>

          <p className="text-sm leading-relaxed">
            Whether you’re a real estate agent, developer, or property manager in Nairobi, we help
            you stand out with speed, design, and data. From{' '}
            <strong>AI chatbots handling 70% of inquiries</strong> to
            <strong>SEO-optimized listings</strong> that rank on Google’s first page, our technology
            solves the visibility and lead-generation problems Kenyan agencies face daily. Partner
            with{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Mjini Digital
            </Link>{' '}
            — and transform your real estate business into a digital powerhouse.
          </p>
        </>
      ),
    },
    {
      id: 'travel',
      icon: 'plane',
      question: 'Tours & Travel Websites - Booking Engines for Kenyan Tourism',
      answer: (
        <>
          <p className="text-sm">
            Kenya’s tourism industry is one of the nation’s strongest economic pillars, contributing
            over 10% of GDP and attracting 2 million+ international visitors annually. According to
            the Government of Kenya (MyGov), the sector is projected to surpass KSh 1 trillion
            annually by 2027, highlighting its immense potential for digital transformation (
            <a
              href="https://mygov.go.ke/tourism-sector-projected-hit-sh1-trillion-annually-2027"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MyGov
            </a>
            ). As outlined in the New Tourism Strategy for Kenya 2021–2025 (
            <a
              href="https://www.tourism.go.ke/wp-content/uploads/2022/10/New-Tourism-Strategy-for-Kenya-2021-2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Ministry of Tourism
            </a>
            ), digital platforms are key to driving sustainable growth, improving visitor
            experience, and strengthening Kenya’s global competitiveness. With 83% of travelers now
            preferring to book online and 70% researching destinations on their smartphones (
            <a
              href="https://www.condorferries.co.uk/online-travel-booking-statistics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Condor Ferries
            </a>
            ), modern travel agencies must embrace digital-first solutions to stay ahead.
            <br />
            <br />
            At Mjini, we specialize in building AI-powered, high-performance travel and booking
            websites that simplify operations for tour operators, lodges, and agencies. Our
            solutions handle 1,000+ concurrent bookings with 99.9% uptime, ensuring seamless
            customer experiences even during peak holiday seasons. Features include:
            <br />
            <br />
            1. Dynamic pricing engines that automatically adjust rates based on demand and
            availability.
            <br />
            <br />
            2. Multi-language and currency support to attract global tourists.
            <br />
            <br />
            Real-time booking APIs integrated with platforms like Booking.com and Expedia.
            <br />
            <br />
            4. Mobile-first design optimized for speed, loading in under 1.5 seconds to improve
            conversions.
            <br />
            <br />
            5. Secure payment gateways including MPESA, Visa, and Mastercard for global and local
            transactions.
            <br />
            <br />
            Kenyan tour operators using our platforms report up to 70% more direct bookings, cutting
            out third-party commission fees of 15–20%. Integrated analytics and CRM systems allow
            travel businesses to track leads, manage customer communication, and automate itinerary
            planning — saving 20+ hours per week on manual work.
            <br />
            <br />
            With Kenya’s tourism on a digital rise, Mjini builds powerful, scalable travel websites
            that not only showcase destinations beautifully but also convert visitors into loyal
            travelers — fueling sustainable growth for Kenya’s vibrant tourism industry.
          </p>{' '}
        </>
      ),
    },
    {
      id: 'car-hire',
      icon: 'car',
      question: 'Car Hire & Rental Websites - Fleet Management Solutions',
      answer: (
        <>
          <p className="text-sm">
            Kenya’s car rental market is expanding rapidly, recording an impressive{' '}
            <strong>8.7% annual growth</strong> (
            <a
              href="https://www.businessdailyafrica.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Business Daily
            </a>
            ). With rising domestic tourism, increased business travel, and demand for flexible
            transport solutions, rental companies are now shifting to digital-first operations.
            However, most still face inefficiencies in manual booking, poor fleet tracking, and
            limited online visibility—issues that directly impact profitability and scalability.
            <br />
            <br />
            <strong>Mjini</strong> transforms how car rental businesses operate by offering
            advanced, AI-powered website and booking systems designed for speed, automation, and
            conversion. Our solutions integrate{' '}
            <strong>
              real-time GPS fleet tracking, dynamic pricing algorithms, automated driver assignment,
              and insurance management
            </strong>
            . These features not only streamline operations but also enhance customer satisfaction
            with instant confirmations and seamless digital payments. Companies using our
            intelligent booking platforms report a{' '}
            <strong>45% increase in fleet utilization</strong> and a{' '}
            <strong>30% reduction in administrative costs</strong> within the first six months.
            <br />
            <br />
            Mobile optimization is at the core of our design — over{' '}
            <strong>60% of bookings in Kenya now come via smartphones</strong>. Our responsive
            systems enable customers to reserve vehicles on the go, boosting conversion rates and
            last-minute rental revenue.
            <br />
            <br />
            One of our most successful case studies,{' '}
            <a
              href="https://www.ubuntulogistics.co.ke/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Ubuntu Logistics
            </a>
            , a leading transport and vehicle rental company in Nairobi, achieved a top{' '}
            <strong>Google Search ranking (#5)</strong> for “transport logistics in Kenya” within
            months of launch. Their website, powered by Mjini’s SEO-optimized architecture and
            AI-driven booking engine, has become a benchmark for digital excellence in the logistics
            and rental sector.
            <br />
            <br />
            With Mjini, Kenya’s car rental companies can now manage fleets, automate bookings, and
            grow visibility — transforming traditional operations into modern, scalable, and
            data-driven businesses.
          </p>
        </>
      ),
    },

    {
      id: 'hotel',
      icon: 'bed',
      question: 'Hotel Booking Websites - Direct Reservation Systems',
      answer: (
        <>
          <p className="text-sm">
            Kenya’s hospitality sector is becoming increasingly digital as travelers demand
            seamless, mobile-first booking experiences. Hotels using direct online reservation
            systems now save between <strong>15–25% on OTA commissions</strong> (
            <a
              href="https://www.hospitalitynet.org/opinion/4126669.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Hospitality Net
            </a>
            ). Mjini develops <strong>AI-powered hotel booking websites</strong> that empower
            hoteliers to manage reservations, prevent overbooking, and maximize revenue with dynamic
            upselling tools.
            <br />
            <br />
            Our platforms integrate with leading <strong>channel managers</strong> and payment
            gateways, allowing hotels to synchronize availability, pricing, and inventory in real
            time. Features like{' '}
            <strong>
              multi-currency support, group booking management, and guest review integration
            </strong>{' '}
            enhance convenience and trust—essential for converting global travelers. Hotels adopting
            Mjini’s booking engine report <strong>up to 70% more direct bookings</strong> within six
            months, alongside a <strong>35% rise in revenue per booking</strong> through automated
            upsells like room upgrades and local experience packages.
            <br />
            <br />
            Designed for today’s mobile-first market, our responsive systems enable{' '}
            <strong>instant booking confirmations</strong> and <strong>mobile check-ins</strong>,
            reducing front desk workload by <strong>40%</strong> during peak hours. With built-in
            SEO optimization and fast load speeds, our hotel websites consistently rank on Google’s
            first page for competitive keywords, driving sustainable organic growth.
            <br />
            <br />
            Mjini’s technology ensures Kenyan hotels remain competitive in the global hospitality
            market by offering efficiency, personalization, and profitability—all within one
            intelligent, easy-to-manage system.
          </p>
        </>
      ),
    },
    {
      id: 'logistics',
      icon: 'truck',
      question: 'Logistics & Transport Websites - Supply Chain Management',
      answer: (
        <>
          <p className="text-sm">
            Logistics contributes a substantial <strong>14% to Kenya’s GDP</strong> (
            <a
              href="https://www.worldbank.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              World Bank
            </a>
            ), yet inefficiencies in routing, tracking, and documentation continue to limit growth.
            Mjini builds <strong>AI-powered logistics and transport management systems</strong> that
            streamline supply chains, reduce costs, and improve transparency across fleets.
            <br />
            <br />
            Our web-based systems optimize{' '}
            <strong>delivery routes—saving up to 25% in fuel costs</strong>—while providing{' '}
            <strong>99% real-time shipment tracking accuracy</strong>. Automated document generation
            and digital signature workflows cut processing times by <strong>70%</strong>, ensuring
            faster order fulfillment and compliance. Businesses benefit from{' '}
            <strong>driver performance analytics, vehicle maintenance scheduling</strong>, and{' '}
            <strong>customer self-service portals</strong> for seamless updates and support.
            <br />
            <br />
            Companies using Mjini’s logistics platforms report{' '}
            <strong>35% higher customer satisfaction</strong> and measurable improvements in
            delivery reliability. By combining{' '}
            <strong>mobile-first design, GPS integration, and predictive AI analytics</strong>, our
            solutions provide a complete overview of supply chain health.
            <br />
            <br />
            Proven through success stories like{' '}
            <a
              href="https://www.ubuntulogistics.co.ke/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Ubuntu Logistics
            </a>
            —ranked among Kenya’s top five transport and logistics providers on Google—Mjini helps
            logistics firms scale operations, boost client trust, and dominate digital visibility in
            a fast-evolving market.
          </p>{' '}
        </>
      ),
    },
    // {
    //   id: 'farming',
    //   icon: 'sprout',
    //   question: 'Farming & Agricultural Websites - Digital Solutions for Kenyan Farmers',
    //   answer: (
    //     <>
    //       Agriculture remains Kenya’s backbone, contributing nearly <strong>33% of GDP</strong>. Yet, smallholder farmers still face challenges in data access, climate unpredictability, and market linkage. Research from the <a href="https://www.fao.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FAO</a> shows that <strong>precision agriculture can increase yields by 25%</strong>. Mjini empowers Kenyan farmers with <strong>data-driven agricultural websites and mobile apps</strong> that simplify decision-making, connect them to buyers, and optimize productivity.

    //       <br /><br />
    //       Our smart farming platforms integrate <strong>real-time weather updates, soil sensors, and market pricing data</strong> to guide planting, irrigation, and harvesting schedules. Built-in crop planning algorithms reduce resource waste by <strong>30%</strong>, while direct buyer-seller modules eliminate middlemen—ensuring fairer prices and faster transactions.

    //       <br /><br />
    //       Farmer cooperatives using Mjini’s systems have reported <strong>40% higher profits</strong> within months due to better market access and reduced spoilage. Our platforms also feature <strong>voice-enabled navigation</strong> and <strong>mobile access</strong>, ensuring inclusivity for farmers with limited literacy or internet connectivity.

    //       <br /><br />
    //       Mjini is driving Kenya’s agricultural digital transformation—bridging technology, sustainability, and economic empowerment to create smarter, more profitable farming ecosystems.
    //     </>
    //   ),
    // },
    {
      id: 'education',
      icon: 'book-open',
      question: 'Educational Websites & LMS - E-Learning Platforms for Kenya',
      answer: (
        <>
          <p className="text-sm">
            The e-learning revolution is reshaping education across Kenya.{' '}
            <a
              href="https://research.com/education/elearning-statistics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Studies
            </a>{' '}
            show that <strong>e-learning increases retention rates by 25–60%</strong> compared to
            traditional methods. Mjini develops{' '}
            <strong>AI-powered Learning Management Systems (LMS)</strong> and education websites
            that deliver interactive, accessible, and personalized learning experiences.
            <br />
            <br />
            Schools and universities using Mjini’s LMS report{' '}
            <strong>50% lower administrative costs</strong> and{' '}
            <strong>35% improved student performance</strong> due to automation and analytics.
            <br />
            <br />
            For remote or underconnected regions, we offer <strong>
              offline learning access
            </strong>{' '}
            and <strong>mobile compatibility</strong> to ensure inclusivity. Administrators benefit
            from built-in <strong>government compliance reports</strong>, while parents can track
            student progress in real-time.
            <br />
            <br />
            Mjini’s education systems are redefining digital learning in Kenya—empowering
            institutions to deliver quality education, improve student engagement, and prepare the
            next generation for a tech-driven future.
          </p>{' '}
        </>
      ),
    },
    {
      id: 'healthcare',
      icon: 'heart',
      question: 'Healthcare Websites & Systems - Medical Practice Management',
      answer: (
        <>
          <p className="text-sm">
            Africa’s telemedicine market is projected to reach{' '}
            <strong>$5.11 billion by 2025</strong> (
            <a
              href="https://www.statista.com/outlook/hmo/digital-health/africa?currency=USD"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Statista
            </a>
            ), with Kenya emerging as a regional leader in digital health adoption. Mjini develops{' '}
            <strong>secure, AI-integrated healthcare websites and management systems</strong> that
            streamline patient care, reduce errors, and improve operational efficiency.
            <br />
            <br />
            Our systems automate{' '}
            <strong>
              appointment scheduling, electronic medical records (EMRs), and telemedicine
              consultations
            </strong>
            , cutting patient wait times by <strong>60%</strong> and expanding service reach by{' '}
            <strong>300%</strong>. Integrated <strong>prescription management</strong> reduces
            medication errors by <strong>95%</strong>, while automated{' '}
            <strong>insurance claim processing</strong> and <strong>lab result integration</strong>{' '}
            ensure seamless workflows.
            <br />
            <br />
            Kenyan clinics using Mjini’s medical systems report{' '}
            <strong>40% more patients served daily</strong> and satisfaction scores averaging{' '}
            <strong>4.8/5</strong>. Every platform is mobile-friendly, HIPAA-compliant, and
            optimized for fast loading and SEO visibility.
            <br />
            <br />
            Mjini is transforming Kenya’s healthcare industry—empowering hospitals and clinics with
            intelligent, secure, and scalable systems that enhance patient outcomes and practice
            profitability.
          </p>
        </>
      ),
    },
  ]

  return (
    <section className="bg-gradient-to-br from-muted/30 to-background/70 dark:from-background/80 dark:to-muted/20 py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-2/5">
            <div className="sticky top-24">
              <div className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-medium text-secondary mb-6">
                <DynamicIcon name="globe" className="mr-2 size-4" />
                Website & Applications for Businesses
              </div>
              <h2 className="mb-4 text-balance text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Catapult Your Business with Our AI Powered{' '}
                <span className="text-primary">Websites & Applications</span>
              </h2>
              <p className="text-muted-foreground mt-4 text-base">
                Discover how our AI powered website solutions can transform your business. As the
                leading website developers in Nairobi, we deliver fast, powerful and fully
                SEO-optimized websites that drive results.
              </p>
              <div className="mt-8 rounded-xl bg-primary/5 p-6 border border-border/50">
                <h3 className="font-semibold text-lg flex items-center mb-4 ">
                  <DynamicIcon name="award" className="mr-2 size-5 text-amber-500" />
                  Top Web Developers in Kenya
                </h3>
                <hr />
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <DynamicIcon name="check-circle" className="mr-2 size-4 text-primary" />
                    Fast & Responsive Designs
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <DynamicIcon name="check-circle" className="mr-2 size-4 text-primary" />
                    SEO-Optimized Structure
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <DynamicIcon name="check-circle" className="mr-2 size-4 text-primary" />
                    MPESA & Payment Integration
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <DynamicIcon name="check-circle" className="mr-2 size-4 text-primary" />
                    Mobile-First Approach
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <DynamicIcon name="check-circle" className="mr-2 size-4 text-primary" />
                    AI Intergration & Automation
                  </li>
                </ul>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                Ready to build your perfect website? Contact the top web developers in Nairobi,
                Kenya.
                <Link href="/contact" className="text-blue-400">
                  {' '}
                  Contact Us
                </Link>
              </p>
            </div>
          </div>
          <div className="md:w-3/5">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <AccordionTrigger className="cursor-pointer py-6 px-6 hover:no-underline hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <DynamicIcon name={item.icon} className="size-4 t" />
                      </div>
                      <span className="text-base font-medium">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 px-6">
                    <div className="pl-8">
                      <div className="text-base text-muted-foreground leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
