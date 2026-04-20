import { findByName, findByProps } from "@revenge-mod/modules";
import { logger } from "@revenge-mod/modules/common";
import patcher from "@revenge-mod/patcher";

export default {
  start() {
    const SettingsScreen = findByName("UserSettingsOverview", false);

    if (!SettingsScreen) {
      logger.error("test", "Could not find UserSettingsOverview");
      return;
    }

    const React = findByProps("createElement").createElement;
    const Button = findByProps("Button")?.Button;

    if (!Button) {
      logger.error("test", "Button component not found");
      return;
    }

    patcher.after(SettingsScreen, "default", (_, ret) => {
      if (!ret?.props?.children) return;

      const children = Array.isArray(ret.props.children)
        ? ret.props.children
        : [ret.props.children];

      const CrashButton = React(Button, {
        children: "Crash Discord",
        color: "RED",
        onPress: () => {
          throw new Error("INTENTIONAL CRASH - test plugin");
        }
      });

      children.splice(1, 0, CrashButton);
      ret.props.children = children;
    });

    logger.log("test", "Plugin loaded");
  },

  stop() {
    patcher.unpatchAll();
    logger.log("test", "Plugin unloaded");
  }
};
