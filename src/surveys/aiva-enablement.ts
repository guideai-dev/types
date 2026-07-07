/**
 * AIVA Enablement Framework
 *
 * Defines the 6-pillar × 23-work-stream enablement model for AI across the SDLC.
 * This is a framework-locked design — pillars and work streams are not user-editable.
 *
 * Two distinct AI modes in development:
 * - AI Agentic Coding: Human + AI in terminal/IDE (Claude Code, Copilot, Cursor)
 * - AI Workflow Agents: Autonomous AI in tools (GitHub, Jira, CI) responding to signals
 */

import type { AIVADimension } from './aiva.js'

// =============================================================================
// ENUMS
// =============================================================================

export type AIVAEnablementPillar =
  | 'discovery_design'
  | 'agentic_coding'
  | 'ai_in_workflow'
  | 'quality_testing'
  | 'delivery_ops'
  | 'foundations_governance'

export type AIVAEnablementStatus = 'not_started' | 'in_progress' | 'done'

export type AIVAEnablementGapSeverity = 'critical' | 'significant' | 'moderate' | 'minor'

export type AIVAEnablementPriority = 'critical' | 'high' | 'medium' | 'low'

export type AIVAEnablementHorizon = 'h1' | 'h2' | 'h3' | 'h4'

export type AIVAEnablementConfidence = 'low' | 'medium' | 'high'

export type AIVAEnablementActionStatus = 'todo' | 'in_progress' | 'done' | 'blocked'

export type AIVAEnablementActionEffort = 'low' | 'medium' | 'high'

// =============================================================================
// WORK STREAM KEYS (23 total)
// =============================================================================

export type AIVAEnablementWorkStream =
  // Pillar 1: Product Discovery & Design (4)
  | 'ai_assisted_research'
  | 'problem_definition'
  | 'design_prototyping'
  | 'product_analytics'
  // Pillar 2: AI Agentic Coding (4)
  | 'agentic_engineering'
  | 'developer_tooling'
  | 'ai_code_review'
  | 'skills_fluency'
  // Pillar 3: AI In the Workflow (4)
  | 'signal_response_design'
  | 'governance_boundaries'
  | 'trust_observability'
  | 'security_access_control'
  // Pillar 4: Quality, Testing & Review (4)
  | 'ai_test_generation'
  | 'automated_code_review_ci'
  | 'quality_measurement'
  | 'security_scanning'
  // Pillar 5: Delivery & Operations (4)
  | 'ai_ready_cicd'
  | 'ai_ready_infra'
  | 'ai_observability'
  | 'incident_response'
  // Pillar 6: Foundations & Governance (4)
  | 'ai_policy_compliance'
  | 'data_knowledge_infra'
  | 'ai_finops'
  | 'change_management'

// =============================================================================
// FRAMEWORK DEFINITION
// =============================================================================

export interface AIVAEnablementWorkStreamDef {
  key: AIVAEnablementWorkStream
  pillar: AIVAEnablementPillar
  title: string
  description: string
  /** Concrete examples of tools, practices, or patterns that exemplify mature practice */
  examples: string[]
  /** AIVA dimensions that feed into this work stream's auto-derived status */
  dimensionInputs: AIVADimension[]
  /** Other work stream keys this depends on */
  dependencies: AIVAEnablementWorkStream[]
  /** Default horizon assignment */
  defaultHorizon: AIVAEnablementHorizon
}

export interface AIVAEnablementPillarDef {
  key: AIVAEnablementPillar
  title: string
  shortTitle: string
  description: string
  workStreams: AIVAEnablementWorkStream[]
}

// =============================================================================
// PILLAR DEFINITIONS
// =============================================================================

export const AIVA_ENABLEMENT_PILLARS: Record<AIVAEnablementPillar, AIVAEnablementPillarDef> = {
  discovery_design: {
    key: 'discovery_design',
    title: 'Product Discovery & Design',
    shortTitle: 'Discovery & Design',
    description:
      'The first diamond — problem space + solution framing. AI accelerating research, prioritisation, design, and experimentation.',
    workStreams: [
      'ai_assisted_research',
      'problem_definition',
      'design_prototyping',
      'product_analytics',
    ],
  },
  agentic_coding: {
    key: 'agentic_coding',
    title: 'AI Agentic Coding',
    shortTitle: 'Agentic Coding',
    description:
      'Human + AI pair programming in terminals and IDEs — agentic engineering, not vibe coding.',
    workStreams: ['agentic_engineering', 'developer_tooling', 'ai_code_review', 'skills_fluency'],
  },
  ai_in_workflow: {
    key: 'ai_in_workflow',
    title: 'AI In the Workflow',
    shortTitle: 'Workflow Agents',
    description:
      'AI acting autonomously within tools like GitHub, Jira, Slack, CI in response to signals — no human at the keyboard.',
    workStreams: [
      'signal_response_design',
      'governance_boundaries',
      'trust_observability',
      'security_access_control',
    ],
  },
  quality_testing: {
    key: 'quality_testing',
    title: 'Quality, Testing & Review',
    shortTitle: 'Quality & Testing',
    description:
      'AI accelerating how you test, review, and assure quality of the software you build.',
    workStreams: [
      'ai_test_generation',
      'automated_code_review_ci',
      'quality_measurement',
      'security_scanning',
    ],
  },
  delivery_ops: {
    key: 'delivery_ops',
    title: 'Delivery & Operations',
    shortTitle: 'Delivery & Ops',
    description: 'AI in CI/CD, deployment, and production operations.',
    workStreams: ['ai_ready_cicd', 'ai_ready_infra', 'ai_observability', 'incident_response'],
  },
  foundations_governance: {
    key: 'foundations_governance',
    title: 'Foundations & Governance',
    shortTitle: 'Foundations',
    description: 'Cross-cutting enablers that underpin all SDLC phases.',
    workStreams: [
      'ai_policy_compliance',
      'data_knowledge_infra',
      'ai_finops',
      'change_management',
    ],
  },
} as const

