# Exposure-Response Evidence Scope Rules

## Purpose

This knowledge block defines evidence-boundary rules for determining whether exposure-response (ER) information is actually available, merely mentioned, cited from another source, absent, or not assessable.

It is designed to prevent the agent from converting a brief mention of ER into a full ER-supported dose justification.

## Regulatory and scientific basis

FDA exposure-response guidance states that ER information can be used in regulatory decision-making, study design, analysis strategy, development planning, and reporting. However, the guidance also implies that ER conclusions depend on explicit study design, data analysis, exposure metrics, response endpoints, model assumptions, uncertainty, and interpretation.

FDA Population Pharmacokinetics guidance recognizes that PopPK can quantify intrinsic and extrinsic covariate effects on exposure, and that PopPK evidence can support drug-use decisions when appropriately modeled, evaluated, documented, and linked to the clinical question.

Therefore, a dose recommendation may be primarily PopPK-supported, ER-supported, or supported by an integrated MIDD package. The agent must first identify what evidence is actually presented before drafting regulatory-style language.

## Evidence scope categories

The agent must classify ER evidence into one of the following categories.

### 1. ER presented in detail

Use this category only if the input includes most of the following:

- Response endpoint, such as ORR, PFS, OS, biomarker response, toxicity, adverse event, or laboratory abnormality.
- Exposure metric, such as AUC, Cmax, Ctrough, Cmin, Cavg, early exposure, or steady-state exposure.
- Analysis population and sample size.
- Statistical or modeling method, such as logistic regression, Cox model, Emax model, time-to-event model, linear model, or categorical analysis.
- Covariates or confounders considered.
- Results, including effect estimates, curves, p-values, confidence intervals, hazard ratios, odds ratios, or model parameters.
- Interpretation of the relationship between exposure and efficacy or safety.

If these details are present, ER may be considered direct evidence, but the agent should still assess quality, confounding, reverse causality, metric selection, uncertainty, and external validity.

### 2. ER briefly mentioned but not presented

Use this category when the material says phrases such as:

- "Exposure-response analysis was conducted" but provides no results.
- "ER analysis supported the dose" without endpoints or model details.
- "No clear exposure-response relationship was observed" without exposure metric, response endpoint, model, or uncertainty.
- "ER data were considered" but not shown.
- "Exposure-response evidence is supportive" without traceable evidence.

This category means ER cannot be used as direct support in the current review. It may be treated only as supportive context or as a limitation.

### 3. ER absent

Use this category when the input contains no meaningful ER information.

If ER is absent, the agent must not create ER-based language. The dose argument should rely only on the evidence actually presented, such as PopPK covariate effects, simulated exposure distributions, safety margins, clinical dose range, or other available evidence.

### 4. ER cited from another document

Use this category when the material refers to another ER report, publication, submission module, or analysis but does not provide enough details for assessment.

In this case, the agent should state that ER cannot be directly evaluated from the current material and should request cross-reference, summary, or key ER outputs.

### 5. ER not assessable

Use this category when the input is too short, ambiguous, fragmented, or poorly extracted.

The agent should not infer ER support.

## Hard rule

Do not infer the existence of a detailed ER analysis from a single sentence.

A statement that "ER was considered" or "no ER relationship was observed" is not sufficient to claim that ER supports dose selection.

## Required evidence for ER-supported dose justification

A dose justification may be described as ER-supported only if the material provides:

1. Exposure metric selection and rationale
2. Response endpoint definition
3. Analysis population
4. Modeling or statistical method
5. Results and uncertainty
6. Assessment of confounding
7. Clinical interpretation
8. Link to the proposed dose decision

If these elements are not available, ER should not be the main basis of the regulatory wording.

## Common ER over-claiming patterns

Flag the following:

- "ER supports no dose adjustment" when only PopPK data are shown.
- "Exposure is within the efficacious range" without defining the range.
- "No exposure-safety relationship" without event counts or exposure distribution.
- "Exposure-response analysis showed no relationship" without metric, endpoint, method, or uncertainty.
- "Higher exposure improves efficacy" without accounting for disease status, time-varying clearance, response-related clearance changes, or survival bias.
- "ER supports extrapolation" when simulated exposures exceed the observed exposure range.

