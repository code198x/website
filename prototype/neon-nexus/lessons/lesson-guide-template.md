# LESSON GUIDE TEMPLATE

## Structure for Each Lesson

### 1. Opening Hook (2-3 paragraphs)

- Connect to gaming history or personal experience
- Explain why this concept matters
- Preview what we'll build

### 2. Code Walkthrough (3-5 sections)

- Introduce new concepts with small code chunks (10-20 lines max)
- Explain each chunk immediately after showing it
- Build up to the complete implementation

### 3. Interactive Elements

- **Experiment 1**: Simple parameter tweaking
- **Experiment 2**: Behavior modification
- **Experiment 3**: Creative extension

### 4. Deep Dive (1-2 technical topics)

- Explain the "why" behind the implementation
- Compare to modern techniques
- Show memory layouts or timing diagrams

### 5. Challenge Extensions (3-4 challenges)

- Ordered by difficulty
- Include hints but not full solutions
- Connect to real game features

### 6. Common Pitfalls

- 3-4 typical mistakes
- Why they happen
- How to avoid them

### 7. Next Steps

- Tease the next lesson
- Pose an intriguing question
- Create anticipation

## Key Principles

1. **Show, Don't Tell**: Code first, explanation second
2. **Historical Context**: Reference real C64 games
3. **Incremental Complexity**: Each concept builds on the last
4. **Hands-On Learning**: Experiments in every lesson
5. **Debugging Stories**: Share the bugs and how to fix them
6. **Performance Awareness**: Always consider CPU/memory impact

## Code Presentation Style

```assembly
; Clear, descriptive comments
lda player_x    ; Current position
clc
adc #1          ; Move right
sta player_x    ; Save new position
```

Not:

```assembly
; Move player
lda player_x
clc
adc #1
sta player_x
```

## Tone Guidelines

- Conversational but not casual
- Technically accurate but accessible
- Encouraging about mistakes ("That's a feature!")
- Historical reverence without nostalgia overload
