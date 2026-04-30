---
name: linuxctl-stack-cluster-ssh
description: Set up cross-node passwordless SSH trust across a linuxctl stack for the given users (default grid, oracle). Wraps linuxctl_ssh_setup_cluster.
slash_command: /linuxctl-stack-cluster-ssh
argument_hint: <stack> [users=grid,oracle]
---

# /linuxctl-stack-cluster-ssh `<stack>`

Bootstrap passwordless SSH trust between every pair of hosts in a stack, for
the given set of cluster users. Typical use case: preparing Oracle RAC / GI
nodes where `grid` and `oracle` must SSH each other without passwords.

Default users: `["grid", "oracle"]`. Override via operator prompt if the stack
uses different service users.

## When to use

- Before the first `/linuxctl-stack-apply` on a new Oracle RAC stack.
- After adding a new node to an existing cluster (re-run to include the new
  node in the trust mesh).
- When a service user's SSH keys were rotated and the authorized_keys fleet
  must be resynchronized.

## Steps

1. **Resolve the stack**
   - Call `linuxctl_stack_show` with `stack=<stack>` to get the path to the
     stack's `env.yaml`.
   - Extract the full host list for the report.

2. **Confirm users**
   - Default to `["grid", "oracle"]`.
   - If the operator passed an override (e.g., `users=grid,oracle,postgres`),
     use that list instead.
   - Echo the final user list back and request confirmation.

3. **Run setup**
   - Call `linuxctl_ssh_setup_cluster` with:
     - `env` = absolute path to the stack's `env.yaml`
     - `users` = resolved user list
     - `parallel` = `true` (default) unless the operator requested serial
       execution.
   - The Go binary enforces standard confirm level.

4. **Report**
   - For each user, report the public key fingerprint generated/used on each
     host and the resulting count of entries in each host's
     `authorized_keys`.
   - Flag any host where the user is missing (the binary skips those and
     surfaces a warning).

## Failure modes

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| "user not found" on a host | Service user not yet created | Run `/linuxctl-stack-apply` first (user manager creates the accounts). |
| `authorized_keys` count uneven across hosts | Partial distribution failure | Re-run the skill; it is idempotent. |
| Fingerprint differs between runs for same host+user | Keypair regenerated | Only a concern if unexpected — investigate log drift. |

## Example

```
/linuxctl-stack-cluster-ssh oracle-rac-prod
```

Expected report:

```
Stack: oracle-rac-prod (3 hosts)
Users: grid, oracle

grid:
  racnode01  SHA256:abcd…   authorized_keys: 3
  racnode02  SHA256:efgh…   authorized_keys: 3
  racnode03  SHA256:ijkl…   authorized_keys: 3

oracle:
  racnode01  SHA256:mnop…   authorized_keys: 3
  racnode02  SHA256:qrst…   authorized_keys: 3
  racnode03  SHA256:uvwx…   authorized_keys: 3

Result: 2 users × 3 hosts configured, trust mesh complete.
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
