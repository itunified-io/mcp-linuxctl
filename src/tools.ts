import { z } from "zod";
import type { ToolDefinition } from "./plugin.js";

// ─── linuxctl tools (30) ────────────────────────────────────────────
// Each tool maps 1:1 to a `linuxctl <domain> <action>` subcommand.
// `target` is the host target (name from ~/.linuxctl/targets/ or a host ref).

const target = z
  .string()
  .describe("Host target (name from ~/.linuxctl/targets/ or a host reference)");

const name = z
  .string()
  .optional()
  .describe("Optional resource name (user, package, service, mount, etc.)");

const baseSchema = { target, name };

export const tools: ToolDefinition[] = [
  // config
  {
    name: "linuxctl_config_validate",
    description: "Validate the linuxctl config for a target host",
    inputSchema: { target },
    domain: "config",
    action: "validate",
  },
  {
    name: "linuxctl_config_render",
    description: "Render the effective linuxctl config for a target host",
    inputSchema: { target },
    domain: "config",
    action: "render",
  },

  // disk
  {
    name: "linuxctl_disk_plan",
    description: "Plan disk/filesystem changes (partitions, LVM, mkfs)",
    inputSchema: { target },
    domain: "disk",
    action: "plan",
  },
  {
    name: "linuxctl_disk_apply",
    description: "Apply disk/filesystem changes (standard+echo confirm)",
    inputSchema: { target },
    domain: "disk",
    action: "apply",
  },
  {
    name: "linuxctl_disk_verify",
    description: "Verify disk/filesystem state matches desired config",
    inputSchema: { target },
    domain: "disk",
    action: "verify",
  },

  // user
  {
    name: "linuxctl_user_plan",
    description: "Plan user / group / sudoers / SSH key changes",
    inputSchema: { target },
    domain: "user",
    action: "plan",
  },
  {
    name: "linuxctl_user_apply",
    description: "Apply user / group / sudoers / SSH key changes (standard confirm)",
    inputSchema: { target },
    domain: "user",
    action: "apply",
  },
  {
    name: "linuxctl_user_verify",
    description: "Verify user / group state",
    inputSchema: { target },
    domain: "user",
    action: "verify",
  },

  // package
  {
    name: "linuxctl_package_plan",
    description: "Plan package install / remove / upgrade",
    inputSchema: { target },
    domain: "package",
    action: "plan",
  },
  {
    name: "linuxctl_package_apply",
    description: "Apply package changes via apt/dnf/rpm (standard confirm)",
    inputSchema: { target },
    domain: "package",
    action: "apply",
  },
  {
    name: "linuxctl_package_verify",
    description: "Verify installed packages match desired state",
    inputSchema: { target },
    domain: "package",
    action: "verify",
  },

  // service
  {
    name: "linuxctl_service_plan",
    description: "Plan systemd service enable / disable / start / stop",
    inputSchema: { target },
    domain: "service",
    action: "plan",
  },
  {
    name: "linuxctl_service_apply",
    description: "Apply systemd service changes (standard confirm)",
    inputSchema: { target },
    domain: "service",
    action: "apply",
  },
  {
    name: "linuxctl_service_verify",
    description: "Verify systemd service state",
    inputSchema: { target },
    domain: "service",
    action: "verify",
  },

  // mount
  {
    name: "linuxctl_mount_plan",
    description: "Plan filesystem mount / fstab changes",
    inputSchema: { target },
    domain: "mount",
    action: "plan",
  },
  {
    name: "linuxctl_mount_apply",
    description: "Apply mount / fstab changes (standard confirm)",
    inputSchema: { target },
    domain: "mount",
    action: "apply",
  },
  {
    name: "linuxctl_mount_verify",
    description: "Verify mounts match fstab / desired state",
    inputSchema: { target },
    domain: "mount",
    action: "verify",
  },

  // sysctl
  {
    name: "linuxctl_sysctl_plan",
    description: "Plan sysctl kernel parameter changes",
    inputSchema: { target },
    domain: "sysctl",
    action: "plan",
  },
  {
    name: "linuxctl_sysctl_apply",
    description: "Apply sysctl kernel parameter changes (standard confirm)",
    inputSchema: { target },
    domain: "sysctl",
    action: "apply",
  },

  // limits
  {
    name: "linuxctl_limits_plan",
    description: "Plan PAM / ulimit / systemd limit changes",
    inputSchema: { target },
    domain: "limits",
    action: "plan",
  },
  {
    name: "linuxctl_limits_apply",
    description: "Apply PAM / ulimit / systemd limit changes (standard confirm)",
    inputSchema: { target },
    domain: "limits",
    action: "apply",
  },

  // firewall
  {
    name: "linuxctl_firewall_plan",
    description: "Plan host firewall (nftables/ufw/firewalld) changes",
    inputSchema: { target },
    domain: "firewall",
    action: "plan",
  },
  {
    name: "linuxctl_firewall_apply",
    description: "Apply host firewall changes (standard confirm)",
    inputSchema: { target },
    domain: "firewall",
    action: "apply",
  },

  // hosts
  {
    name: "linuxctl_hosts_plan",
    description: "Plan /etc/hosts entries changes",
    inputSchema: { target },
    domain: "hosts",
    action: "plan",
  },
  {
    name: "linuxctl_hosts_apply",
    description: "Apply /etc/hosts entries changes (standard confirm)",
    inputSchema: { target },
    domain: "hosts",
    action: "apply",
  },

  // orchestrator
  {
    name: "linuxctl_apply_plan",
    description: "Plan all domains for a host (unified plan)",
    inputSchema: { target },
    domain: "apply",
    action: "plan",
  },
  {
    name: "linuxctl_apply_apply",
    description: "Apply all domains for a host (standard confirm)",
    inputSchema: { target },
    domain: "apply",
    action: "apply",
  },
  {
    name: "linuxctl_apply_verify",
    description: "Verify all domains for a host match desired state",
    inputSchema: { target },
    domain: "apply",
    action: "verify",
  },
  {
    name: "linuxctl_apply_rollback",
    description: "Rollback the last applied change set (double-confirm)",
    inputSchema: { target },
    domain: "apply",
    action: "rollback",
  },
  {
    name: "linuxctl_diff",
    description: "Show diff between desired config and current host state",
    inputSchema: { target },
    domain: "diff",
    action: "",
  },

  // license
  {
    name: "linuxctl_license_status",
    description: "Show current linuxctl license status",
    inputSchema: {},
    domain: "license",
    action: "status",
  },
];
