---
name: linuxctl-stack-apply
description: Run the full 13-manager linuxctl orchestrator across every host in a stack (plan → apply → verify). Use when applying a stack-wide configuration change.
slash_command: /linuxctl-stack-apply
argument_hint: <stack>
---

# /linuxctl-stack-apply `<stack>`

Run the full `linuxctl` orchestrator (all 13 managers: disk, user, package,
service, mount, sysctl, limits, firewall, hosts, network, ssh, selinux, dir)
across every host in the named stack. Four-phase execution: pre-flight → plan
diff per node → apply per node → verify.

## When to use

- Applying a new stack configuration for the first time.
- Rolling out a reviewed change after `/linuxctl-stack-diff` showed expected
  drift.
- Bringing a newly added host into compliance with its stack.

Do **not** use for emergency single-host hotfixes — use the per-manager tools
(`linuxctl_<domain>_apply`) directly against a single target instead.

## Steps

1. **Pre-flight — validate the stack**
   - Call `linuxctl_stack_show` with `stack=<stack>` to resolve env.yaml +
     layers.
   - For every host in the resolved inventory, call `linuxctl_config_validate`
     with `target=<host>`. Abort if any host fails validation.
   - Confirm SSH reachability: for each host, call a cheap read-only tool
     (e.g., `linuxctl_diff`) and check that the call returns without a
     connection error. Report unreachable hosts and abort.

2. **Per-node plan + diff review**
   - For each host in stable order, call `linuxctl_apply_plan` with
     `target=<host>`.
   - Render the planned changes per manager in a compact table (host,
     manager, create/update/delete counts).
   - Print a short summary line: `<host>: <N> changes across <M> managers` —
     or `no changes` if clean.
   - Ask the operator to confirm the full set before applying.

3. **Apply**
   - For each host, call `linuxctl_apply_apply` with `target=<host>`. The Go
     binary enforces the standard confirm level; pass `--yes` semantics only
     if the operator already confirmed in step 2.
   - Stop immediately on the first failure and report which host broke;
     remaining hosts are **not** applied automatically.
   - (Business licence only: single fleet call may be used instead of
     sequential per-host calls — check `linuxctl_license_status` first.)

4. **Verify**
   - For each host that applied successfully, call `linuxctl_apply_verify`
     with `target=<host>`.
   - Aggregate remaining drift per manager.

5. **Report**
   - Summary table: managers run, total changes applied, hosts succeeded vs
     failed, remaining drift items (should be zero for a clean run).
   - Link the run to the originating GitHub issue if one was passed in.

## Failure modes

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| `linuxctl_config_validate` fails for a host | Missing layer file, YAML syntax error | Fix the stack's layer files, rerun pre-flight. |
| SSH unreachable | Host down, firewall, key missing | Run `/linuxctl-stack-cluster-ssh` first. |
| `apply_apply` fails mid-stack | Transient error on one host | Re-run the skill; successfully applied hosts are idempotent. |
| `apply_verify` still reports drift | Manager cannot converge (e.g., locked package) | Inspect the specific `linuxctl_<manager>_verify` output manually. |

## Example

```
/linuxctl-stack-apply oracle-rac-prod
```

Expected report:

```
Stack:    oracle-rac-prod (3 hosts: racnode01, racnode02, racnode03)
Managers: disk, user, package, service, mount, sysctl, limits, firewall, hosts
Changes:  racnode01: 0 | racnode02: 2 (package) | racnode03: 0
Result:   3/3 succeeded, 0 drift remaining
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
