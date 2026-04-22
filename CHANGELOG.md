# Changelog

All notable changes to this project will be documented in this file.

## v2026.04.11.1 — 2026-04-22

Initial scaffold. 31 tools wrapping the `linuxctl` Linux host configuration CLI via `execFile`.

- Config: `linuxctl_config_validate`, `linuxctl_config_render`
- Disk: `linuxctl_disk_plan`, `linuxctl_disk_apply`, `linuxctl_disk_verify`
- User: `linuxctl_user_plan`, `linuxctl_user_apply`, `linuxctl_user_verify`
- Package: `linuxctl_package_plan`, `linuxctl_package_apply`, `linuxctl_package_verify`
- Service: `linuxctl_service_plan`, `linuxctl_service_apply`, `linuxctl_service_verify`
- Mount: `linuxctl_mount_plan`, `linuxctl_mount_apply`, `linuxctl_mount_verify`
- Sysctl: `linuxctl_sysctl_plan`, `linuxctl_sysctl_apply`
- Limits: `linuxctl_limits_plan`, `linuxctl_limits_apply`
- Firewall: `linuxctl_firewall_plan`, `linuxctl_firewall_apply`
- Hosts: `linuxctl_hosts_plan`, `linuxctl_hosts_apply`
- Orchestrator: `linuxctl_apply_plan`, `linuxctl_apply_apply`, `linuxctl_apply_verify`, `linuxctl_apply_rollback`, `linuxctl_diff`
- License: `linuxctl_license_status`

Phase 1 of the proxclt + linuxctl plan. Closes #1.
Ref: itunified-io/infrastructure#389
See: infrastructure/docs/plans/025-linuxctl-design.md
