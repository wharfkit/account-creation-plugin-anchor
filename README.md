# @wharfkit/account-creation-plugin-anchor

This plugin enables the creation of accounts using Anchor within Wharf projects.

## Usage

-   Install the plugin in your project:

    ```bash
    npm install @wharfkit/account-creation-plugin-anchor
    ```

-   Use the `AccountCreationPluginAnchor` class in your application to facilitate account creation with Anchor. Here's an example of how to integrate it:

    ```ts
    import { SessionKit } from "@wharfkit/session";
    import { AccountCreationPluginAnchor } from "@wharfkit/account-creation-plugin-anchor";

    const sessionKit = new SessionKit(
        {
            // ...other configuration...
        },
        {
            accountCreationPlugins: [new AccountCreationPluginAnchor()],
        }
    );
    ```

Optionally, you can pass a service URL to the plugin to override the default Anchor service URL:

    ```ts
    new AccountCreationPluginAnchor({ serviceUrl: "https://anchor.greymass.com" });
    ```

## Developing

To contribute to this plugin, you will need [Make](https://www.gnu.org/software/make/), [node.js](https://nodejs.org/en/), and [yarn](https://classic.yarnpkg.com/en/docs/install).

-   Clone the repository and run `make` to check out all dependencies and build the project.
-   See the [Makefile](./Makefile) for other useful targets.
-   Ensure code quality by running `make lint` before submitting a pull request.

---

Made with ☕️ & ❤️ by [Greymass](https://greymass.com). If you find this useful, please consider [supporting us](https://greymass.com/support-us).
