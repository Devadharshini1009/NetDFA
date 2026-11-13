# Sample Inputs and Outputs Test Matrix

This document provides representative sample inputs and real outputs demonstrating all validation, DNS resolution, and DFA state transitions.

---

## Test Suite 1: Valid Domains

### Case 1.1: `google.com`
- **Category**: High-traffic Apex Domain with Multi-Record Infrastructure
- **Input**: `"google.com"`
- **Syntax Status**: Valid (`RFC 1035` compliant)
- **DFA Trace**:
  1. $S_0 \xrightarrow{\text{SUBMIT\_DOMAIN}} S_1$
  2. $S_1 \xrightarrow{\text{SYNTAX\_VALID}} S_2$
  3. $S_2 \xrightarrow{\text{DNS\_COMPLETE}} S_3$
- **Expected DNS Status**: `PARTIAL` (A, AAAA, MX, NS, TXT published; CNAME absent at apex as per RFC 1912)
- **Sample Output JSON**:
```json
{
  "success": true,
  "domain": "google.com",
  "isValidSyntax": true,
  "dnsStatus": "PARTIAL",
  "statusMessage": "Successfully resolved 5 record types. 1 record types are not published for this domain.",
  "executionTimeMs": 142.3,
  "records": {
    "A": ["142.251.106.100", "142.251.106.101", "142.251.106.102"],
    "AAAA": ["2404:6800:4007:836::200e"],
    "MX": [
      { "exchange": "smtp.google.com", "priority": 10 }
    ],
    "NS": ["ns1.google.com", "ns2.google.com", "ns3.google.com", "ns4.google.com"],
    "TXT": [
      "v=spf1 include:_spf.google.com ~all",
      "google-site-verification=..."
    ]
  },
  "unavailableRecords": [
    {
      "type": "CNAME",
      "code": "ENODATA",
      "reason": "Domain exists, but no CNAME record is published (ENODATA)."
    }
  ]
}
```

---

### Case 1.2: `amazon.in`
- **Category**: Regional ccTLD (.in)
- **Input**: `"amazon.in"`
- **Syntax Status**: Valid
- **DFA Trace**: $S_0 \to S_1 \to S_2 \to S_3$
- **Expected DNS Status**: `PARTIAL` / `SUCCESS`
- **Records Returned**: A, MX, NS, TXT

---

### Case 1.3: `example.org`
- **Category**: Generic gTLD (.org) Reserved Example Domain (RFC 2606)
- **Input**: `"example.org"`
- **Syntax Status**: Valid
- **DFA Trace**: $S_0 \to S_1 \to S_2 \to S_3$
- **Records Returned**: A, AAAA, NS, TXT (No MX)

---

## Test Suite 2: Invalid Domain Syntax (Rejected at S1)

### Case 2.1: `google..com`
- **Input**: `"google..com"`
- **Failure Cause**: Consecutive dots (`..`) violating RFC 1035 label boundaries.
- **HTTP Code**: 400 Bad Request
- **DFA Trace**:
  1. $S_0 \xrightarrow{\text{SUBMIT\_DOMAIN}} S_1$
  2. $S_1 \xrightarrow{\text{SYNTAX\_INVALID}} S_0$ (Machine resets to S0; DNS query NOT called)
- **API Response**:
```json
{
  "success": false,
  "isValidSyntax": false,
  "domain": "google..com",
  "error": "Domain name cannot contain consecutive dots (\"..\").",
  "code": "ERR_CONSECUTIVE_DOTS",
  "currentState": { "code": "S0", "name": "INPUT", "label": "S0 – INPUT" }
}
```

---

### Case 2.2: `google@com`
- **Input**: `"google@com"`
- **Failure Cause**: Illegal character `@`. Domain labels only allow `[a-zA-Z0-9-]`.
- **HTTP Code**: 400 Bad Request
- **DFA Trace**: $S_0 \to S_1 \to S_0$

---

### Case 2.3: `-google.com`
- **Input**: `"-google.com"`
- **Failure Cause**: Label begins with a hyphen (`-`). RFC 1123 dictates hyphens may only appear internally.
- **HTTP Code**: 400 Bad Request
- **API Response**:
```json
{
  "success": false,
  "isValidSyntax": false,
  "error": "Label \"-google\" cannot start with a hyphen (\"-\").",
  "code": "ERR_HYPHEN_PREFIX"
}
```

---

### Case 2.4: `google-.com`
- **Input**: `"google-.com"`
- **Failure Cause**: Label ends with a hyphen (`-`).
- **HTTP Code**: 400 Bad Request
- **API Response**:
```json
{
  "success": false,
  "isValidSyntax": false,
  "error": "Label \"google-\" cannot end with a hyphen (\"-\").",
  "code": "ERR_HYPHEN_SUFFIX"
}
```

---

### Case 2.5: Empty Input `""`
- **Input**: `""`
- **Failure Cause**: Empty string.
- **HTTP Code**: 400 Bad Request
- **API Response**:
```json
{
  "success": false,
  "isValidSyntax": false,
  "error": "Domain name cannot be empty. Please enter a valid domain (e.g. google.com).",
  "code": "ERR_EMPTY_DOMAIN"
}
```

---

## Test Suite 3: Valid Syntax with Authoritative DNS Errors

### Case 3.1: `example.invalid`
- **Input**: `"example.invalid"`
- **Syntax Check**: Passed! (`.invalid` is a valid TLD syntax per RFC 2606 reserved for testing invalid domains).
- **DNS Lookup**: Authoritative root/TLD resolvers return `NXDOMAIN` / `ENOTFOUND`.
- **DFA Trace**:
  1. $S_0 \xrightarrow{\text{SUBMIT\_DOMAIN}} S_1$
  2. $S_1 \xrightarrow{\text{SYNTAX\_VALID}} S_2$
  3. $S_2 \xrightarrow{\text{DNS\_ERROR}} S_3$ *(Crucial: Transitions to S3 Result state, NOT S0!)*
- **HTTP Code**: 200 OK (Successful diagnostic query)
- **API Response**:
```json
{
  "success": true,
  "domain": "example.invalid",
  "isValidSyntax": true,
  "dnsStatus": "NXDOMAIN",
  "statusMessage": "Non-Existent Domain (NXDOMAIN / ENOTFOUND). The domain \"example.invalid\" is not registered or has no authoritative DNS records.",
  "executionTimeMs": 85.2,
  "records": {},
  "unavailableRecords": [
    {
      "type": "A",
      "code": "ENOTFOUND",
      "reason": "Domain name not found / NXDOMAIN in authoritative DNS."
    }
  ],
  "currentState": { "code": "S3", "name": "RESULT", "isAccepting": true }
}
```