// =============================================================================
// WORK STREAM DEFINITIONS
// =============================================================================

export const AIVA_ENABLEMENT_WORK_STREAMS: Record<
  AIVAEnablementWorkStream,
  AIVAEnablementWorkStreamDef
> = {
  // ── Pillar 1: Product Discovery & Design ──────────────────────────────

  ai_assisted_research: {
    key: 'ai_assisted_research',
    pillar: 'discovery_design',
    title: 'AI-Assisted Research & Synthesis',
    description:
      'Teams feed raw user interview transcripts, support tickets, NPS verbatims, and competitive intel into AI synthesis pipelines that surface recurring themes, contradictions, and opportunity signals in hours rather than weeks. Mature teams run continuous discovery loops where AI generates initial insight reports, product trios review and challenge them, and refined outputs feed directly into opportunity backlogs.',
    examples: [
      'Interview-to-insight pipelines — upload call recordings to tools like Dovetail; get AI-generated summaries with quotes tagged to JTBD frameworks, theme clusters, and sentiment shifts across cohorts',
      'AI research assistants — NotebookLM or custom GPTs that ingest competitive teardowns, analyst reports, and patent filings to generate structured comparison matrices',
      'Affinity-mapping bots — Miro AI clusters workshop sticky notes into emergent themes with confidence scores, compressing days of manual synthesis into minutes',
      'Synthetic persona stress-testing — generate likely objections and edge-case user journeys for hypothesis validation (supplementing, never replacing, real user contact)',
    ],
    dimensionInputs: ['vsDiscoveryResearch', 'vsDiscoveryClarity'],
    dependencies: [],
    defaultHorizon: 'h1',
  },
  problem_definition: {
    key: 'problem_definition',
    pillar: 'discovery_design',
    title: 'Problem Definition & Prioritisation',
    description:
      'AI assists product teams in moving from vague opportunity areas to crisp problem statements by mining usage data, support volume, churn signals, and market signals to size opportunities quantitatively. Hypothesis generation becomes systematic: given a set of user pain points, AI proposes testable hypotheses ranked by potential impact and confidence, while requirement extraction from unstructured sources (Slack threads, meeting notes, customer calls) feeds structured backlogs.',
    examples: [
      'Opportunity sizing models — AI ingests product analytics (Amplitude, Mixpanel) and support data to estimate addressable user segments and revenue impact per problem area',
      'RICE/ICE auto-scoring — AI pre-scores backlog items using reach, impact, confidence, effort heuristics derived from historical delivery data',
      'Requirement extraction from transcripts — tools parsing meeting recordings into structured user stories with acceptance criteria, linked to source timestamps',
      'Hypothesis trees — AI generates "if we solve X, then Y metric improves by Z%" trees that product trios can debate, refine, and prioritise',
      'Competitive gap monitoring — automated tracking of competitor changelogs, app store reviews, and social sentiment to identify unmet needs and market timing',
    ],
    dimensionInputs: ['vsDiscoveryPrioritization', 'vsDiscoveryCollaboration'],
    dependencies: ['ai_assisted_research'],
    defaultHorizon: 'h1',
  },
  design_prototyping: {
    key: 'design_prototyping',
    pillar: 'discovery_design',
    title: 'Design & Prototyping',
    description:
      'AI design tools enable same-day concept-to-clickable-prototype cycles, compressing the traditional design sprint from five days to one. Designers describe interfaces in natural language and receive layout drafts, component suggestions, and interaction flows that conform to the team\'s design system. Design system compliance checking runs automatically, catching token violations, accessibility issues, and pattern drift before handoff.',
    examples: [
      'Figma AI / Galileo AI — generate UI layouts from text descriptions anchored to design system tokens, producing starting points designers refine rather than build from scratch',
      'v0.dev (Vercel) — natural language to functional React component prototypes, shareable and testable within minutes',
      'Design system linters — AI-powered checks validating new screens against component libraries, colour palettes, spacing rules, and WCAG accessibility standards',
      'Rapid A/B mockup generation — produce multiple visual variants of a feature for stakeholder feedback in a single session',
      'Accessibility auto-audit — AI scans prototypes for contrast issues, missing labels, and screen reader compatibility before any user testing begins',
    ],
    dimensionInputs: ['capTpDesignSystem', 'capWowCrossFunctional'],
    dependencies: ['problem_definition'],
    defaultHorizon: 'h2',
  },
  product_analytics: {
    key: 'product_analytics',
    pillar: 'discovery_design',
    title: 'Product Analytics & Experimentation',
    description:
      'Mature teams unify feature flags, A/B testing, and metric analysis on a single platform where AI recommends experiments, monitors statistical significance in real-time, and surfaces unexpected metric movements automatically. Experimentation runs continuously alongside delivery (dual-track), with AI shortening the time from hypothesis to statistically significant result through variance reduction techniques and Bayesian sequential testing.',
    examples: [
      'Statsig / GrowthBook — unified platforms combining feature flags, experiments, and product metrics with AI-powered experiment recommendations and CUPED variance reduction',
      'LaunchDarkly Experimentation — feature flags tied to experiment results that auto-promote winning variants or roll back losers based on metric impact',
      'Anomaly alerting on guardrail metrics — AI monitors key health metrics during rollouts and auto-alerts when degradation exceeds thresholds',
      'Causal inference engines — AI distinguishes correlation from causation in product metrics, identifying whether a feature change actually drove the observed outcome',
    ],
    dimensionInputs: [
      'vsValidationExperimentation',
      'vsValidationMetrics',
      'vsValidationFeedback',
    ],
    dependencies: [],
    defaultHorizon: 'h2',
  },

  // ── Pillar 2: AI Agentic Coding ───────────────────────────────────────

  agentic_engineering: {
    key: 'agentic_engineering',
    pillar: 'agentic_coding',
    title: 'Agentic Engineering Practices',
    description:
      'Engineers operate as orchestrators — spending the majority of time on problem definition, context engineering, and verification strategy rather than raw implementation. TDD is mandatory in agentic workflows: write tests first, have the agent generate minimum code to pass them, constraining drift. Context engineering (curating what the agent sees via CLAUDE.md, .cursorrules, and structured project instructions) is the single biggest determinant of output quality, and cognitive debt (the gap between code that exists and the team\'s understanding of it) is actively managed.',
    examples: [
      'TDD-first agentic loops — write failing tests, agent implements, CI validates; the test suite becomes the specification and the guardrail',
      'CLAUDE.md / RULES.md patterns — project-level instruction files encoding coding standards, architectural constraints, and domain rules with folder-level overrides',
      'Implementation plans before execution — structured specs (intent, constraints, architecture boundaries) fed to agents before any code generation',
      'Small-diff discipline — plan, small diff, tests, review; never let agents produce large undifferentiated changesets (CodeScene data shows PRs under 200 lines have dramatically higher review quality)',
      'MCP (Model Context Protocol) servers — custom tool integrations giving agents controlled access to internal APIs, databases, and documentation',
      'Cognitive debt check-ins — teams explicitly ask "can every engineer explain what this code does and why?" before merging AI-generated PRs',
    ],
    dimensionInputs: ['vsDeliveryVelocity', 'vsDeliveryQuality', 'capWowRituals'],
    dependencies: ['skills_fluency'],
    defaultHorizon: 'h2',
  },
  developer_tooling: {
    key: 'developer_tooling',
    pillar: 'agentic_coding',
    title: 'Developer Tooling & Golden Paths',
    description:
      'Platform teams provide reusable, well-documented modules and golden-path templates that eliminate boilerplate and enforce consistency across services. Authentication, logging, configuration, observability, and error handling are solved once as shared libraries, so teams spend time on business logic rather than reinventing infrastructure. Service scaffolds come pre-wired with these modules, CI pipelines, and security policies — new services are production-ready from the first commit.',
    examples: [
      'Shared auth modules — reusable authentication/authorisation libraries (OAuth, RBAC, API key validation) that every service imports rather than reimplements',
      'Structured logging libraries — standardised logging with correlation IDs, log levels, and automatic context enrichment (request ID, tenant, user) across all services',
      'Configuration management — centralised config libraries handling environment variables, feature flags, and secrets with type-safe access and validation',
      'Observability primitives — shared tracing, metrics, and health-check modules that ensure every service emits consistent telemetry from day one',
      'Service catalog templates — Backstage/Port templates with pre-wired modules, CI pipelines, and security policies baked in from project creation',
      'Reference implementations — canonical examples of "how we build X here" that serve as force multipliers for both human and AI developers (Fowler pattern)',
    ],
    dimensionInputs: ['capTpGoldenPaths', 'capTpAiTooling', 'vsFoundationsDx'],
    dependencies: [],
    defaultHorizon: 'h1',
  },
  ai_code_review: {
    key: 'ai_code_review',
    pillar: 'agentic_coding',
    title: 'AI Code Review Standards',
    description:
      'Organisations apply heightened review rigor to AI-generated code, recognising that AI produces measurably more logic errors than human-written code (ACM 2025). Verification checklists are mandatory: does the code match the stated intent, are edge cases handled, is the code comprehensible to the team? AI-assisted reviewers run in CI providing first-pass feedback, but human reviewers focus on architectural fit, business logic correctness, and trade-off decisions.',
    examples: [
      'Verification checklists for AI-generated PRs — mandatory fields: "Did a human verify the logic?", "Are tests covering the new behaviour?", "Can the team explain what this does?"',
      'Layered review pipeline — formatters/linters, then SAST, then AI reviewer, then human reviewer for architectural decisions; each layer catches different classes of issues',
      'Signal-to-noise tracking — measure acceptance rate of AI review comments (target >80%); dismiss or retune noisy bots that waste reviewer attention',
      '"No ship without understanding" rule — code cannot merge if the author cannot explain its behaviour; directly combats cognitive debt',
    ],
    dimensionInputs: ['vsDeliveryQuality', 'capGeQualityGates'],
    dependencies: ['agentic_engineering'],
    defaultHorizon: 'h2',
  },
  skills_fluency: {
    key: 'skills_fluency',
    pillar: 'agentic_coding',
    title: 'Skills, Growth & Role Evolution',
    description:
      'Organisations build tiered AI fluency programmes moving engineers from prompt literacy through context engineering to agent orchestration, while simultaneously evolving career frameworks to reflect the shift from implementer to orchestrator. Growth frameworks explicitly define what "senior" means when AI handles routine coding — valuing architectural judgement, verification discipline, and system thinking over raw output. Talent strategy adapts to attract and retain engineers who thrive in AI-augmented environments.',
    examples: [
      'Three-tier curriculum — Tier 1: prompt basics and tool familiarisation; Tier 2: context engineering, CLAUDE.md authoring, TDD-with-agents; Tier 3: multi-agent orchestration and custom tool building',
      'Evolved career ladders — engineering levels redefined around architectural oversight, verification rigour, and system design rather than lines-of-code output',
      'AI Champions Network — designated team leads who run internal demos, curate pattern libraries, and escalate friction to platform teams',
      'Role evolution mapping — explicit documentation of how each engineering role changes with AI adoption, covering day-to-day activities, skills required, and growth expectations',
      'Talent strategy — hiring for AI-native skills (context engineering, agent orchestration), retention programmes for engineers navigating role shifts, and upskilling pathways',
    ],
    dimensionInputs: ['capPsAiFluency', 'capPsPromptEngineering', 'capPsGrowthFrameworks', 'capPsRoleEvolution', 'capPsTalentStrategy'],
    dependencies: [],
    defaultHorizon: 'h1',
  },

  // ── Pillar 3: AI In the Workflow ──────────────────────────────────────

  signal_response_design: {
    key: 'signal_response_design',
    pillar: 'ai_in_workflow',
    title: 'Workflow / Process Design',
    description:
      'AI actions are triggered by well-defined signals in existing tools — a Jira status change triggers automated context gathering, a PR merge triggers release note generation, a failing CI build triggers root cause analysis. The architecture follows an event-trigger-action pattern where the AI agent interprets context, drives the right tool, inspects the new state, and repeats until the job is done. These are embedded automations operating inside the engineering toolchain, not chatbots.',
    examples: [
      'GitHub bots — auto-label PRs by area, auto-assign reviewers based on code ownership, generate PR descriptions from commit history and linked issues',
      'Jira automation + AI — when an issue transitions to "Ready for Dev", AI pre-populates implementation notes, links related issues, and suggests estimates based on historical data',
      'Slack-triggered workflows — thread a question about a production alert and an AI agent queries logs, correlates metrics, and posts a preliminary RCA within minutes',
      'Automated ticket resolution — coding agents that resolve well-scoped tickets, submit PRs, run CI, and update issue status autonomously',
      'Event-driven context assembly — when a signal fires, AI gathers all relevant context (code, docs, history, related issues) before presenting it to the human or taking action',
    ],
    dimensionInputs: ['capTpCiCd', 'capWowDecisionMaking'],
    dependencies: ['developer_tooling', 'ai_policy_compliance'],
    defaultHorizon: 'h2',
  },
  governance_boundaries: {
    key: 'governance_boundaries',
    pillar: 'ai_in_workflow',
    title: 'Governance & Boundaries',
    description:
      'Organisations classify AI actions on a spectrum from fully autonomous (formatting, linting, test generation) to human-approved (production deployments, data deletion, financial transactions). The "Rule of Two" provides a practical heuristic: an AI agent can safely do at most two of three things — process untrusted inputs, access sensitive data, or change state. If all three are needed, human-in-the-loop approval is mandatory.',
    examples: [
      'Action classification tiers — Tier 0 (auto-approved): formatting, linting, test scaffolding; Tier 1 (notify): PR creation, issue updates; Tier 2 (require approval): production deploys, access changes, data mutations',
      'Meta\'s "Rule of Two" — agents meet at most two of three risk criteria (untrusted input, sensitive data access, state mutation) before operating autonomously',
      'Goal-lock mechanisms — agent system prompts preventing scope drift; the agent cannot expand its own task beyond the original trigger',
      'Approval workflows in CI — AI can propose changes but cannot merge without human approval for security-critical code, infrastructure, and database migrations',
      'Audit trails — every AI action logged with: who triggered it, what context was provided, what action was taken, and what was the outcome',
    ],
    dimensionInputs: ['capGeCompliance', 'capGeSecurity', 'vsFoundationsGovernance'],
    dependencies: ['ai_policy_compliance'],
    defaultHorizon: 'h2',
  },
  trust_observability: {
    key: 'trust_observability',
    pillar: 'ai_in_workflow',
    title: 'Trust & Observability',
    description:
      'Teams monitor AI agent actions with the same rigour as production services — tracking accuracy rates, false positive rates, and downstream impact on developer workflows. Trust is built through gradual autonomy: start with AI suggestions that humans approve, measure accuracy over weeks, and progressively expand autonomous scope only as confidence data supports it. Dashboards show AI action volume, acceptance rates, and error rates per workflow.',
    examples: [
      'Acceptance rate tracking — measure what percentage of AI suggestions developers actually accept; target >80% before expanding autonomy',
      'Gradual autonomy ramps — week 1: AI suggests, human acts; week 4: AI acts, human reviews post-hoc; week 8: AI acts autonomously for proven low-risk categories',
      'AI action dashboards — Langfuse or LangSmith showing action volume, latency, error rate, and cost per AI workflow',
      'Rollback capabilities — every AI action must be reversible; if an agent makes a bad commit, auto-revert mechanisms trigger immediately',
      'Weekly AI accuracy reviews — teams review a sample of AI actions to calibrate trust levels and adjust autonomy boundaries',
    ],
    dimensionInputs: ['capTpObservability', 'vsFoundationsObservability'],
    dependencies: ['signal_response_design'],
    defaultHorizon: 'h3',
  },
  security_access_control: {
    key: 'security_access_control',
    pillar: 'ai_in_workflow',
    title: 'Security & Access Control',
    description:
      'AI agents operate under least-privilege principles with isolated sandboxes, restricted network access, and explicit permission scopes. Prompt injection defence is architectural, not a filter: input validation on all data sources, behavioural monitoring for anomalous patterns, and outbound network allowlists. Indirect prompt injection (malicious instructions embedded in documents the agent processes) is the dominant threat vector, requiring system-level defences.',
    examples: [
      'Sandboxed execution environments — agents run in containers with restricted filesystem access, no root privileges, and outbound network allowlists (NVIDIA guidance)',
      'Least-privilege tool scoping — agents get access only to specific repos and API endpoints, with time-limited tokens that expire after task completion',
      'Prompt injection defence layers — input sanitisation, behavioural anomaly detection integrated with SIEM, and canary tokens in sensitive documents',
      'OWASP AI Agent Security Cheat Sheet — comprehensive checklist covering tool sandboxing, goal-lock mechanisms, human-in-the-loop triggers, and output validation',
      'Secret scanning for AI context — ensure instruction files and agent context never contain credentials, API keys, or PII; automated scanning in CI',
    ],
    dimensionInputs: ['capGeSecurity', 'capGeCompliance'],
    dependencies: ['governance_boundaries'],
    defaultHorizon: 'h2',
  },

  // ── Pillar 4: Quality, Testing & Review ───────────────────────────────

  ai_test_generation: {
    key: 'ai_test_generation',
    pillar: 'quality_testing',
    title: 'AI-Augmented Test Generation',
    description:
      'AI analyses codebases to generate comprehensive test suites covering not just happy paths but edge cases and boundary conditions that human testers overlook. Mutation testing validates test suite quality by generating code mutants and verifying tests catch them — shifting from "do we have coverage?" to "do our tests actually catch bugs?" The test suite becomes the specification for agentic development: tests define the contract, the agent implements to satisfy it.',
    examples: [
      'Qodo (CodiumAI) — generates unit and integration tests from code context, specifically targeting edge cases, boundary conditions, and error paths humans typically skip',
      'Mutation testing with AI — Stryker-style mutant generation verifying your test suite catches real bugs, not just achieves line coverage numbers',
      'Agentic test exploration — AI agents that autonomously navigate applications, discovering interaction paths and edge cases humans overlook',
      'Property-based test generation — AI identifies invariants in code and generates property-based tests exercising wide input spaces rather than specific examples',
      'Test intent preservation — AI generates tests that encode business requirements as executable specifications, creating living documentation of expected behaviour',
    ],
    dimensionInputs: ['vsDeliveryQuality', 'capGeQualityGates'],
    dependencies: ['agentic_engineering'],
    defaultHorizon: 'h2',
  },
  automated_code_review_ci: {
    key: 'automated_code_review_ci',
    pillar: 'quality_testing',
    title: 'Automated Code Review in CI',
    description:
      'CI pipelines run a layered quality stack: formatters and linters for style, SAST/SCA for security, and AI reviewers for logic and design. AI reviewers post comments with rationale, suggested fixes, and links to relevant documentation — not opaque pass/fail signals. The key metric is signal quality: studies show 38.7% of AI review comments lead to additional code fixes, demonstrating real value when properly tuned.',
    examples: [
      'GitHub Copilot code review — automated PR review understanding code context, suggesting improvements with explanations, integrated directly into the PR workflow',
      'Semgrep + AI autofix — unified SAST, SCA, and secrets scanning with AI-generated fix suggestions that developers accept with one click',
      'CodeRabbit / Qodo Merge — AI review bots providing contextual feedback on PR diffs, focusing on logic errors, performance issues, and security concerns',
      'Custom review policies — configure AI reviewers to enforce org-specific rules (e.g., "all database queries must filter by tenantId first")',
      'Review quality dashboards — track AI comment acceptance rates, time-to-resolution, and false positive rates to continuously tune reviewer sensitivity',
    ],
    dimensionInputs: ['capTpCiCd', 'vsDeliveryQuality'],
    dependencies: ['ai_ready_cicd'],
    defaultHorizon: 'h2',
  },
  quality_measurement: {
    key: 'quality_measurement',
    pillar: 'quality_testing',
    title: 'Quality Measurement & Feedback',
    description:
      'Organisations measure AI\'s impact on code quality through defect escape rates, mean time to detect regressions, code churn on AI-generated files, and cognitive comprehensibility indicators. Teams track whether AI-generated code requires more downstream maintenance — measuring the full cost, not just the initial velocity gain. The rework ratio (percentage of AI-generated PRs requiring follow-up fixes within 7 days) is the most honest quality signal.',
    examples: [
      'Defect density tracking by authorship — compare defect rates in AI-generated versus human-written code; investigate if AI code shows higher post-merge bug rates',
      'Code churn analysis — CodeScene-style analysis showing whether AI-generated files are modified more frequently post-merge, indicating lower initial quality',
      'Cognitive debt surveys — periodic team assessments asking "Rate your understanding of the codebase from 1-5" tracked over time as AI adoption increases',
      'DORA metrics correlation — measure whether AI tool adoption actually improves deployment frequency, lead time, change failure rate, and MTTR at the team level',
      'Rework ratio — percentage of AI-generated PRs requiring follow-up fixes within 7 days of merge',
    ],
    dimensionInputs: ['vsValidationMetrics', 'vsValidationDecisions'],
    dependencies: ['ai_test_generation', 'automated_code_review_ci'],
    defaultHorizon: 'h3',
  },
  security_scanning: {
    key: 'security_scanning',
    pillar: 'quality_testing',
    title: 'Security Scanning & Vulnerability Detection',
    description:
      'AI-native security scanners use LLMs to parse code semantically and reason about control and data flows across files, catching vulnerabilities that rule-based engines miss. Best practice combines SAST (inside-out code analysis), DAST (outside-in runtime testing), and SCA (dependency analysis) in a unified pipeline. The acceleration of code generation through AI demands proportionally increased security vigilance — more code surface area means more attack surface.',
    examples: [
      'Semgrep — unified SAST, SCA, and secrets scanning with semantic code understanding and AI-powered autofix; the current standard for modern AppSec pipelines',
      'Snyk + AI remediation — dependency vulnerability detection with AI-generated fix PRs that update packages and resolve breaking changes automatically',
      'CodeQL (GitHub Advanced Security) — deep semantic analysis finding security vulnerabilities across code paths, integrated into GitHub Actions',
      'AI-powered DAST — runtime testing achieving 99.98% accuracy with scans significantly faster than traditional tools; critical because SAST alone cannot find deployment-configuration vulnerabilities',
      'Supply chain security — AI analysis of transitive dependency risks, detecting malicious packages and typosquatting in real-time',
    ],
    dimensionInputs: ['capGeSecurity', 'capGeCompliance'],
    dependencies: ['ai_ready_cicd'],
    defaultHorizon: 'h2',
  },

  // ── Pillar 5: Delivery & Operations ───────────────────────────────────

  ai_ready_cicd: {
    key: 'ai_ready_cicd',
    pillar: 'delivery_ops',
    title: 'AI-Ready CI/CD',
    description:
      'CI/CD pipelines include AI quality gates that consider context, risk, and historical patterns rather than binary pass/fail thresholds. AI generates release notes from commit history and PR descriptions, predicts deployment risk based on change scope and historical failure rates, and recommends deployment strategies. The shift is from "did tests pass?" to "is this change safe to ship given everything we know?"',
    examples: [
      'AI quality gates — deployment gates weighing test coverage, security scan results, code complexity delta, and historical failure patterns before approving release',
      'Automated release notes — AI generates structured changelogs from PR descriptions, commit messages, and linked issues; humans review rather than draft from scratch',
      'Deployment risk scoring — AI scores each deployment based on lines changed, services affected, time of day, and recent incident history',
      'Intelligent rollback — AI monitors canary deployments and auto-triggers rollback when anomaly detection fires on latency, error rate, or business metrics',
      'Pipeline optimisation — AI identifies slow or flaky tests, recommends parallelisation strategies, and predicts which tests are most likely to fail for a given changeset',
    ],
    dimensionInputs: ['capTpCiCd', 'vsDeliveryRelease'],
    dependencies: ['developer_tooling'],
    defaultHorizon: 'h1',
  },
  ai_ready_infra: {
    key: 'ai_ready_infra',
    pillar: 'delivery_ops',
    title: 'AI-Ready Infrastructure',
    description:
      'Platform engineering teams provide self-service infrastructure with AI-native capabilities baked in: ephemeral preview environments spin up automatically for every PR, IaC templates include GPU allocation and model serving configuration, and internal developer platforms expose service metadata as AI-readable context. The convergence of platform engineering and AI — "agentic developer platforms" — is the defining infrastructure trend.',
    examples: [
      'Ephemeral preview environments — every PR gets a full-stack preview with AI features enabled, torn down automatically after merge (Vercel, Railway, Render patterns)',
      'IaC templates with AI workload support — Terraform/Pulumi modules pre-configured for GPU instances, model serving, vector databases, and auto-scaling policies',
      'Internal Developer Platforms as context — Backstage/Port catalogs where AI agents discover services, read documentation, and understand dependency graphs',
      'Platform-as-context — service metadata, architecture diagrams, and runbooks exposed in formats AI agents can consume when generating code',
      'Cost-aware provisioning — infrastructure templates with embedded cost guardrails for AI workloads including GPU spot instance strategies and spend alerting',
    ],
    dimensionInputs: ['capTpCiCd', 'capTpGoldenPaths', 'vsDeliveryRelease'],
    dependencies: ['ai_ready_cicd'],
    defaultHorizon: 'h2',
  },
  ai_observability: {
    key: 'ai_observability',
    pillar: 'delivery_ops',
    title: 'Observability & Monitoring',
    description:
      'Comprehensive observability spans all deployed applications and infrastructure — from traditional APM (distributed tracing, metrics, logs) through to AI-specific telemetry (token usage, model latency, prompt quality). Mature teams treat observability as a first-class product: every service ships with structured logging, distributed tracing, and health dashboards from day one. AI workloads add new dimensions — cost-per-call, response quality scoring, and drift detection — but these layer on top of, not replace, foundational monitoring.',
    examples: [
      'Full-stack APM — Datadog, New Relic, or Grafana stack providing distributed tracing, metrics, and log correlation across all services and infrastructure',
      'Structured logging standards — consistent log formats with correlation IDs, request context, and severity levels across every service, queryable in real time',
      'AI-specific telemetry — Langfuse/LangSmith tracing every model call with latency, token usage, cost, and quality scores layered alongside application traces',
      'SLO-driven alerting — service level objectives with error budgets driving alerts rather than arbitrary thresholds; teams own their reliability targets',
      'Cost observability — dashboards showing infrastructure and AI spend per team, per feature, per environment with trend lines and budget alerts',
    ],
    dimensionInputs: ['capTpObservability', 'vsFoundationsObservability', 'capGeCostManagement'],
    dependencies: [],
    defaultHorizon: 'h2',
  },
  incident_response: {
    key: 'incident_response',
    pillar: 'delivery_ops',
    title: 'Incident Response & Remediation',
    description:
      'AIOps platforms correlate alerts across infrastructure layers, reduce alert noise by 80-90%, and surface causal relationships revealing how an incident in one component triggers cascading failures. Automated root cause analysis replaces manual log-combing, with AI presenting probable causes ranked by confidence alongside suggested remediation steps. Combining observability with AIOps cuts MTTR by up to 50%.',
    examples: [
      'BigPanda / PagerDuty AIOps — cross-cloud alert correlation collapsing thousands of alerts into actionable incidents with AI-generated root cause hypotheses',
      'AI-powered postmortems — agents that compile incident timelines, contributing factors, and remediation actions from incident channels, logs, and metrics automatically',
      'Runbook automation — AI matches incidents to historical patterns and executes pre-approved remediation runbooks for known failure modes',
      'Slack-integrated RCA bots — post an incident thread, AI agent queries observability stack and posts a preliminary root cause analysis within minutes',
      'Predictive incident prevention — AI identifies degradation patterns (memory leaks, connection pool exhaustion, disk pressure) before they cause outages',
    ],
    dimensionInputs: ['vsFoundationsObservability', 'capWowDecisionMaking'],
    dependencies: ['ai_observability'],
    defaultHorizon: 'h3',
  },

  // ── Pillar 6: Foundations & Governance ─────────────────────────────────

  ai_policy_compliance: {
    key: 'ai_policy_compliance',
    pillar: 'foundations_governance',
    title: 'AI Policy & Compliance',
    description:
      'Organisations adopt a dual-framework approach mapping ISO/IEC 42001 (certifiable AI management system) controls to NIST AI RMF (risk management framework) functions, ensuring both auditable compliance and practical risk management. Every AI deployment in the SDLC includes automated audit trails linking decisions to source data. Governance is the strongest predictor of AI success — two-thirds of organisations with robust governance meet their AI targets.',
    examples: [
      'ISO/IEC 42001 certification — the international standard for AI management systems providing auditable, third-party-certifiable compliance',
      'NIST AI RMF implementation — four-function framework (Govern, Map, Measure, Manage) applied specifically to software development AI tools',
      'Acceptable use policies — clear guidelines on what AI tools can be used, what data can be shared, what outputs require human review, and what is prohibited',
      'Audit trail infrastructure — every AI action logged with trigger, context provided, action taken, outcome, and human reviewer identity where applicable',
      'Quality gates from pilot to production — structured progression framework requiring demonstrated safety, accuracy, and value before expanding AI tool scope',
    ],
    dimensionInputs: ['capGeCompliance', 'capEiRegulatory', 'vsFoundationsGovernance'],
    dependencies: [],
    defaultHorizon: 'h1',
  },
  data_knowledge_infra: {
    key: 'data_knowledge_infra',
    pillar: 'foundations_governance',
    title: 'Data & Knowledge Infrastructure',
    description:
      'Enterprise RAG has evolved from simple document retrieval to a "knowledge runtime" — an orchestration layer managing retrieval, verification, access control, and audit trails as integrated operations. Data governance for AI addresses the curation, structuring, and accessibility of knowledge used across the SDLC. Production-grade knowledge infrastructure demands granular safety controls, enterprise-grade governance, and CI/CD-style quality gates for knowledge pipelines.',
    examples: [
      'RAG pipelines with CI/CD quality gates — automated evaluation of retrieval accuracy, relevance scoring, and answer quality before deploying knowledge updates',
      'Context engine platforms — RAGFlow-style systems providing intelligent context assembly handling documents, code, APIs, and structured data with access control',
      'Knowledge base governance — automated freshness checks, source attribution, per-document access control, and bias detection in retrieval ranking',
      'CLAUDE.md as knowledge infrastructure — project-level instruction files serving as curated, version-controlled context for AI agents; the simplest effective form of knowledge engineering',
      'Ingestion pipelines — enterprise-grade processing of unstructured data (documents, code, Slack, wiki) into AI-indexable formats with metadata and provenance',
    ],
    dimensionInputs: ['capGeDataGovernance', 'vsFoundationsKnowledge'],
    dependencies: [],
    defaultHorizon: 'h1',
  },
  ai_finops: {
    key: 'ai_finops',
    pillar: 'foundations_governance',
    title: 'FinOps & Cost Management',
    description:
      'Engineering cost management spans all infrastructure — cloud compute, storage, networking, SaaS tooling, and AI/LLM spend — treated as a unified FinOps discipline. Mature organisations have real-time visibility into cost-per-team, cost-per-service, and cost-per-feature across every layer, with automated guardrails preventing uncontrolled growth. AI adds a new variable cost dimension (token-based, usage-driven) on top of traditional cloud spend, requiring the same rigour applied to any other infrastructure cost.',
    examples: [
      'Cloud cost attribution — tagging all infrastructure (compute, storage, networking) by team, service, and environment with dashboards showing unit economics',
      'Budget guardrails — hard spend limits per team/project/environment with automated alerts at 50%, 75%, 90% thresholds; prevent runaway costs across cloud and AI',
      'AI token-level tracking — tag every LLM call with team, feature, and environment; model routing to cheaper models for simple tasks, expensive ones for complex work',
      'FinOps practice — dedicated FinOps function or embedded champions applying the FinOps Foundation lifecycle (Inform, Optimise, Operate) across all engineering spend',
      'Reserved capacity and spot strategies — commitment-based discounts for predictable workloads, spot/preemptible instances for batch processing, prompt caching for AI cost reduction',
    ],
    dimensionInputs: ['capGeCostManagement', 'capEiVendorAlignment'],
    dependencies: [],
    defaultHorizon: 'h2',
  },
  change_management: {
    key: 'change_management',
    pillar: 'foundations_governance',
    title: 'Change Management & Culture',
    description:
      'The biggest barrier to scaling AI in the SDLC is not engineer resistance but leadership inertia. Over 90% of engineering teams now use AI coding tools, but unlocking full value demands intentional measurement, structured enablement, and cultural investment. Successful organisations frame AI as role evolution — from implementer to orchestrator — not replacement, and provide formal training that reduces anxiety and builds genuine capability.',
    examples: [
      'Leadership alignment workshops — executives experience AI-assisted development firsthand to understand capabilities and limitations before setting strategy',
      'Role evolution narratives — explicit communication that engineering roles shift toward architectural oversight, quality assurance, and problem definition',
      'Measurement-driven adoption — track not just tool usage but outcome improvements (cycle time, defect rates, developer satisfaction) to demonstrate value and justify investment',
      'Managing AI anxiety — proactive programmes addressing automation fears through transparency about which tasks change versus which roles are affected',
      'Community of practice — cross-team forums where engineers share patterns, failures, and learnings; organic knowledge-sharing more effective than top-down mandates',
    ],
    dimensionInputs: [
      'capScChangeReadiness',
      'capScLearning',
      'capScLeadership',
      'capPsRoleEvolution',
      'capPsTalentStrategy',
      'capEiStakeholderLiteracy',
    ],
    dependencies: [],
    defaultHorizon: 'h1',
  },
} as const

