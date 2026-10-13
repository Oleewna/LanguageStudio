# Implementation Index

This file shows the recommended implementation order only. It does not include real-time estimates or calendar scheduling.

## Recommended order

1. [MULTI_COURSE_PLAN.md](MULTI_COURSE_PLAN.md)
   - Foundation: architecture, data structure, shared layout, and storage model.

2. [COMMUNICATION_BASICS_IMPLEMENTATION.md](COMMUNICATION_BASICS_IMPLEMENTATION.md)
   - First real learner-facing course content.

3. [ICON_SYSTEM_PLAN.md](ICON_SYSTEM_PLAN.md)
   - Visual cleanup and icon standardization after the shared layout is stable.

4. [ITALIAN_READING_PATH_IMPLEMENTATION.md](ITALIAN_READING_PATH_IMPLEMENTATION.md)
   - Second learning path built on the same course engine.

5. [PROGRESS_AND_MOTIVATION.md](PROGRESS_AND_MOTIVATION.md)
   - Progress, streak, XP, and motivation system after the content model is in place.

## Dependency summary

- [MULTI_COURSE_PLAN.md](MULTI_COURSE_PLAN.md) is the base layer.
- [COMMUNICATION_BASICS_IMPLEMENTATION.md](COMMUNICATION_BASICS_IMPLEMENTATION.md) depends on the multi-course structure.
- [ICON_SYSTEM_PLAN.md](ICON_SYSTEM_PLAN.md) depends on the shared layout and page structure.
- [ITALIAN_READING_PATH_IMPLEMENTATION.md](ITALIAN_READING_PATH_IMPLEMENTATION.md) depends on the course engine and lesson data model.
- [PROGRESS_AND_MOTIVATION.md](PROGRESS_AND_MOTIVATION.md) depends on the stable progress/content data model.

## Final order

[MULTI_COURSE_PLAN.md](MULTI_COURSE_PLAN.md) ->
[COMMUNICATION_BASICS_IMPLEMENTATION.md](COMMUNICATION_BASICS_IMPLEMENTATION.md) ->
[ICON_SYSTEM_PLAN.md](ICON_SYSTEM_PLAN.md) ->
[ITALIAN_READING_PATH_IMPLEMENTATION.md](ITALIAN_READING_PATH_IMPLEMENTATION.md) ->
[PROGRESS_AND_MOTIVATION.md](PROGRESS_AND_MOTIVATION.md)
