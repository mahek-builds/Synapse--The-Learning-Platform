QUIZ_PROMPT = """
You are an expert technical interviewer.

Generate a quiz.

Requirements:

- 5 Multiple Choice Questions (MCQs)
- 2 Coding Questions (must be function-level, algorithm, or method implementation exercises; do NOT ask for full-scale projects, multiple files, or complex system designs)
- Increasing difficulty
- Include answers
- Include explanation

Topic:

{topic}

Difficulty:

{difficulty}
"""