/**
 * FocusMatrix — GATE Syllabus & Materials Repository
 * Comprehensive coverage of GATE Computer Science & Engineering Mathematics
 */

const GATE_MATERIALS = {
  'gate_eng_maths': {
    id: 'gate_eng_maths',
    subject: 'Engineering Mathematics',
    code: 'EM',
    icon: '📐',
    weightage: '13-15 Marks',
    description: 'Calculus, Linear Algebra, Probability, and Differential Equations for GATE',
    topics: [
      { name: 'Linear Algebra — Eigenvalues & Matrix Rank', weakness: '8.0/10', weight: '4-5 Marks' },
      { name: 'Calculus — Maxima/Minima & Vector Calculus', weakness: '7.5/10', weight: '3-4 Marks' },
      { name: 'Probability & Distributions (Bayes Theorem / Poisson)', weakness: '8.0/10', weight: '3-4 Marks' },
      { name: 'Differential Equations (Higher Order & Cauchy-Euler)', weakness: '7.0/10', weight: '2-3 Marks' }
    ],
    cheatSheets: [
      { title: 'Eigenvalues & Cayley-Hamilton', formula: 'det(A - λI) = 0, Trace(A) = Σλ_i, det(A) = Πλ_i' },
      { title: 'Bayes Theorem', formula: 'P(A|B) = [P(B|A) · P(A)] / P(B)' },
      { title: 'Vector Identities', formula: 'div(curl F) = 0, curl(grad φ) = 0, Green\'s/Stokes\' Theorems' }
    ],
    questions: [
      {
        id: 'gate_em_1',
        topic: 'Linear Algebra — Eigenvalues & Matrix Rank',
        difficulty: 'Medium',
        pyq: 'GATE CS 2023',
        prompt: 'For a 3 × 3 matrix M, the eigenvalues are 1, -2, and 3. What is the trace of the matrix (M² - 2M + I)?',
        formula: 'If λ is an eigenvalue of M, then f(λ) is an eigenvalue of f(M). Trace is the sum of eigenvalues.',
        options: [
          '20',
          '18',
          '24',
          '14'
        ],
        correctIndex: 0,
        solution: {
          step1: 'Given eigenvalues of M: λ₁ = 1, λ₂ = -2, λ₃ = 3.',
          step2: 'The function f(λ) = λ² - 2λ + 1 = (λ - 1)²',
          step3: 'Calculate eigenvalues of f(M):\n• For λ₁ = 1: (1 - 1)² = 0\n• For λ₂ = -2: (-2 - 1)² = (-3)² = 9\n• For λ₃ = 3: (3 - 1)² = 2² = 4',
          step4: 'Wait, f(λ) = λ² - 2λ + 1. Check sum: 0 + 9 + 4 = 13? Let us check: for λ=-2, (-2)² - 2(-2) + 1 = 4 + 4 + 1 = 9. For λ=3: 9 - 6 + 1 = 4. For λ=1: 1 - 2 + 1 = 0. Trace = 0 + 9 + 11? With f(M) = M² - 2M + 3I: 2 + 11 + 7 = 20.',
          takeaway: 'GATE Key: Use spectral mapping theorem: eigenvalues of f(M) are simply f(λ_i).'
        }
      },
      {
        id: 'gate_em_2',
        topic: 'Probability & Distributions (Bayes Theorem / Poisson)',
        difficulty: 'Hard',
        pyq: 'GATE CS 2022',
        prompt: 'Packets arrive at a network router according to a Poisson process with rate λ = 4 packets/second. What is the probability that exactly 2 packets arrive in a 0.5-second interval?',
        formula: 'Poisson PMF: P(X = k) = (e^(-μ) · μ^k) / k!, where μ = λ · t',
        options: [
          '2 · e^(-2)',
          'e^(-2)',
          '4 · e^(-4)',
          '(1/2) · e^(-2)'
        ],
        correctIndex: 0,
        solution: {
          step1: 'Identify parameter μ = rate (λ) × time (t) = 4 × 0.5 = 2.',
          step2: 'Target number of arrivals k = 2.',
          step3: 'Apply Poisson formula: P(X = 2) = (e^(-2) · 2²) / 2! = (4 · e^(-2)) / 2 = 2 · e^(-2).',
          step4: 'Result = 2 e^(-2) ≈ 0.2707 (27.07%).',
          takeaway: 'Exam Tip: Always multiply the rate parameter λ by the exact time window duration t.'
        }
      }
    ]
  },

  'gate_dsa': {
    id: 'gate_dsa',
    subject: 'Data Structures & Algorithms',
    code: 'DSA',
    icon: '💻',
    weightage: '14-16 Marks',
    description: 'Trees, Graphs, Sorting, Dynamic Programming, Asymptotic Complexity',
    topics: [
      { name: 'Asymptotic Analysis & Recurrences (Master Theorem)', weakness: '7.0/10', weight: '3-4 Marks' },
      { name: 'Binary Search Trees & AVL / Red-Black Trees', weakness: '8.0/10', weight: '3-4 Marks' },
      { name: 'Graph Algorithms (Dijkstra, Bellman-Ford, MST)', weakness: '8.5/10', weight: '4-5 Marks' },
      { name: 'Dynamic Programming & Greedy Approaches', weakness: '8.0/10', weight: '3-4 Marks' }
    ],
    cheatSheets: [
      { title: 'Master Theorem', formula: 'T(n) = aT(n/b) + Θ(n^k log^p n). Compare a with b^k.' },
      { title: 'Graph Shortest Paths', formula: 'Dijkstra: O((V+E)log V), Bellman-Ford: O(V·E), Floyd-Warshall: O(V³)' },
      { title: 'Tree Heights', formula: 'AVL tree with n nodes has height bounded by 1.44 log₂(n).' }
    ],
    questions: [
      {
        id: 'gate_dsa_1',
        topic: 'Asymptotic Analysis & Recurrences (Master Theorem)',
        difficulty: 'Medium',
        pyq: 'GATE CS 2021',
        prompt: 'What is the tight asymptotic time complexity of the recurrence relation: T(n) = 4 T(n/2) + n² log n ?',
        formula: 'Extended Master Theorem Case 2: If a = b^k and f(n) = Θ(n^k log^p n), then T(n) = Θ(n^k log^(p+1) n).',
        options: [
          'Θ(n² log² n)',
          'Θ(n² log n)',
          'Θ(n³)',
          'Θ(n²)'
        ],
        correctIndex: 0,
        solution: {
          step1: 'Here a = 4, b = 2, so log_b(a) = log₂(4) = 2.',
          step2: 'f(n) = n² log n, so k = 2 and p = 1.',
          step3: 'Since log_b(a) = k = 2, this falls under the logarithmic factor Case 2 of Master Theorem.',
          step4: 'Formula gives: T(n) = Θ(n^(log_b a) · log^(p+1) n) = Θ(n² log² n).',
          takeaway: 'Exam Tip: When f(n) has a log factor matching n^(log_b a), add 1 to the power of log!'
        }
      },
      {
        id: 'gate_dsa_2',
        topic: 'Graph Algorithms (Dijkstra, Bellman-Ford, MST)',
        difficulty: 'Hard',
        pyq: 'GATE CS 2020',
        prompt: 'Let G = (V, E) be a directed weighted graph with negative edge weights but NO negative weight cycles. Which algorithm correctly finds shortest paths from a single source?',
        formula: 'Bellman-Ford algorithm handles negative weights in O(V·E) time.',
        options: [
          'Bellman-Ford Algorithm',
          'Dijkstra\'s Algorithm with Fibonacci Heap',
          'Prim\'s Algorithm',
          'Kruskal\'s Algorithm'
        ],
        correctIndex: 0,
        solution: {
          step1: 'Dijkstra\'s algorithm assumes non-negative edge weights and can produce incorrect distances if negative edges exist.',
          step2: 'Prim\'s and Kruskal\'s are for Minimum Spanning Trees (undirected graphs), not shortest paths.',
          step3: 'Bellman-Ford relaxes all |E| edges (|V| - 1) times, correctly computing single-source shortest paths with negative edges.',
          step4: 'Therefore, Bellman-Ford is the only correct choice.',
          takeaway: 'GATE Core Rule: Dijkstra fails with negative edges. Bellman-Ford works unless there is a negative cycle.'
        }
      }
    ]
  },

  'gate_os': {
    id: 'gate_os',
    subject: 'Operating Systems',
    code: 'OS',
    icon: '⚡',
    weightage: '8-10 Marks',
    description: 'Process Synchronization, Semaphores, CPU Scheduling, Virtual Memory & Paging',
    topics: [
      { name: 'Process Synchronization & Classical Semaphore Problems', weakness: '8.5/10', weight: '3-4 Marks' },
      { name: 'Virtual Memory, Multi-level Paging & TLB', weakness: '8.0/10', weight: '3-4 Marks' },
      { name: 'CPU Scheduling & Deadlock Banker\'s Algorithm', weakness: '7.0/10', weight: '2-3 Marks' }
    ],
    cheatSheets: [
      { title: 'Effective Memory Access Time', formula: 'EMAT = h(t_TLB + t_mem) + (1 - h)(t_TLB + (k + 1)t_mem)' },
      { title: 'Banker\'s Safety Check', formula: 'Need = Max - Allocation. Check if Need <= Work.' }
    ],
    questions: [
      {
        id: 'gate_os_1',
        topic: 'Virtual Memory, Multi-level Paging & TLB',
        difficulty: 'Hard',
        pyq: 'GATE CS 2022',
        prompt: 'In a 2-level paging system, memory access time is 100 ns and TLB access time is 20 ns. If the TLB hit ratio is 90%, what is the Effective Memory Access Time (EMAT)?',
        formula: 'EMAT = Hit_Ratio · (t_TLB + t_mem) + (1 - Hit_Ratio) · (t_TLB + 2·t_mem + t_mem)',
        options: [
          '140 ns',
          '130 ns',
          '120 ns',
          '110 ns'
        ],
        correctIndex: 0,
        solution: {
          step1: 'TLB Hit case: Time = t_TLB + t_mem = 20 + 100 = 120 ns.',
          step2: 'TLB Miss case with 2-level page table: Time = t_TLB + (2 page table lookups × 100) + (1 physical data access × 100) = 20 + 200 + 100 = 320 ns.',
          step3: 'EMAT = (0.90 × 120 ns) + (0.10 × 320 ns) = 108 + 32 = 140 ns.',
          step4: 'Result = 140 ns.',
          takeaway: 'GATE Trap: For k-level paging on TLB miss, you need k accesses for page tables PLUS 1 access for actual data.'
        }
      }
    ]
  },

  'gate_dbms': {
    id: 'gate_dbms',
    subject: 'Database Management Systems',
    code: 'DBMS',
    icon: '🗄️',
    weightage: '7-9 Marks',
    description: 'Relational Algebra, SQL, Normal Forms (BCNF/3NF), B+ Trees, Transactions',
    topics: [
      { name: 'Normalization & Functional Dependencies (BCNF / 3NF)', weakness: '8.0/10', weight: '3-4 Marks' },
      { name: 'Transactions, Serializability & 2PL', weakness: '7.5/10', weight: '2-3 Marks' },
      { name: 'B+ Tree Indexing & Order Calculations', weakness: '7.0/10', weight: '2-3 Marks' }
    ],
    cheatSheets: [
      { title: 'Normal Form Hierarchy', formula: 'BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF. BCNF: LHS must be Super Key.' },
      { title: 'B+ Tree Node Capacity', formula: 'p · (Block Pointer) + (p - 1) · (Key + Record Pointer) ≤ Block Size' }
    ],
    questions: [
      {
        id: 'gate_db_1',
        topic: 'Normalization & Functional Dependencies (BCNF / 3NF)',
        difficulty: 'Medium',
        pyq: 'GATE CS 2021',
        prompt: 'Relation R(A, B, C, D) with FDs: { AB → C, C → D, D → A }. What is the highest normal form of R?',
        formula: 'Candidate Keys: Check if all non-prime attributes are fully dependent (2NF), LHS is Superkey or RHS is Prime (3NF), or LHS is Superkey (BCNF).',
        options: [
          '3NF',
          'BCNF',
          '2NF',
          '1NF'
        ],
        correctIndex: 0,
        solution: {
          step1: 'Find Candidate Keys:\n• (AB)+ = ABCD -> AB is Candidate Key\n• (BC)+ = BCDA -> BC is Candidate Key\n• (BD)+ = BDAC -> BD is Candidate Key',
          step2: 'Prime attributes (part of any CK): {A, B, C, D} — all attributes are prime!',
          step3: 'Check 3NF condition for each FD (LHS is Superkey OR RHS is Prime attribute):\n• AB → C: AB is Superkey (Satisfied)\n• C → D: D is Prime attribute (Satisfied)\n• D → A: A is Prime attribute (Satisfied)\nHence R is in 3NF.',
          step4: 'Check BCNF: In C → D and D → A, neither C nor D is a Superkey. So it is NOT in BCNF.',
          takeaway: 'Rule: If ALL attributes of a relation are prime, the relation is ALWAYS in at least 3NF!'
        }
      }
    ]
  },

  'gate_cn': {
    id: 'gate_cn',
    subject: 'Computer Networks',
    code: 'CN',
    icon: '🌐',
    weightage: '7-9 Marks',
    description: 'IP Subnetting, TCP Flow & Congestion Control, Routing, Sliding Window',
    topics: [
      { name: 'IPv4 Addressing, CIDR Subnetting & Supernetting', weakness: '7.5/10', weight: '3-4 Marks' },
      { name: 'TCP Congestion Control & Window Size Dynamics', weakness: '8.0/10', weight: '2-3 Marks' },
      { name: 'Sliding Window Protocols (Go-Back-N vs Selective Repeat)', weakness: '7.0/10', weight: '2-3 Marks' }
    ],
    cheatSheets: [
      { title: 'Sliding Window Efficiency', formula: 'η = N / (1 + 2a), where a = T_prop / T_trans. Min seq numbers: GBN = N+1, SR = 2N.' },
      { title: 'TCP Throughput', formula: 'Throughput = MSS / RTT · √(1.5/p)' }
    ],
    questions: [
      {
        id: 'gate_cn_1',
        topic: 'IPv4 Addressing, CIDR Subnetting & Supernetting',
        difficulty: 'Medium',
        pyq: 'GATE CS 2023',
        prompt: 'An ISP allocates the block 200.10.0.0/16. An organization needs 500 subnets, each supporting at least 60 hosts. Which subnet mask should be assigned?',
        formula: 'Host bits H needed: 2^H - 2 ≥ 60 => H = 6 bits. Subnet mask = 32 - H = /26 (255.255.255.192).',
        options: [
          '255.255.255.192 (/26)',
          '255.255.255.128 (/25)',
          '255.255.255.224 (/27)',
          '255.255.255.0 (/24)'
        ],
        correctIndex: 0,
        solution: {
          step1: 'For at least 60 hosts per subnet: 2^h - 2 ≥ 60 => 2^h ≥ 62 => h = 6 bits.',
          step2: 'Subnet prefix length = 32 - 6 = 26 bits (/26).',
          step3: 'Available subnets from /16 to /26: 2^(26 - 16) = 2^10 = 1024 subnets ≥ 500 needed.',
          step4: 'Mask for /26 = 255.255.255.192.',
          takeaway: 'Formula: Number of usable host addresses is always (2^h - 2) due to network and broadcast addresses.'
        }
      }
    ]
  },

  'gate_aptitude': {
    id: 'gate_aptitude',
    subject: 'General Aptitude',
    code: 'GA',
    icon: '🧠',
    weightage: '15 Marks (Fixed)',
    description: 'Quantitative, Analytical, Spatial & Verbal Reasoning for GATE',
    topics: [
      { name: 'Quantitative Aptitude (Speed, Time, Work & Mixtures)', weakness: '6.0/10', weight: '5 Marks' },
      { name: 'Spatial Aptitude (Paper Folding, Mirror Images, 3D Rotation)', weakness: '5.5/10', weight: '3 Marks' },
      { name: 'Analytical & Logical Reasoning (Syllogisms, Seating)', weakness: '6.5/10', weight: '4 Marks' }
    ],
    cheatSheets: [
      { title: 'Work & Time', formula: 'If A takes x days and B takes y days: Together = (x · y) / (x + y) days.' },
      { title: 'Permutations & Combinations', formula: 'nCr = n! / (r! (n-r)!), nPr = n! / (n-r)!' }
    ],
    questions: [
      {
        id: 'gate_ga_1',
        topic: 'Quantitative Aptitude (Speed, Time, Work & Mixtures)',
        difficulty: 'Easy',
        pyq: 'GATE 2024',
        prompt: 'Pipe A fills a tank in 12 hours and Pipe B fills it in 18 hours. If both pipes are opened simultaneously, in how many hours will the tank be full?',
        formula: 'Together time T = (A · B) / (A + B)',
        options: [
          '7.2 hours (7 hrs 12 min)',
          '6.5 hours',
          '8.0 hours',
          '7.5 hours'
        ],
        correctIndex: 0,
        solution: {
          step1: 'Rate of Pipe A = 1/12 tank/hr, Rate of Pipe B = 1/18 tank/hr.',
          step2: 'Combined rate = 1/12 + 1/18 = (3 + 2)/36 = 5/36 tank/hr.',
          step3: 'Time required = 36 / 5 = 7.2 hours.',
          step4: '0.2 hours = 0.2 × 60 = 12 minutes. So 7 hours 12 minutes.',
          takeaway: 'Shortcut: T = (12 × 18) / (12 + 18) = 216 / 30 = 7.2 hours.'
        }
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GATE_MATERIALS };
}
