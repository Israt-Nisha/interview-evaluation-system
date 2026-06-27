                    User
     ┌──────────────────────────────────┐
     │ id                               │
     │ role                             │
     └──────────────────────────────────┘
           │
           │ creates
           ▼
      Candidate
           │
           │ 1 : N
           ▼
   InterviewSession
           │
           │ 1 : 0..1
           ▼
      Evaluation
           │
           │ 1 : N
           ▼
   EvaluationScore
           ▲
           │
           │ N : 1
           │
   RubricCriterion