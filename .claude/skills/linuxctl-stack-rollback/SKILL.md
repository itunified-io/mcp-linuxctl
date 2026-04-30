---
name: linuxctl-stack-rollback
description: Double-confirmed rollback of the last apply on every host in a linuxctl stack. Destructive — reverses the most recent change set per host in reverse order.
slash_command: /linuxctl-stack-rollback
argument_hint: <stack>
---

# /linuxctl-stack-rollback `<stack>`

Undo the **last** `linuxctl apply` on every host in a stack. Executes in
**reverse host order** so the node that was applied last is rolled back first.

This is a destructive operation. Double confirmation is mandatory.

## When to use

- The last `/linuxctl-stack-apply` introduced a regression that needs to be
  reverted quickly across the whole stack.
- A broken upgrade left the stack in an inconsistent state.

Do **not** use this to "uninstall" a long-deployed stack — `apply_rollback`
only undoes the most recent change set.

## Steps

1. **Pre-flight**
   - Call `linuxctl_stack_show` with `stack=<stack>` to resolve the host
     inventory.
   - For each host, call `linuxctl_apply_verify` and capture current drift as
     a "pre-rollback baseline" in the report.

2. **First confirmation**
   - Present the operator with: stack name, host list, current drift
     summary, and the warning that `apply_rollback` is double-confirm in the
     Go binary.
   - Abort unless the operator explicitly confirms.

3. **Second confirmation**
   - Re-state the host list in reverse order and request a second explicit
     confirmation. The wording should force a deliberate yes/no.

4. **Rollback in reverse order**
   - Iterate hosts in reverse of the inventory order.
   - For each host, call `linuxctl_apply_rollback` with `target=<host>`. The
     Go binary enforces the double-confirm natively — honor its prompts.
   - Record per-host success / failure. Do **not** stop on the first failure
     — complete the sweep and surface all failures in the final report so the
     operator can remediate the stuck host(s).

5. **Post-rollback verify**
   - For each host where rollback succeeded, call `linuxctl_apply_verify`
     and include the post-rollback drift in the report.

6. **Report**
   - Table: host, pre-rollback drift, rollback result, post-rollback drift.
   - Call out any hosts that failed to roll back — they need manual
     intervention.

## Failure modes

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| `apply_rollback` refuses | No recent change set recorded for host | That host was already clean or never applied; continue. |
| Rollback partially succeeds | Transient apply failure on a sibling host | Manually inspect the failed host; the stack is in a mixed state. |
| Host unreachable | SSH / network down | Record as "skipped"; operator must rerun once host is back. |

## Example

```
/linuxctl-stack-rollback oracle-rac-prod
```

Expected final report (abbreviated):

```
Rollback order: racnode03 → racnode02 → racnode01
racnode03: success  (drift before: 0, after: 0)
racnode02: success  (drift before: 2, after: 0)
racnode01: success  (drift before: 0, after: 0)
Result: 3/3 rolled back, stack restored to prior baseline.
```

## Plan RAG (infrastructure ADR-0096 v3)

This skill follows the canonical plan template at
`itunified-io/infrastructure/.claude/skills/_shared/PLAN_TEMPLATE.md`:

- Enter plan mode first (`EnterPlanMode`); write canonical plan to the
  active session plan file; `ExitPlanMode`; wait for operator approval
  before any state-changing tool runs.
- Reset TodoWrite at start with all planned steps as `pending`.
- Shared step IDs across plan file row, TodoWrite, Bash description.
- When invoked from `/lab-up`, append to the parent's prefix:
  `"[/lab-up step 4 / linuxctl-stack-apply step N] …"`.
- Update plan file at every phase boundary + material side effect.