// =============================================================================
// HELPER CONSTANTS
// =============================================================================

/** Ordered list of all pillar keys */
export const AIVA_ENABLEMENT_PILLAR_KEYS: AIVAEnablementPillar[] = [
  'discovery_design',
  'agentic_coding',
  'ai_in_workflow',
  'quality_testing',
  'delivery_ops',
  'foundations_governance',
]

/** Ordered list of all work stream keys */
export const AIVA_ENABLEMENT_WORK_STREAM_KEYS: AIVAEnablementWorkStream[] =
  AIVA_ENABLEMENT_PILLAR_KEYS.flatMap(
    pillar => AIVA_ENABLEMENT_PILLARS[pillar].workStreams
  )

/** Get work streams for a pillar */
export function getWorkStreamsForPillar(
  pillar: AIVAEnablementPillar
): AIVAEnablementWorkStreamDef[] {
  return AIVA_ENABLEMENT_PILLARS[pillar].workStreams.map(
    key => AIVA_ENABLEMENT_WORK_STREAMS[key]
  )
}

/** Get pillar definition for a work stream */
export function getPillarForWorkStream(
  workStream: AIVAEnablementWorkStream
): AIVAEnablementPillarDef {
  const def = AIVA_ENABLEMENT_WORK_STREAMS[workStream]
  return AIVA_ENABLEMENT_PILLARS[def.pillar]
}

