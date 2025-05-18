<p align="center" style="color: #343a40">
  <img
    src="https://github.com/asgardeo/web-ui-sdks/assets/25959096/ae77b70c-6570-40b1-a723-719abd0f7d02" alt="Asgardeo Logo" height="40" width="auto"
  >
  <h1 align="center">
    Asgardeo MCP Node.js SDKs
  </h1>
</p>
<p align="center" style="font-size: 1.2rem;">
  Node.js SDKs for implementing Model Context Protocol (MCP) authorization with <a href="https://wso2.com/asgardeo">Asgardeo</a>
</p>

<div align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache--2.0-blue.svg" alt="License"></a>
  <a href="https://github.com/asgardeo/asgardeo-mcp-node/actions/workflows/release.yml"><img src="https://github.com/asgardeo/asgardeo-mcp-node/actions/workflows/release.yml/badge.svg" alt="🚀 Release"></a>
  <br>
  <br>
</div>

<br>

This repository contains the source code for Node.js SDKs that help you enforce Model Context Protocol (MCP) based
authorization using Asgardeo. If you have any questions, please reach out to us through one of the following channels:

[![Stackoverflow](https://img.shields.io/badge/Ask%20for%20help%20on-Stackoverflow-orange)](https://stackoverflow.com/questions/tagged/wso2is+asgardeo+mcp)
[![Join the chat at https://discord.gg/wso2](https://img.shields.io/badge/Join%20us%20on-Discord-%23e01563.svg)](https://discord.gg/wso2)
[![Follow Asgardeo on Twitter](https://img.shields.io/twitter/follow/Asgardeo?style=social&label=Follow%20Asgardeo)](https://twitter.com/intent/follow?screen_name=Asgardeo)

## Quickstart

For Express.js applications, we recommend using the @asgardeo/mcp-express package.

To get started quickly with Express.js, please refer to the [README.md](./packages/mcp-express/README.md) for
mcp-express.

## Packages

| Package                                                                                                                                                                                 | Description                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [![@asgardeo/mcp-express](https://img.shields.io/npm/v/@asgardeo/mcp-express?color=%234A90E2&label=%40asgardeo%2Fmcp-express&logo=express)](./packages/mcp-express/)     | Express middleware for enforcing MCP authorization using Asgardeo.                 |
| [![@asgardeo/mcp-node](https://img.shields.io/npm/v/@asgardeo/mcp-node?color=%23339933&label=%40asgardeo%2Fmcp-node&logo=nodedotjs)](./packages/mcp-node/) (Placeholder) | Core Node.js utilities for Model Context Protocol (MCP) integration with Asgardeo. |

## Overview

The Model Context Protocol (MCP) is designed to provide a standardized way for applications to convey contextual
information relevant to authorization decisions. These SDKs facilitate the integration of MCP with Asgardeo in Node.js
applications.

- **MCP Express (@asgardeo/mcp-express)**: Middleware specifically tailored for Express.js applications to seamlessly
  integrate MCP-based authorization.
- **MCP Node (@asgardeo/mcp-node)**: Core functionalities and utilities for MCP, which can be used in various Node.js
  environments. The Express middleware may utilize or depend on this core package.

For detailed installation and usage instructions for each package, please refer to the README file within its respective
directory (e.g., `packages/mcp-express/README.md`).

## Contribute

Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct, and the process for
submitting pull requests to us. We highly value your contributions and support!

### Reporting issues

We encourage you to report issues, improvements, and feature requests by creating
[Github Issues](https://github.com/asgardeo/asgardeo-mcp-node/issues).

**Important**: Please be advised that security issues **MUST** be reported to
<a href="mailto:security@wso2.com">security@wso2.com</a>, not as GitHub issues, in order to reach the proper audience.
We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting security issues.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for details.