## Special caution: oncology biologics and early exposure

For oncology biologics, ER analyses can be confounded by disease severity, response-related changes in clearance, survival bias, and time-varying clearance. When later-cycle exposure is used, the agent should consider whether exposure is partly a consequence of response rather than only a cause of response.

If the submitted material uses early-cycle exposure, such as cycle 1 trough or cycle 1 AUC, the agent should assess whether the rationale is stated. Early exposure may reduce response-driven bias, but this must be justified rather than assumed.

## Scope-aware output rules

### If ER is presented in detail

The agent may write:

"The dose justification is supported by both PopPK covariate analysis and exposure-response evidence, provided that the exposure-response model is appropriately specified, uncertainty is acceptable, and the simulated exposure distributions remain within the observed exposure range used to characterize efficacy and safety."

### If ER is briefly mentioned but not presented

The agent should write:

"Exposure-response analysis is mentioned but not presented in sufficient detail for direct assessment. Therefore, ER should be treated as supportive context or a limitation only, and the dose-adjustment conclusion should be framed primarily around the PopPK and simulation evidence actually provided."

### If ER is absent

The agent should write:

"No detailed exposure-response analysis is available in the current material. The dose-adjustment conclusion should therefore not be described as ER-supported. Instead, the report should rely on PopPK covariate effects, exposure simulations, clinical relevance thresholds, and uncertainty assessment."

### If ER is cited elsewhere

The agent should write:

"The current material cites exposure-response evidence but does not provide sufficient detail to evaluate it. The report should cross-reference the ER analysis and summarize the key endpoints, exposure metrics, model results, and uncertainty if ER is intended to support dose selection."

## Issue-matrix template

### Issue

Exposure-response evidence is not available for direct assessment in the current material.

### Severity

Major if the dose conclusion relies on ER support; Minor if ER is clearly described as outside scope.

### Evidence location

Identify the exact sentence where ER is mentioned, cited, or implied.

### Why it matters

A regulatory-style dose justification should not imply that ER evidence supports the conclusion unless ER endpoints, exposure metrics, model methods, results, and uncertainty are actually presented or appropriately cross-referenced.

### Required evidence

- Endpoint definition
- Exposure metric
- Model or statistical method
- Analysis population and sample size
- Results and uncertainty
- Clinical interpretation
- Link to dose decision

### Suggested revision

"Exposure-response analysis was not presented in sufficient detail in the current package. Accordingly, the no-dose-adjustment conclusion should be framed primarily as supported by PopPK covariate analysis and exposure simulations. ER evidence should be described as unavailable, limited, or supportive only if appropriate."

## Reviewer decision logic

1. If ER endpoints and exposure metrics are missing:
   - classify ER as absent or only mentioned.

2. If ER results are cited but not shown:
   - classify ER as cited from another document.

3. If ER is absent or only mentioned:
   - prohibit ER-supported wording.

4. If PopPK evidence is adequate:
   - allow PopPK-supported no-dose-adjustment wording.

5. If both PopPK and ER are presented:
   - assess consistency between PopPK simulations and ER exposure range.

## References

- U.S. Food and Drug Administration. *Exposure-Response Relationships — Study Design, Data Analysis, and Regulatory Applications*. May 2003. https://www.fda.gov/regulatory-information/search-fda-guidance-documents/exposure-response-relationships-study-design-data-analysis-and-regulatory-applications
- U.S. Food and Drug Administration. *Exposure-Response Relationships — Study Design, Data Analysis, and Regulatory Applications* PDF. https://www.fda.gov/media/71277/download
- U.S. Food and Drug Administration. *Population Pharmacokinetics: Guidance for Industry*. February 2022. https://www.fda.gov/regulatory-information/search-fda-guidance-documents/population-pharmacokinetics
- U.S. Food and Drug Administration. *Model-Informed Drug Development Paired Meeting Program*. https://www.fda.gov/drugs/development-resources/model-informed-drug-development-paired-meeting-program
- Madabushi R, et al. *Review: Role of Model-Informed Drug Development Approaches in the Lifecycle of Drug Development and Regulatory Decision-Making*. Clinical Pharmacology & Therapeutics. 2022. https://pmc.ncbi.nlm.nih.gov/articles/PMC9097888/