// =============================================================================
// API TYPES
// =============================================================================

/** Enablement program as returned by the API */
export interface AIVAEnablementProgram {
  id: string
  tenantId: string
  assessmentId: string
  pillar: AIVAEnablementPillar
  workStream: AIVAEnablementWorkStream
  title: string
  description: string
  status: AIVAEnablementStatus
  gapSeverity: AIVAEnablementGapSeverity
  priority: AIVAEnablementPriority
  horizon: AIVAEnablementHorizon
  timingOverride: 'now' | 'next' | 'later' | null
  owner: string | null
  startDate: string | null
  targetDate: string | null
  progress: number
  confidence: AIVAEnablementConfidence
  metrics: Record<string, unknown> | null
  dependencies: string[] | null
  aiRecommendation: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

/** Enablement action within a program */
export interface AIVAEnablementAction {
  id: string
  tenantId: string
  programId: string
  title: string
  description: string | null
  status: AIVAEnablementActionStatus
  effort: AIVAEnablementActionEffort | null
  aiGenerated: boolean
  assignee: string | null
  dueDate: string | null
  evidence: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

/** Radar data point for visualization */
export interface AIVAEnablementRadarPoint {
  workStream: AIVAEnablementWorkStream
  pillar: AIVAEnablementPillar
  title: string
  status: AIVAEnablementStatus
  gapSeverity: AIVAEnablementGapSeverity
  priority: AIVAEnablementPriority
  horizon: AIVAEnablementHorizon
  confidence: AIVAEnablementConfidence
  progress: number
  hasOwner: boolean
}

/** Summary of enablement programs for an assessment */
export interface AIVAEnablementSummary {
  assessmentId: string
  totalPrograms: number
  byStatus: Record<AIVAEnablementStatus, number>
  byGapSeverity: Record<AIVAEnablementGapSeverity, number>
  byPriority: Record<AIVAEnablementPriority, number>
  byHorizon: Record<AIVAEnablementHorizon, number>
  byPillar: Record<
    AIVAEnablementPillar,
    { total: number; criticalGaps: number; minorGaps: number }
  >
}

// =============================================================================
// AI ANALYSIS TYPES
// =============================================================================

/** AI-generated analysis for a single work stream */
export interface AIVAEnablementAnalysisItem {
  workStream: AIVAEnablementWorkStream
  contextualAnalysis: string
  gapSeverity: AIVAEnablementGapSeverity
  rationale: string
  suggestedActions: Array<{
    title: string
    description: string
    effort: AIVAEnablementActionEffort
  }>
}

/** Full AI analysis result for all work streams */
export interface AIVAEnablementAnalysisResult {
  workStreams: AIVAEnablementAnalysisItem[]
  generatedAt: string
  model: string
}
