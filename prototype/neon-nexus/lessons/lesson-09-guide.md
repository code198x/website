# Lesson 9: Enemy Collision Detection

## Opening Hook

In our last lesson, we had multiple objects moving on screen - the player and an enemy. But they passed right through each other like ghosts! Time to make our game world feel real by detecting when objects collide.

Remember those classic arcade moments when your ship explodes on contact? That split-second recognition of danger? We're about to recreate that magic using just a few clever checks.

## Code Walkthrough

### Setting Up Collision State

First, we need a way to track whether a collision has occurred:

```assembly
collision_flag: !byte 0
```

This simple byte will control our collision response. When it's zero, the game runs normally. When it's non-zero, we freeze movement and flash the border.

### The Collision Check

Here's where the magic happens - checking if two objects occupy the same space:

```assembly
check_collisions:
    ; Check if X positions are the same
    lda player_x
    cmp enemy_x
    bne no_collision
    
    ; Check if Y positions are the same
    lda player_y
    cmp enemy_y
    bne no_collision
    
    ; Collision detected!
    lda #30         ; Stop movement for 30 frames
    sta collision_flag
```

Notice how simple this is? We just compare positions. If both X and Y match, we have a collision!

### Visual Feedback

When a collision occurs, we need to tell the player immediately:

```assembly
    ; Flash border white
    lda #$01        ; White
    sta $d020       ; Border color register
    
    ; Decrement lives
    dec lives
    beq game_over   ; No lives left?
```

The white border flash is instant feedback. The player knows they've been hit without even looking at the score.

### The Hidden Bug

Here's a secret: our collision detection has a bug! Since both objects move one space at a time, they can "step over" each other if they're moving toward each other at the same speed.

Try it: position the player and enemy so they're one space apart, moving toward each other. They'll pass right through! We'll fix this in lesson 13, but for now, it's a quirk that adds character to our retro game.

## Interactive Elements

### Experiment 1: Collision Timing
Change the collision freeze duration:
```assembly
lda #30  ; Try 10, 60, or 120 instead
```
How does this affect gameplay feel?

### Experiment 2: Different Feedback
Instead of a white flash, try:
- Yellow (#$07) for a warning feel
- Cyan (#$03) for a shield effect
- Multiple colors in sequence

### Experiment 3: Collision Zone
What if we detected "near misses"? Add this after the exact position check:
```assembly
    ; Check if within 1 space
    lda player_x
    sec
    sbc enemy_x
    cmp #2
    bcs no_collision  ; Too far apart
```

## Deep Dive: Why Exact Matching Fails

In real arcade games, collision detection often uses "bounding boxes" - invisible rectangles around objects. Our current system only checks exact positions, which means:

1. Objects moving at the same speed can pass through each other
2. Diagonal movement would never collide
3. Different-sized objects can't be properly detected

This is why many C64 games used hardware sprite collision detection (which we'll explore in lesson 14) or more sophisticated software checks.

## Challenge Extensions

1. **Invincibility Frames**: After a collision, make the player invincible for a short time (hint: use collision_flag to skip checks)

2. **Score on Dodge**: Award points when the enemy passes without hitting (track enemy X position wrapping)

3. **Collision Counter**: Display total hits on screen (add a hit counter variable)

4. **Different Collision Effects**: Make each life loss have a different visual effect

## Common Pitfalls

- **Forgetting to Reset**: Make sure collision_flag decrements, or you'll be stuck forever!
- **Multiple Collisions**: Our current code can register multiple hits per frame
- **Border Color Conflicts**: Other code might change the border color while we're flashing

## Next Steps

In lesson 10, we'll add multiple enemies. But here's the question: how do we check collisions with three enemies efficiently? And what happens when two enemies collide with the player simultaneously?

The solution involves a clever trick with the 6502's branching instructions...