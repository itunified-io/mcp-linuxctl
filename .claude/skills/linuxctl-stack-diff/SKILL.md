---
name: linuxctl-stack-diff
description: Read-only drift report across every host in a linuxctl stack. Aggregates per-manager drift into a single table. Never mutates.
slash_command: /linuxctl-stack-diff
argument_hint: <stack>
---

# /linuxctl-stack-diff `<stack>`

Produce a read-only drift report for every host in the named stack. No apply,
no rollback, no side effects.

## When to use

- Before `/linuxctl-stack-apply` — review what would change.
- Scheduled drift audits (DNS Agent / scheduled agents per ADR-0008).
- Investigating whether a host has been manually modified outside linuxctl.

## Steps

1. **Resolve the stack**
   - Call `linuxctl_stack_show` with `stack=<stack>` to get the host
     inventory and active layers. Abort if the stack is unknown.

2. **Collect diff per host**
   - For each host, call `linuxctl_diff` with `target=<host>`.
   - Also call `linuxctl_apply_plan` with `target=<host>` to capture the
     orchestrator-level planned changes for context.

3. **Aggregate by manager**
   - Build a table keyed by `(manager, host)` with counts:
     creates / updates / deletes / drifts.
   - Mark hosts with no drift as "clean".

4. **Report**
   - Print the aggregated table plus a per-host breakdown of the top 5 most
     significant drift items.
   - Emit an exit-style summary line:
     `diff: <stack> — <N>/<M> hosts drifting, <K> total drift items`.
   - Do **not** call any `_apply` / `_rollback` tool. This skill is strictly
     read-only.

## Failure modes

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| Host unreachable | SSH / network down | Skip the host, mark as "unknown" in the report. |
| `linuxctl_diff` returns error | Config validation failed | Run `linuxctl_config_validate` to surface the root cause. |
| Huge drift on a fresh host | Host never applied | This is expected — flag it clearly in the report. |

## Example

```
/linuxctl-stack-diff penzberg-north-uat
```

Expected report:

```
Stack: penzberg-north-uat (2 hosts)

Manager   | host-a | host-b
----------+--------+--------
package   |   1    |   0
service   |   0    |   2
hosts     |   0    |   1
(others)  |  clean |  clean

Summary: 2/2 hosts drifting, 4 drift items total.
```
