# Phase 1: System Architecture and Interdisciplinary Design Document
## Project: Domain Name Validation and DNS Lookup Tool

**Course Focus**: Interdisciplinary Capstone Project
**Disciplines Integrated**:
1. **Full Stack Web Development (FSWD)**: React 18, Vite, Node.js, Express.js, MongoDB, Mongoose, RESTful API architecture.
2. **Computer Networks (CN)**: Domain Name System (DNS) protocol hierarchy, OS stub resolver integration (`node:dns/promises`), multi-record concurrent resolution (`Promise.allSettled`), RFC 1034/1035 compliance, DNS error taxonomy (NXDOMAIN, ENODATA, SERVFAIL).
3. **Formal Languages & Automata Theory (FLAT)**: Deterministic Finite Automaton (DFA) $M = (Q, \Sigma, \delta, q_0, F)$ process orchestration, formal Chomsky Type-3 regular grammars, RFC-compliant Regular Expressions for domain syntax verification.

---

## 1. System Overview & Architecture

The application provides a robust, transparent, and educational platform for inspecting Internet domain names. Unlike opaque command-line tools, this system externalizes every stage of domain processing—from formal lexical validation using regular expressions to deterministic state machine transitions and concurrent DNS record resolution.

### High-Level Architectural Flow

```mermaid
flowchart TD
    User([User / Client Browser]) -->|HTTP POST /api/dns/lookup| Express[Express.js REST Gateway]
    Express --> DFA[DFA State Controller M]
    
    subgraph S1 [State S1: Formal Validation]
        DFA -->|Input: SUBMIT_DOMAIN| V[Domain Syntax Validator]
        V -->|RFC 1035 Regex Check| V_Res{Valid Syntax?}
    end
    
    V_Res -- No -->|Transition: SYNTAX_INVALID| S0[State S0: Reset / Error State]
    S0 --> Express
    
    V_Res -- Yes -->|Transition: SYNTAX_VALID| S2[State S2: DNS Query Engine]
    
    subgraph S2_DNS [State S2: Native DNS Resolution]
        S2 -->|Promise.allSettled| P1[A Query - IPv4]
        S2 -->|Promise.allSettled| P2[AAAA Query - IPv6]
        S2 -->|Promise.allSettled| P3[MX Query - Mail Exchange]
        S2 -->|Promise.allSettled| P4[NS Query - Nameservers]
        S2 -->|Promise.allSettled| P5[CNAME Query - Canonical Name]
        S2 -->|Promise.allSettled| P6[TXT Query - SPF/Verification]
    end
    
    P1 & P2 & P3 & P4 & P5 & P6 -->|Collate Results & Latency| S3[State S3: Result Synthesis]
    
    subgraph DB [Persistence Layer]
        S3 -->|Async Save| Mongo[(MongoDB: Lookup History)]
    end
    
    S3 -->|JSON Response + DFA Audit Trail| Express
    Express -->|Payload + State History| User
```

---

## 2. Academic Core Competencies

### A. Full Stack Web Development (FSWD)
- **Frontend Architecture**: Single Page Application (SPA) built using React 18 and Vite. Responsive cybersecurity-themed interface with component-driven state management, real-time DFA visualization, and asynchronous API integration.
- **Backend Architecture**: RESTful micro-service using Express.js. Implements CORS isolation, body validation, rate limiting, and structured JSON responses with standard HTTP semantics.
- **Data Persistence**: MongoDB with Mongoose ODM storing complete audit logs of queries, performance metrics, and DFA transition sequences.

### B. Computer Networks (CN)
- **Native Stub Resolver**: Direct interface with the host operating system's configured resolver through Node.js native `node:dns/promises`.
- **Parallel Asynchronous Queries**: Concurrent execution of 6 standard RR (Resource Record) queries (`A`, `AAAA`, `MX`, `NS`, `CNAME`, `TXT`) using `Promise.allSettled()`.
- **Accurate Error Disambiguation**: Clear differentiation between:
  - `NXDOMAIN` (`ENOTFOUND`): Domain does not exist in authoritative zones.
  - `NODATA` (`ENODATA`): Domain exists, but the queried record type does not exist (e.g. apex domain without a CNAME).
  - Network timeouts and resolver reachability errors.
- **Latency Measurement**: High-resolution performance metrics (`performance.now()`) per lookup cycle.

### C. Formal Languages & Automata Theory (FLAT)
- **Lexical Definition via Regular Languages**: RFC 1034/1035 domain label and TLD constraints modeled as formal regular languages recognized by regular expressions.
- **Deterministic Finite Automaton (DFA)**:
  - Formal 5-tuple: $M = (Q, \Sigma, \delta, q_0, F)$
  - States: $Q = \{ S_0, S_1, S_2, S_3 \}$
  - Input alphabet: $\Sigma = \{ \text{SUBMIT\_DOMAIN}, \text{SYNTAX\_VALID}, \text{SYNTAX\_INVALID}, \text{DNS\_COMPLETE}, \text{DNS\_ERROR}, \text{RESET} \}$
  - Initial state: $q_0 = S_0$
  - Accepting states: $F = \{ S_3 \}$
  - Transition logging: Every transition is auditable with strict state validation, rejecting illegal state mutations.

---

## 3. Directory Layout

```text
domain-dns-tool/
├── backend/
│   ├── config/          # Database and environment configurations
│   ├── controllers/     # Request/response handlers for DNS and history
│   ├── middleware/      # Rate limiting, error handling, CORS
│   ├── models/          # Mongoose schema for lookup records
│   ├── routes/          # Express route definitions
│   ├── services/        # Core DNS resolver and DFA controller logic
│   ├── utils/           # RFC domain validation regex and helper utilities
│   ├── server.js        # Main application entrypoint
│   └── package.json     # Node.js backend dependencies
├── frontend/
│   ├── public/          # Favicon and static assets
│   ├── src/
│   │   ├── components/  # DFA visualizer, record cards, navigation, badges
│   │   ├── pages/       # Dashboard, Workbench, Results, History, Theory
│   │   ├── services/    # Axios/Fetch API client wrapper
│   │   ├── styles/      # Cybersecurity theme styling & design tokens
│   │   ├── utils/       # Client-side validation helpers
│   │   ├── App.jsx      # Root routing component
│   │   └── main.jsx     # Vite DOM entry
│   ├── index.html       # HTML5 shell with Google Fonts
│   ├── package.json     # Frontend dependencies (React, Lucide, Router)
│   └── vite.config.js   # Vite configuration with backend proxy
├── documentation/       # Formal academic documentation and DFA proofs
│   ├── phase1_architecture_and_design.md
│   ├── DFA_definition.md
│   ├── state_transition_table.md
│   └── sample_inputs_outputs.md
├── README.md            # Comprehensive project overview and run instructions
└── .gitignore           # Git ignore exclusions
```

---

## 4. Phase Verification Checklist

- [x] Directory scaffolding verified in active workspace.
- [x] Technology stack aligned with project requirements.
- [x] Node.js version verified: v24.18.0.
- [x] Architecture design formally documented.
- [ ] Backend dependencies installation (Phase 2).
- [ ] Frontend dependencies installation (Phase 2).
