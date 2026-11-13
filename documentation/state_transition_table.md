# State Transition Table & Matrix

**Project**: Domain Name Validation and DNS Lookup Tool  
**Discipline**: Formal Languages and Automata Theory (FLAT)  
**Automaton Model**: $M = (Q, \Sigma, \delta, q_0, F)$

---

## 1. Full State Transition Matrix

The table below specifies the next state $\delta(q, \sigma)$ for every state $q \in Q$ and input symbol $\sigma \in \Sigma$. 
Cells marked with **REJECT** indicate illegal transitions that trigger an `ERR_ILLEGAL_DFA_TRANSITION` exception.

| State ($q$) / Input ($\sigma$) | `SUBMIT_DOMAIN` | `SYNTAX_VALID` | `SYNTAX_INVALID` | `DNS_COMPLETE` | `DNS_ERROR` | `RESET` |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **$S_0$ (INPUT)** | **$S_1$** | REJECT | REJECT | REJECT | REJECT | REJECT |
| **$S_1$ (VALIDATION)** | REJECT | **$S_2$** | **$S_0$** | REJECT | REJECT | REJECT |
| **$S_2$ (DNS_QUERY)** | REJECT | REJECT | REJECT | **$S_3$** | **$S_3$** | REJECT |
| **$S_3$ (RESULT)** *(Accepting)* | REJECT | REJECT | REJECT | REJECT | REJECT | **$S_0$** |

---

## 2. Granular Transition Specifications

### Transition 1: $S_0 \xrightarrow{\text{SUBMIT\_DOMAIN}} S_1$
- **Trigger**: Client invokes `POST /api/dns/lookup` with a payload `{ "domain": "..." }`.
- **Preconditions**: Machine is at resting state $S_0$.
- **Actions**:
  1. Capture request timestamp.
  2. Normalize raw domain string.
  3. Transfer control to the lexical validation engine.
- **Postconditions**: Machine resides at state $S_1$.

### Transition 2: $S_1 \xrightarrow{\text{SYNTAX\_VALID}} S_2$
- **Trigger**: Domain string satisfies all RFC 1034, 1035, and 1123 constraints.
- **Preconditions**: Machine is in state $S_1$.
- **Actions**:
  1. Log validation success metadata (labels count, TLD extracted).
  2. Initialize concurrent DNS lookup tasks via `Promise.allSettled()`.
- **Postconditions**: Machine resides at state $S_2$.

### Transition 3: $S_1 \xrightarrow{\text{SYNTAX\_INVALID}} S_0$
- **Trigger**: Domain violates syntax constraints (e.g. empty string, consecutive dots, hyphen prefix, invalid TLD).
- **Preconditions**: Machine is in state $S_1$.
- **Actions**:
  1. Log specific error code (e.g. `ERR_CONSECUTIVE_DOTS`, `ERR_HYPHEN_PREFIX`).
  2. Abort further processing; **do not invoke DNS resolver**.
  3. Return HTTP 400 Bad Request to client with transition trace.
- **Postconditions**: Machine safely resets to initial state $S_0$.

### Transition 4: $S_2 \xrightarrow{\text{DNS\_COMPLETE}} S_3$
- **Trigger**: OS resolver returns at least one successful RR type (e.g. A, AAAA, MX, NS, CNAME, TXT).
- **Preconditions**: Machine is in state $S_2$.
- **Actions**:
  1. Measure total elapsed execution time (`performance.now()`).
  2. Collate published records vs unavailable records (ENODATA).
  3. Persist audit record in MongoDB (if connected).
- **Postconditions**: Machine reaches accepting state $S_3$.

### Transition 5: $S_2 \xrightarrow{\text{DNS\_ERROR}} S_3$
- **Trigger**: OS resolver returns an authoritative failure (e.g. NXDOMAIN / ENOTFOUND, SERVFAIL, timeout).
- **Preconditions**: Machine is in state $S_2$.
- **Actions**:
  1. Flag status as `NXDOMAIN` or `ERROR`.
  2. Differentiate authoritative non-existence from syntactic invalidity.
  3. Persist audit record in MongoDB (if connected).
- **Postconditions**: Machine reaches accepting state $S_3$.

### Transition 6: $S_3 \xrightarrow{\text{RESET}} S_0$
- **Trigger**: Client requests a new search or clears the workbench.
- **Preconditions**: Machine is in accepting state $S_3$.
- **Actions**:
  1. Flush workbench state.
  2. Return automaton to initial state $S_0$.
- **Postconditions**: Machine resides at state $S_0$.

---

## 3. Rejection of Illegal Transitions

Any transition not defined in the transition matrix is prohibited by the `DfaController`:
- **Attempting $S_0 \to S_2$**: Directly querying DNS without passing lexical validation is blocked.
- **Attempting $S_0 \to S_3$**: Displaying results without prior execution is blocked.
- **Attempting $S_2 \to S_0$**: Prematurely aborting resolution without reaching a terminal result state is blocked.
