import { NextRequest, NextResponse } from "next/server";

export interface OpportunityItem {
  id: string;
  title: string;
  organization: string;
  category: "hackathon" | "fellowship" | "internship" | "scholarship";
  mode: "Remote / Online" | "Onsite" | "Hybrid";
  eligibility: string;
  deadline: string;
  stipendOrPrize: string;
  description: string;
  applyUrl: string;
  tags: string[];
  isVerified: boolean;
  status: "Open Now" | "Upcoming" | "Rolling";
}

const VERIFIED_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: "opp-sih",
    title: "Smart India Hackathon (SIH 2026)",
    organization: "Ministry of Education & AICTE",
    category: "hackathon",
    mode: "Hybrid",
    eligibility: "Undergraduate & Graduate University Students",
    deadline: "Annual Rolling Cycle",
    stipendOrPrize: "₹1,00,000 per problem statement prize",
    description: "World's biggest open innovation model for students to provide digital solutions to pressing challenges faced by Indian Ministries and industries.",
    applyUrl: "https://www.sih.gov.in/",
    tags: ["SIH", "Government", "National Level", "Innovation"],
    isVerified: true,
    status: "Open Now",
  },
  {
    id: "opp-gsoc",
    title: "Google Summer of Code (GSoC)",
    organization: "Google Open Source",
    category: "fellowship",
    mode: "Remote / Online",
    eligibility: "Students & Open Source Beginners (18+)",
    deadline: "Spring Annual Cycle",
    stipendOrPrize: "$1,500 - $3,300 Stipend based on location",
    description: "Work with open source organizations on 12-to-22 week programming projects under direct guidance of veteran engineers.",
    applyUrl: "https://summerofcode.withgoogle.com/",
    tags: ["Google", "Open Source", "Stipend", "Global Mentorship"],
    isVerified: true,
    status: "Upcoming",
  },
  {
    id: "opp-mlh-fellowship",
    title: "Major League Hacking (MLH) Fellowship",
    organization: "Major League Hacking & GitHub",
    category: "fellowship",
    mode: "Remote / Online",
    eligibility: "All active students & early developers worldwide",
    deadline: "Rolling Batches (Spring, Summer, Fall)",
    stipendOrPrize: "Educational Stipend provided",
    description: "12-week internship alternative where fellows collaborate on real production repositories utilized by millions of developers.",
    applyUrl: "https://fellowship.mlh.io/",
    tags: ["MLH", "Fellowship", "Open Source", "Remote"],
    isVerified: true,
    status: "Open Now",
  },
  {
    id: "opp-devpost-hackathons",
    title: "Devpost Global Student Hackathons",
    organization: "Devpost Platform",
    category: "hackathon",
    mode: "Remote / Online",
    eligibility: "Open to student developers globally",
    deadline: "Multiple Weekly Deadlines",
    stipendOrPrize: "Over $500,000+ in active cash prizes",
    description: "Browse dozens of active virtual hackathons hosted by AWS, Google Cloud, Solana, OpenAI, and premier global universities.",
    applyUrl: "https://devpost.com/hackathons",
    tags: ["Hackathons", "Cash Prizes", "Virtual", "Portfolio"],
    isVerified: true,
    status: "Open Now",
  },
  {
    id: "opp-lfx-mentorship",
    title: "Linux Foundation LFX Mentorship",
    organization: "Linux Foundation",
    category: "fellowship",
    mode: "Remote / Online",
    eligibility: "Students & developers entering open source",
    deadline: "Spring / Summer / Fall Terms",
    stipendOrPrize: "Competitive term stipend",
    description: "Hands-on paid mentorships directly on core cloud native projects including Kubernetes, Prometheus, Linux Kernel, and Envoy.",
    applyUrl: "https://lfx.linuxfoundation.org/tools/mentorship/",
    tags: ["Cloud Native", "Kubernetes", "Linux", "Stipend"],
    isVerified: true,
    status: "Open Now",
  },
  {
    id: "opp-yc-startups",
    title: "Y Combinator Work at a Startup (Internships & Early Career)",
    organization: "Y Combinator",
    category: "internship",
    mode: "Remote / Online",
    eligibility: "Students, Graduates & Engineers",
    deadline: "Rolling Applications",
    stipendOrPrize: "Paid Startup Roles ($25k - $120k+ ARR pro-rata)",
    description: "Direct portal to apply to 1,000+ fast-growing YC-funded tech startups with single profile application and direct founder contact.",
    applyUrl: "https://www.workatastartup.com/",
    tags: ["YC", "Startups", "Full Stack", "High Growth"],
    isVerified: true,
    status: "Open Now",
  },
  {
    id: "opp-google-solution-challenge",
    title: "Google Developer Student Clubs Solution Challenge",
    organization: "Google for Developers",
    category: "hackathon",
    mode: "Remote / Online",
    eligibility: "University & College Students",
    deadline: "Annual February - March Submission",
    stipendOrPrize: "$3,000 per team member + Google Mentorship",
    description: "Create an innovative tech solution for one or more of the United Nations 17 Sustainable Development Goals using Google technologies.",
    applyUrl: "https://developers.google.com/community/gdsc-solution-challenge",
    tags: ["Google", "UN Goals", "Mentorship", "Global Showcase"],
    isVerified: true,
    status: "Upcoming",
  },
  {
    id: "opp-outreachy",
    title: "Outreachy Open Source Internships",
    organization: "Software Freedom Conservancy",
    category: "fellowship",
    mode: "Remote / Online",
    eligibility: "Underrepresented populations in tech globally",
    deadline: "Bi-annual terms (March & August initial phase)",
    stipendOrPrize: "$7,000 USD Total Stipend",
    description: "Paid, fully remote internships for people subject to systemic bias or underrepresented in the technical industry of their country.",
    applyUrl: "https://www.outreachy.org/",
    tags: ["Diversity", "Open Source", "Paid", "Remote"],
    isVerified: true,
    status: "Upcoming",
  },
  {
    id: "opp-wellfound",
    title: "Wellfound (AngelList) Tech Internships",
    organization: "Wellfound",
    category: "internship",
    mode: "Remote / Online",
    eligibility: "Engineering, Product & Design Students",
    deadline: "Continuous Rolling Postings",
    stipendOrPrize: "Verified Market Compensation",
    description: "Discover thousands of software engineering, machine learning, and data internships with transparent salary and equity listings.",
    applyUrl: "https://wellfound.com/jobs",
    tags: ["Wellfound", "AngelList", "Internships", "Direct Message"],
    isVerified: true,
    status: "Open Now",
  },
  {
    id: "opp-google-generation-scholarship",
    title: "Generation Google Scholarship (APAC & Global)",
    organization: "Google",
    category: "scholarship",
    mode: "Remote / Online",
    eligibility: "Undergraduate students studying Computer Science",
    deadline: "Annual Fall/Winter Deadlines",
    stipendOrPrize: "$1,000 - $10,000 Tuition Award",
    description: "Scholarship awarded to aspiring computer scientists based on their commitment to diversity, equity, leadership, and academic performance.",
    applyUrl: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship",
    tags: ["Google", "Scholarship", "Women in Tech", "Tuition"],
    isVerified: true,
    status: "Upcoming",
  },
  {
    id: "opp-aws-scholarship",
    title: "AWS AI & ML Scholarship Program",
    organization: "Amazon Web Services & Udacity",
    category: "scholarship",
    mode: "Remote / Online",
    eligibility: "High school & college students (16+)",
    deadline: "Rolling Cohorts",
    stipendOrPrize: "Full Udacity Nanodegree Scholarship + AWS Mentorship",
    description: "Provides 2,500 annual scholarships to students to learn foundational concepts in Machine Learning and cloud architectures.",
    applyUrl: "https://aws.amazon.com/machine-learning/scholarship/",
    tags: ["AWS", "AI/ML", "Nanodegree", "Free Certification"],
    isVerified: true,
    status: "Open Now",
  },
  {
    id: "opp-github-campus-experts",
    title: "GitHub Campus Experts Leadership Program",
    organization: "GitHub Education",
    category: "fellowship",
    mode: "Hybrid",
    eligibility: "Active college students (GitHub Student Developer Pack)",
    deadline: "Bi-annual February & August Applications",
    stipendOrPrize: "GitHub Swag, Event Funding & Leadership Training",
    description: "Get trained in technical public speaking, community building, and hackathon organization with event funding directly from GitHub.",
    applyUrl: "https://education.github.com/experts",
    tags: ["GitHub", "Student Leader", "Campus Event Grants"],
    isVerified: true,
    status: "Open Now",
  },
];

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { category = "all", mode = "all", status = "all", query = "" } = body;

    const qLower = query.toLowerCase().trim();

    const filtered = VERIFIED_OPPORTUNITIES.filter((item) => {
      const matchCat = category === "all" || item.category === category;
      const matchMode = mode === "all" || item.mode.toLowerCase().includes(mode.toLowerCase());
      const matchStatus = status === "all" || item.status === status;
      const matchQuery =
        !qLower ||
        item.title.toLowerCase().includes(qLower) ||
        item.organization.toLowerCase().includes(qLower) ||
        item.description.toLowerCase().includes(qLower) ||
        item.tags.some((t) => t.toLowerCase().includes(qLower));

      return matchCat && matchMode && matchStatus && matchQuery;
    });

    return NextResponse.json({
      success: true,
      totalCount: filtered.length,
      opportunities: filtered,
    });
  } catch (err) {
    console.error("[api/opportunities] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to query opportunities." },
      { status: 500 }
    );
  }
}

